import { describe, expect, it } from "vitest";
import { FAQ, questionsFaq } from "@/lib/faq";
import type { LigneFaq } from "@/types/database";

describe("questionsFaq", () => {
  it("affiche la FAQ du code quand la base est vide", () => {
    expect(questionsFaq([])).toEqual(FAQ);
  });

  it("reprend les questions de la base dans l'ordre reçu", () => {
    const ligne = (question: string, ordre: number): LigneFaq => ({
      id: String(ordre),
      question,
      reponse: "Une réponse.",
      public: "tous",
      essentielle: ordre === 0,
      ordre,
      created_at: "",
      updated_at: "",
    });
    expect(questionsFaq([ligne("Première ?", 0), ligne("Seconde ?", 1)])).toEqual([
      { question: "Première ?", reponse: "Une réponse.", public: "tous", essentielle: true },
      { question: "Seconde ?", reponse: "Une réponse.", public: "tous", essentielle: false },
    ]);
  });
});
