import { describe, expect, it } from "vitest";
import { schemaQuestionFaq } from "@/lib/validation/contenu";

const questionValide = {
  question: "Certains matériels sont-ils mis en vente ?",
  reponse: "Seul le matériel qu'aucune structure n'a demandé est revendu.",
  public: "tous",
  essentielle: false,
  ordre: 10,
};

describe("schemaQuestionFaq", () => {
  it("accepte une question complète", () => {
    expect(schemaQuestionFaq.safeParse(questionValide).success).toBe(true);
  });

  it("refuse une question trop courte", () => {
    expect(schemaQuestionFaq.safeParse({ ...questionValide, question: "Ok" }).success).toBe(false);
  });

  it("refuse un public inconnu", () => {
    expect(schemaQuestionFaq.safeParse({ ...questionValide, public: "autre" }).success).toBe(false);
  });

  it("refuse une réponse de plus de 2 000 caractères", () => {
    expect(
      schemaQuestionFaq.safeParse({ ...questionValide, reponse: "a".repeat(2001) }).success,
    ).toBe(false);
  });
});
