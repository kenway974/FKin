import { describe, expect, it } from "vitest";
import { schemaArticle, schemaProjet, type DonneesArticle, type DonneesProjet } from "./contenu";

function champsEnErreur(
  schema: typeof schemaArticle | typeof schemaProjet,
  saisie: unknown,
): string[] {
  const resultat = schema.safeParse(saisie);
  if (resultat.success) return [];
  return resultat.error.issues.map((issue) => String(issue.path[0]));
}

const article: DonneesArticle = {
  titre: "Livraison à Brazzaville",
  slug: "livraison-brazzaville-2026",
  extrait: "Retour sur la dernière livraison.",
  contenu: "Un contenu suffisamment long pour dépasser la limite des cinquante caractères.",
  imageCouverture: "https://example.org/image.jpg",
  imageAlt: "Cartons sur un quai",
  statut: "publie",
  datePublication: "2026-10-01",
  auteur: "L'équipe",
};

const projet: DonneesProjet = {
  titre: "Équipement d'un dispensaire",
  slug: "dispensaire-pointe-noire",
  description: "Remise de lits médicalisés et de matériel de soin à un dispensaire.",
  lieu: "Pointe-Noire",
  dateProjet: "2026-06-15",
  typeMateriel: "Matériel médical",
  resultat: "Douze lits installés et opérationnels.",
  imageUrl: "",
  imageAlt: "",
  publie: true,
  ordre: 0,
};

describe("schemaArticle", () => {
  it("accepte un article valide", () => {
    expect(schemaArticle.safeParse(article).success).toBe(true);
  });

  it("accepte les champs facultatifs vides", () => {
    const saisie = {
      ...article,
      extrait: "",
      imageCouverture: "",
      imageAlt: "",
      datePublication: "",
      auteur: "",
      statut: "brouillon",
    };
    expect(schemaArticle.safeParse(saisie).success).toBe(true);
  });

  it.each([
    ["titre trop court", { titre: "ab" }, "titre"],
    ["titre trop long", { titre: "a".repeat(181) }, "titre"],
    ["contenu trop court", { contenu: "a".repeat(49) }, "contenu"],
    ["extrait trop long", { extrait: "a".repeat(301) }, "extrait"],
    ["statut inconnu", { statut: "archive" }, "statut"],
    ["date au mauvais format", { datePublication: "01/10/2026" }, "datePublication"],
    ["image non URL", { imageCouverture: "pas une url" }, "imageCouverture"],
    ["description d'image trop longue", { imageAlt: "a".repeat(201) }, "imageAlt"],
  ])("refuse : %s", (_cas, surcharge, champ) => {
    expect(champsEnErreur(schemaArticle, { ...article, ...surcharge })).toContain(champ);
  });

  describe("slug", () => {
    it.each(["abc", "mon-article", "article-2026", "a1-b2-c3"])("accepte « %s »", (slug) => {
      expect(champsEnErreur(schemaArticle, { ...article, slug })).toEqual([]);
    });

    it.each([
      "ab", // trop court
      "a".repeat(81), // trop long
      "Mon-Article", // majuscules
      "mon article", // espace
      "mon_article", // underscore
      "-article", // tiret initial
      "article-", // tiret final
      "mon--article", // tirets doublés
      "été", // accents
      "../admin", // traversée
    ])("refuse « %s »", (slug) => {
      expect(champsEnErreur(schemaArticle, { ...article, slug })).toContain("slug");
    });
  });
});

describe("schemaProjet", () => {
  it("accepte un projet valide", () => {
    expect(schemaProjet.safeParse(projet).success).toBe(true);
  });

  it("accepte l'ordre aux bornes 0 et 999", () => {
    expect(champsEnErreur(schemaProjet, { ...projet, ordre: 0 })).toEqual([]);
    expect(champsEnErreur(schemaProjet, { ...projet, ordre: 999 })).toEqual([]);
  });

  it.each([
    ["description trop courte", { description: "a".repeat(29) }, "description"],
    ["lieu manquant", { lieu: " " }, "lieu"],
    ["type de matériel trop long", { typeMateriel: "a".repeat(201) }, "typeMateriel"],
    ["résultat trop court", { resultat: "a".repeat(9) }, "resultat"],
    ["résultat trop long", { resultat: "a".repeat(601) }, "resultat"],
    ["ordre négatif", { ordre: -1 }, "ordre"],
    ["ordre trop grand", { ordre: 1000 }, "ordre"],
    ["ordre décimal", { ordre: 1.5 }, "ordre"],
    ["publie non booléen", { publie: "oui" }, "publie"],
    ["date au mauvais format", { dateProjet: "2026-6-15" }, "dateProjet"],
    ["image non URL", { imageUrl: "pas une url" }, "imageUrl"],
  ])("refuse : %s", (_cas, surcharge, champ) => {
    expect(champsEnErreur(schemaProjet, { ...projet, ...surcharge })).toContain(champ);
  });

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "data:image/svg+xml;base64,PHN2Zz4=",
    "file:///etc/passwd",
    "ftp://example.org/image.jpg",
    "vbscript:msgbox(1)",
  ])("refuse l'URL d'image hors http(s) « %s »", (url) => {
    expect(champsEnErreur(schemaProjet, { ...projet, imageUrl: url })).toContain("imageUrl");
    expect(champsEnErreur(schemaArticle, { ...article, imageCouverture: url })).toContain(
      "imageCouverture",
    );
  });

  it.each([
    "https://abc.supabase.co/storage/v1/object/public/medias/a.webp",
    "http://example.org/image.jpg",
  ])("accepte l'URL d'image « %s »", (url) => {
    expect(champsEnErreur(schemaProjet, { ...projet, imageUrl: url })).toEqual([]);
  });
});
