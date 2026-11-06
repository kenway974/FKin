import { describe, expect, it } from "vitest";
import {
  schemaArticle,
  schemaCoordonnees,
  schemaProjet,
  schemaQuestionFaq,
} from "@/lib/validation/contenu";

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

  it("explique en français une position vide ou trop grande", () => {
    const message = (ordre: number) =>
      schemaQuestionFaq.safeParse({ ...questionValide, ordre }).error?.issues[0]?.message;
    expect(message(Number.NaN)).toBe("Indiquez une position (nombre entier).");
    expect(message(100)).toBe("99 au maximum.");
  });

  it("refuse une réponse de plus de 2 000 caractères", () => {
    expect(
      schemaQuestionFaq.safeParse({ ...questionValide, reponse: "a".repeat(2001) }).success,
    ).toBe(false);
  });
});

const coordonneesValides = {
  email: "respusse@gmail.com",
  telephone: "",
  rue: "",
  codePostal: "94240",
  ville: "L'Haÿ-les-Roses",
  adresseRdc: "Avenue Soki n° 20, commune de Mont-Ngafula, Kinshasa",
  whatsapp: "",
};

const coordonneesAcceptees = (champs: Partial<typeof coordonneesValides>) =>
  schemaCoordonnees.safeParse({ ...coordonneesValides, ...champs }).success;

describe("schemaCoordonnees", () => {
  it("accepte les coordonnées actuelles du site", () => {
    expect(coordonneesAcceptees({})).toBe(true);
  });

  it("refuse un e-mail invalide", () => {
    expect(coordonneesAcceptees({ email: "pas-un-email" })).toBe(false);
  });

  it("exige un code postal à 5 chiffres", () => {
    expect(coordonneesAcceptees({ codePostal: "9424" })).toBe(false);
    expect(coordonneesAcceptees({ codePostal: "94240" })).toBe(true);
  });

  it("accepte un téléphone vide ou au format international, pas du texte", () => {
    expect(coordonneesAcceptees({ telephone: "" })).toBe(true);
    expect(coordonneesAcceptees({ telephone: "+33 6 12 34 56 78" })).toBe(true);
    expect(coordonneesAcceptees({ telephone: "abc" })).toBe(false);
    expect(coordonneesAcceptees({ telephone: "+" })).toBe(false);
    expect(coordonneesAcceptees({ telephone: "()" })).toBe(false);
  });

  it("accepte un WhatsApp vide ou d'au moins 8 chiffres", () => {
    expect(coordonneesAcceptees({ whatsapp: "" })).toBe(true);
    expect(coordonneesAcceptees({ whatsapp: "+243 81 234 5678" })).toBe(true);
    expect(coordonneesAcceptees({ whatsapp: "12" })).toBe(false);
    expect(coordonneesAcceptees({ whatsapp: "abc" })).toBe(false);
  });

  it("refuse une ville d'un seul caractère", () => {
    expect(coordonneesAcceptees({ ville: "A" })).toBe(false);
  });

  it("accepte une rue et une adresse à Kinshasa vides", () => {
    expect(coordonneesAcceptees({ rue: "", adresseRdc: "" })).toBe(true);
  });

  it("refuse une adresse à Kinshasa de plus de 200 caractères", () => {
    expect(coordonneesAcceptees({ adresseRdc: "a".repeat(201) })).toBe(false);
  });
});

const articleValide = {
  titre: "Livraison d'ordinateurs",
  slug: "livraison-ordinateurs",
  extrait: "",
  contenu: "Un contenu suffisamment long pour dépasser la limite des cinquante caractères.",
  imageCouverture: "",
  imageAlt: "",
  statut: "publie",
  datePublication: "2026-10-01",
  auteur: "",
};

const projetValide = {
  titre: "Équipement d'une école",
  slug: "equipement-ecole",
  description: "Remise de postes informatiques reconditionnés à une école.",
  lieu: "Brazzaville",
  dateProjet: "",
  typeMateriel: "Informatique",
  resultat: "Une salle informatique ouverte aux élèves.",
  imageUrl: "",
  imageAlt: "",
  publie: true,
  ordre: 0,
  latitude: null,
  longitude: null,
};

describe("URL d'image des articles et des projets", () => {
  it.each([
    "https://abc.supabase.co/storage/v1/object/public/medias/a.webp",
    "http://example.org/image.jpg",
    "",
  ])("accepte « %s »", (url) => {
    expect(schemaArticle.safeParse({ ...articleValide, imageCouverture: url }).success).toBe(true);
    expect(schemaProjet.safeParse({ ...projetValide, imageUrl: url }).success).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "data:image/svg+xml;base64,PHN2Zz4=",
    "file:///etc/passwd",
    "ftp://example.org/image.jpg",
    "vbscript:msgbox(1)",
    "pas une url",
  ])("refuse « %s »", (url) => {
    const article = schemaArticle.safeParse({ ...articleValide, imageCouverture: url });
    const projet = schemaProjet.safeParse({ ...projetValide, imageUrl: url });
    expect(article.success).toBe(false);
    expect(article.error?.issues[0]?.path).toEqual(["imageCouverture"]);
    expect(projet.success).toBe(false);
    expect(projet.error?.issues[0]?.path).toEqual(["imageUrl"]);
  });
});
