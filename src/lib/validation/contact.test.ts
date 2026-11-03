import { describe, expect, it } from "vitest";
import { schemaContact, type DonneesContact } from "./contact";

const valide: DonneesContact = {
  nom: "Awa Diallo",
  email: "awa@example.org",
  organisation: "",
  telephone: "",
  typeEmetteur: "entreprise",
  sujet: "Don de matériel informatique",
  message: "Nous disposons de vingt ordinateurs portables à donner.",
  siteWeb: "",
  charge: 1_700_000_000_000,
};

/** Renvoie les champs en erreur pour une saisie donnée. */
function champsEnErreur(saisie: unknown): string[] {
  const resultat = schemaContact.safeParse(saisie);
  if (resultat.success) return [];
  return resultat.error.issues.map((issue) => String(issue.path[0]));
}

describe("schemaContact", () => {
  it("accepte une saisie complète et valide", () => {
    expect(schemaContact.safeParse(valide).success).toBe(true);
  });

  it("accepte l'absence des champs facultatifs", () => {
    const { organisation, telephone, siteWeb, charge, ...minimal } = valide;
    void organisation;
    void telephone;
    void siteWeb;
    void charge;
    expect(schemaContact.safeParse(minimal).success).toBe(true);
  });

  describe("champs obligatoires", () => {
    it.each(["nom", "email", "typeEmetteur", "sujet", "message"] as const)(
      "refuse une saisie sans « %s »",
      (champ) => {
        const saisie: Record<string, unknown> = { ...valide };
        delete saisie[champ];
        expect(champsEnErreur(saisie)).toContain(champ);
      },
    );

    it("refuse un nom composé uniquement d'espaces", () => {
      expect(champsEnErreur({ ...valide, nom: "     " })).toContain("nom");
    });

    it("refuse un type d'émetteur hors liste", () => {
      expect(champsEnErreur({ ...valide, typeEmetteur: "particulier" })).toContain("typeEmetteur");
    });
  });

  describe("e-mail", () => {
    it.each(["pas-un-email", "awa@", "@example.org", "awa example.org", "awa@example"])(
      "refuse « %s »",
      (email) => {
        expect(champsEnErreur({ ...valide, email })).toContain("email");
      },
    );

    it("refuse une adresse de plus de 180 caractères", () => {
      const email = `${"a".repeat(169)}@example.org`; // 181 caractères
      expect(email).toHaveLength(181);
      expect(champsEnErreur({ ...valide, email })).toContain("email");
    });
  });

  describe("honeypot (siteWeb)", () => {
    it("refuse l'envoi si le champ piège est rempli", () => {
      const resultat = schemaContact.safeParse({ ...valide, siteWeb: "https://spam.example" });
      expect(resultat.success).toBe(false);
      expect(resultat.error?.issues[0]?.message).toBe("Envoi refusé.");
    });

    it("refuse même un seul caractère", () => {
      expect(champsEnErreur({ ...valide, siteWeb: "x" })).toContain("siteWeb");
    });
  });

  describe("bornes de longueur", () => {
    const bornes = [
      { champ: "nom", min: 2, max: 120 },
      { champ: "sujet", min: 3, max: 180 },
      { champ: "message", min: 20, max: 4000 },
    ] as const;

    for (const { champ, min, max } of bornes) {
      it(`${champ} : accepte ${min} et ${max} caractères`, () => {
        expect(champsEnErreur({ ...valide, [champ]: "a".repeat(min) })).toEqual([]);
        expect(champsEnErreur({ ...valide, [champ]: "a".repeat(max) })).toEqual([]);
      });

      it(`${champ} : refuse ${min - 1} et ${max + 1} caractères`, () => {
        expect(champsEnErreur({ ...valide, [champ]: "a".repeat(min - 1) })).toContain(champ);
        expect(champsEnErreur({ ...valide, [champ]: "a".repeat(max + 1) })).toContain(champ);
      });
    }

    it("compte la longueur après suppression des espaces", () => {
      expect(champsEnErreur({ ...valide, nom: "  a  " })).toContain("nom");
    });

    it("organisation : 160 caractères maximum", () => {
      expect(champsEnErreur({ ...valide, organisation: "a".repeat(160) })).toEqual([]);
      expect(champsEnErreur({ ...valide, organisation: "a".repeat(161) })).toContain(
        "organisation",
      );
    });

    it("téléphone : 30 caractères maximum", () => {
      expect(champsEnErreur({ ...valide, telephone: "0".repeat(30) })).toEqual([]);
      expect(champsEnErreur({ ...valide, telephone: "0".repeat(31) })).toContain("telephone");
    });
  });

  describe("horodatage (charge)", () => {
    it.each([-1, 1.5, "1700000000000"])("refuse la valeur %s", (charge) => {
      expect(champsEnErreur({ ...valide, charge })).toContain("charge");
    });
  });
});
