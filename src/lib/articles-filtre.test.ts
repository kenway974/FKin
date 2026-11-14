import { describe, expect, it } from "vitest";
import {
  CATEGORIES_ARTICLE,
  estCategorieArticle,
  filtrerArticles,
  libelleCategorie,
} from "@/lib/articles-filtre";

const article = (titre: string, categorie: string | null, extrait: string | null = null) => ({
  titre,
  extrait,
  categorie,
});

const articles = [
  article("Que faire des vieux ordinateurs de son entreprise ?", "entreprises"),
  article(
    "Effacer les données avant de donner ses ordinateurs (RGPD)",
    "entreprises",
    "Formater ne suffit pas.",
  ),
  article("Comment équiper une école en ordinateurs gratuitement ?", "beneficiaires"),
  article("Envoyer du matériel informatique au Congo : les étapes", "congo"),
  article("Un article sans catégorie", null),
];

describe("catégories", () => {
  it("propose quatre catégories avec un libellé lisible", () => {
    expect(CATEGORIES_ARTICLE.map((c) => c.id)).toEqual([
      "entreprises",
      "beneficiaires",
      "congo",
      "association",
    ]);
    expect(libelleCategorie("beneficiaires")).toBe("Écoles & associations");
  });

  it("reconnaît une catégorie valide et refuse le reste", () => {
    expect(estCategorieArticle("congo")).toBe(true);
    expect(estCategorieArticle("autre")).toBe(false);
    expect(estCategorieArticle(null)).toBe(false);
  });
});

describe("filtrerArticles", () => {
  it("renvoie tout sans filtre ni recherche", () => {
    expect(filtrerArticles(articles, {})).toHaveLength(5);
  });

  it("filtre par catégorie", () => {
    expect(filtrerArticles(articles, { categorie: "entreprises" }).map((a) => a.titre)).toEqual([
      "Que faire des vieux ordinateurs de son entreprise ?",
      "Effacer les données avant de donner ses ordinateurs (RGPD)",
    ]);
  });

  it("ignore une catégorie inconnue", () => {
    expect(filtrerArticles(articles, { categorie: "nimporte" })).toHaveLength(5);
  });

  it("cherche sans tenir compte des accents ni des majuscules", () => {
    expect(filtrerArticles(articles, { recherche: "ECOLE" }).map((a) => a.categorie)).toEqual([
      "beneficiaires",
    ]);
    expect(filtrerArticles(articles, { recherche: "donnees" })).toHaveLength(1);
  });

  it("cherche aussi dans le chapô", () => {
    expect(filtrerArticles(articles, { recherche: "formater" })).toHaveLength(1);
  });

  it("exige tous les mots de la recherche", () => {
    expect(filtrerArticles(articles, { recherche: "ordinateurs école" })).toHaveLength(1);
    expect(filtrerArticles(articles, { recherche: "ordinateurs" })).toHaveLength(3);
  });

  it("combine catégorie et recherche", () => {
    expect(
      filtrerArticles(articles, { categorie: "congo", recherche: "ordinateurs" }),
    ).toHaveLength(0);
  });

  it("ignore une recherche faite uniquement d'espaces", () => {
    expect(filtrerArticles(articles, { recherche: "   " })).toHaveLength(5);
  });
});

describe("cohérence avec la base", () => {
  it("autorise en base exactement les rubriques du code", async () => {
    const { readFile } = await import("node:fs/promises");
    const schema = await readFile(new URL("../../supabase/schema.sql", import.meta.url), "utf8");
    const contrainte = schema.match(/categorie in \(([^)]*)\)/)?.[1] ?? "";
    const enBase = [...contrainte.matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
    expect(enBase).toEqual(CATEGORIES_ARTICLE.map((c) => c.id));
  });
});
