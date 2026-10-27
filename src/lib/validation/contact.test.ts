import { describe, expect, it } from "vitest";
import { resumerDemande, schemaContact } from "@/lib/validation/contact";

const donValide = {
  typeEmetteur: "entreprise",
  materiel: ["portables", "ecrans"],
  quantite: "11-50",
  etat: "fonctionnel",
  ville: "Lyon",
  delai: "1-mois",
  nom: "Marie Dupont",
  email: "marie@exemple.fr",
};

const besoinValide = {
  typeEmetteur: "beneficiaire",
  materiel: ["fixes"],
  quantite: "1-10",
  structure: "ecole",
  effectifs: "51-200",
  pays: "rdc",
  ville: "Kinshasa",
  nom: "Jean Mbala",
  email: "jean@exemple.cd",
};

describe("schemaContact", () => {
  it("accepte une offre de don complète", () => {
    expect(schemaContact.safeParse(donValide).success).toBe(true);
  });

  it("accepte une demande de structure bénéficiaire complète", () => {
    expect(schemaContact.safeParse(besoinValide).success).toBe(true);
  });

  it("refuse un e-mail invalide", () => {
    expect(schemaContact.safeParse({ ...donValide, email: "pas-un-email" }).success).toBe(false);
  });

  it("refuse une demande sans matériel", () => {
    expect(schemaContact.safeParse({ ...donValide, materiel: [] }).success).toBe(false);
  });

  it("exige les champs propres au parcours choisi", () => {
    expect(schemaContact.safeParse({ ...besoinValide, pays: undefined }).success).toBe(false);
  });

  it("refuse l'envoi quand le champ piège (honeypot) est rempli", () => {
    expect(schemaContact.safeParse({ ...donValide, siteWeb: "http://spam.example" }).success).toBe(
      false,
    );
  });
});

describe("resumerDemande", () => {
  it("résume une offre de don avec le matériel, la quantité et la ville", () => {
    const { sujet, message } = resumerDemande(schemaContact.parse(donValide));
    expect(sujet).toBe("Don : ordinateurs portables, écrans (11 à 50) — Lyon");
    expect(message).toContain("Délai : Dans le mois");
  });

  it("ajoute les précisions à la fin du message", () => {
    const { message } = resumerDemande(
      schemaContact.parse({ ...besoinValide, precisions: "Salle de 20 postes." }),
    );
    expect(message).toMatch(/Lieu : Kinshasa, RD Congo\n\nSalle de 20 postes\.$/);
  });
});
