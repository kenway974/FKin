import { describe, expect, it } from "vitest";
import { schemaContact } from "@/lib/validation/contact";

const valide = {
  nom: "Awa Mbemba",
  email: "awa@exemple.fr",
  organisation: "",
  telephone: "",
  typeEmetteur: "entreprise",
  sujet: "25 postes à enlever",
  message: "Nous renouvelons notre parc informatique avant la fin du trimestre.",
  siteWeb: "",
  charge: 1_700_000_000_000,
};

function champsEnErreur(donnees: unknown): string[] {
  const resultat = schemaContact.safeParse(donnees);
  if (resultat.success) return [];
  return [...new Set(resultat.error.issues.map((issue) => String(issue.path[0])))];
}

describe("schemaContact", () => {
  it("accepte un message complet", () => {
    expect(schemaContact.safeParse(valide).success).toBe(true);
  });

  it("accepte l'absence des champs facultatifs", () => {
    const { organisation: _o, telephone: _t, siteWeb: _s, charge: _c, ...minimal } = valide;
    expect(schemaContact.safeParse(minimal).success).toBe(true);
  });

  it("supprime les espaces superflus", () => {
    const resultat = schemaContact.parse({ ...valide, nom: "  Awa  " });
    expect(resultat.nom).toBe("Awa");
  });

  it.each([
    ["nom", { nom: "A" }],
    ["email", { email: "pas-un-email" }],
    ["typeEmetteur", { typeEmetteur: "particulier" }],
    ["sujet", { sujet: "ok" }],
    ["message", { message: "Trop court." }],
    ["message", { message: "x".repeat(4001) }],
    ["telephone", { telephone: "0".repeat(31) }],
  ])("refuse un champ « %s » invalide", (champ, surcharge) => {
    expect(champsEnErreur({ ...valide, ...surcharge })).toEqual([champ]);
  });

  it("refuse un honeypot rempli", () => {
    expect(champsEnErreur({ ...valide, siteWeb: "https://spam.example" })).toEqual(["siteWeb"]);
  });

  it("refuse un horodatage négatif", () => {
    expect(champsEnErreur({ ...valide, charge: -1 })).toEqual(["charge"]);
  });
});
