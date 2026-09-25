import { describe, expect, it } from "vitest";
import { schemaContact } from "@/lib/validation/contact";

const messageValide = {
  nom: "Marie Dupont",
  email: "marie@exemple.fr",
  typeEmetteur: "entreprise",
  sujet: "Don de 20 ordinateurs",
  message: "Nous renouvelons notre parc et souhaitons donner nos anciens postes.",
};

describe("schemaContact", () => {
  it("accepte un message complet", () => {
    expect(schemaContact.safeParse(messageValide).success).toBe(true);
  });

  it("refuse un e-mail invalide", () => {
    expect(schemaContact.safeParse({ ...messageValide, email: "pas-un-email" }).success).toBe(
      false,
    );
  });

  it("refuse un message trop court", () => {
    expect(schemaContact.safeParse({ ...messageValide, message: "Trop court." }).success).toBe(
      false,
    );
  });

  it("refuse l'envoi quand le champ piège (honeypot) est rempli", () => {
    expect(
      schemaContact.safeParse({ ...messageValide, siteWeb: "http://spam.example" }).success,
    ).toBe(false);
  });
});
