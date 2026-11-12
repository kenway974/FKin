import { describe, expect, it } from "vitest";
import {
  cn,
  decouperParagraphes,
  extraireResume,
  formaterDate,
  formaterDateHeure,
  genererSlug,
} from "@/lib/utils";

describe("cn", () => {
  it("fusionne les classes et résout les conflits Tailwind", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "hidden", undefined, "font-bold")).toBe("text-sm font-bold");
  });
});

describe("formaterDate", () => {
  it("formate une date ISO en français long", () => {
    expect(formaterDate("2025-03-12")).toBe("12 mars 2025");
  });

  it("accepte un objet Date", () => {
    expect(formaterDate(new Date(2024, 0, 1))).toBe("1 janvier 2024");
  });

  it("renvoie une chaîne vide pour une valeur absente ou invalide", () => {
    expect(formaterDate(null)).toBe("");
    expect(formaterDate(undefined)).toBe("");
    expect(formaterDate("")).toBe("");
    expect(formaterDate("pas une date")).toBe("");
  });
});

describe("formaterDateHeure", () => {
  it("inclut l'heure", () => {
    expect(formaterDateHeure(new Date(2025, 2, 12, 14, 30))).toBe("12 mars 2025 à 14:30");
  });

  it("renvoie une chaîne vide pour une valeur invalide", () => {
    expect(formaterDateHeure("n'importe quoi")).toBe("");
  });
});

describe("genererSlug", () => {
  it("retire les accents, la casse et la ponctuation", () => {
    expect(genererSlug("Écoles de Kinshasa !")).toBe("ecoles-de-kinshasa");
    expect(genererSlug("  Convoi n°3 : départ du Havre  ")).toBe("convoi-n-3-depart-du-havre");
  });

  it("limite la longueur à 80 caractères", () => {
    expect(genererSlug("a".repeat(200))).toHaveLength(80);
  });

  it("produit un slug accepté par le schéma du back-office", () => {
    expect(genererSlug("L'été à Matadi — 2025")).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
});

describe("extraireResume", () => {
  it("laisse intact un texte court en normalisant les espaces", () => {
    expect(extraireResume("Un   texte\ncourt.")).toBe("Un texte court.");
  });

  it("coupe sur une frontière de mot et ajoute une ellipse", () => {
    const resume = extraireResume("Le matériel est arrivé à Kinshasa en bon état", 20);
    expect(resume).toBe("Le matériel est…");
    expect(resume.length).toBeLessThanOrEqual(21);
  });
});

describe("decouperParagraphes", () => {
  it("sépare sur les lignes vides et ignore les blocs vides", () => {
    expect(decouperParagraphes("Premier.\n\n\nDeuxième\nsuite.\n\n  \n\nTroisième.  ")).toEqual([
      "Premier.",
      "Deuxième\nsuite.",
      "Troisième.",
    ]);
  });

  it("renvoie une liste vide pour un contenu vide", () => {
    expect(decouperParagraphes("")).toEqual([]);
  });
});
