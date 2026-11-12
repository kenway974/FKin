import { describe, expect, it } from "vitest";
import { schemaArticle, schemaProjet } from "@/lib/validation/contenu";

const article = {
  titre: "Départ du troisième conteneur",
  slug: "depart-troisieme-conteneur",
  extrait: "",
  contenu: "Le conteneur est parti du Havre mardi avec quarante postes et dix onduleurs.",
  imageCouverture: "",
  imageAlt: "",
  statut: "publie",
  datePublication: "2026-03-12",
  auteur: "",
};

const projet = {
  titre: "École Saint-Joseph",
  slug: "ecole-saint-joseph",
  description: "Une salle informatique de vingt postes équipée et mise en service.",
  lieu: "Kinshasa",
  dateProjet: "",
  typeMateriel: "Postes informatiques",
  resultat: "Cours d'informatique hebdomadaires pour 300 élèves.",
  imageUrl: "https://exemple.supabase.co/storage/v1/object/public/medias/photo.jpg",
  imageAlt: "Élèves devant les postes",
  publie: true,
  ordre: 0,
};

describe("schemaArticle", () => {
  it("accepte un article valide", () => {
    expect(schemaArticle.safeParse(article).success).toBe(true);
  });

  it.each(["Majuscules", "avec espace", "accentué-é", "-debut", "fin-", "double--tiret", "ab"])(
    "refuse le slug « %s »",
    (slug) => {
      expect(schemaArticle.safeParse({ ...article, slug }).success).toBe(false);
    },
  );

  it("refuse une date au mauvais format", () => {
    expect(schemaArticle.safeParse({ ...article, datePublication: "12/03/2026" }).success).toBe(
      false,
    );
  });

  it("refuse un statut inconnu", () => {
    expect(schemaArticle.safeParse({ ...article, statut: "archive" }).success).toBe(false);
  });

  it("refuse une URL d'image invalide", () => {
    expect(schemaArticle.safeParse({ ...article, imageCouverture: "photo.jpg" }).success).toBe(
      false,
    );
  });
});

describe("schemaProjet", () => {
  it("accepte un projet valide", () => {
    expect(schemaProjet.safeParse(projet).success).toBe(true);
  });

  it.each([-1, 1000, 1.5])("refuse l'ordre %s", (ordre) => {
    expect(schemaProjet.safeParse({ ...projet, ordre }).success).toBe(false);
  });

  it("exige un résultat décrit", () => {
    expect(schemaProjet.safeParse({ ...projet, resultat: "Bien." }).success).toBe(false);
  });
});
