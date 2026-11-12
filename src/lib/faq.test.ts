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

describe("FAQ du code", () => {
  it("respecte les contraintes de la table `faq`", () => {
    for (const { question, reponse } of FAQ) {
      expect(question.trim().length).toBeGreaterThanOrEqual(3);
      expect(question.trim().length).toBeLessThanOrEqual(200);
      expect(reponse.trim().length).toBeLessThanOrEqual(2000);
    }
  });

  it("ne contient pas deux fois la même question", () => {
    const questions = FAQ.map((element) => element.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("propose les mêmes questions que le contenu de départ de la base", async () => {
    const { readFile } = await import("node:fs/promises");
    const schema = await readFile(new URL("../../supabase/schema.sql", import.meta.url), "utf8");
    for (const { question } of FAQ) {
      expect(schema).toContain(`'${question.replaceAll("'", "''")}'`);
    }
  });
});
