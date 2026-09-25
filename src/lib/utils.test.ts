import { describe, expect, it } from "vitest";
import { decouperParagraphes, extraireResume, formaterDate, genererSlug } from "@/lib/utils";

describe("genererSlug", () => {
  it("retire les accents, met en minuscules et remplace les espaces", () => {
    expect(genererSlug("Écoles de Kinshasa")).toBe("ecoles-de-kinshasa");
  });

  it("supprime les tirets en début et en fin", () => {
    expect(genererSlug("  — Dons 2025 ! ")).toBe("dons-2025");
  });

  it("limite la longueur à 80 caractères", () => {
    expect(genererSlug("a".repeat(120))).toHaveLength(80);
  });
});

describe("extraireResume", () => {
  it("renvoie le texte tel quel s'il est assez court", () => {
    expect(extraireResume("Un texte   court.")).toBe("Un texte court.");
  });

  it("coupe sans casser un mot et ajoute une ellipse", () => {
    expect(extraireResume("un deux trois quatre", 10)).toBe("un deux…");
  });
});

describe("formaterDate", () => {
  it("formate une date ISO en français long", () => {
    expect(formaterDate("2025-03-12T10:00:00Z")).toBe("12 mars 2025");
  });

  it("renvoie une chaîne vide pour une valeur absente ou invalide", () => {
    expect(formaterDate(null)).toBe("");
    expect(formaterDate("pas une date")).toBe("");
  });
});

describe("decouperParagraphes", () => {
  it("sépare sur les lignes vides et ignore les blocs vides", () => {
    expect(decouperParagraphes("Premier.\n\n\n  Second.  \n\n")).toEqual(["Premier.", "Second."]);
  });
});
