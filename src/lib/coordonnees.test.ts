import { describe, expect, it } from "vitest";
import {
  destinatairesNotification,
  fusionnerCoordonnees,
  lienTelephone,
  lienWhatsApp,
  resoudreWhatsApp,
} from "@/lib/coordonnees";
import type { LigneCoordonnees } from "@/types/database";

const ligne = (champs: Partial<LigneCoordonnees>): LigneCoordonnees => ({
  id: true,
  email: "contact@respusse.org",
  telephone: null,
  rue: null,
  code_postal: "75001",
  ville: "Paris",
  adresse_rdc: "Avenue Soki n° 20",
  whatsapp: null,
  updated_at: "2026-10-29T00:00:00Z",
  ...champs,
});

describe("fusionnerCoordonnees", () => {
  it("reprend les coordonnées du code quand la base est illisible", () => {
    expect(fusionnerCoordonnees(null)).toEqual({
      email: "respusse@gmail.com",
      telephone: "",
      rue: "",
      codePostal: "94240",
      ville: "L'Haÿ-les-Roses",
      pays: "FR",
      adresseRdc: "Avenue Soki n° 20, commune de Mont-Ngafula, Kinshasa",
      whatsapp: "",
    });
  });

  it("complète champ par champ une ligne partielle", () => {
    const resultat = fusionnerCoordonnees(ligne({ ville: null, email: "  ", telephone: "06 12" }));
    expect(resultat.ville).toBe("L'Haÿ-les-Roses");
    expect(resultat.email).toBe("respusse@gmail.com");
    expect(resultat.telephone).toBe("06 12");
    expect(resultat.codePostal).toBe("75001");
  });

  it("masque l'adresse de Kinshasa vidée par l'admin", () => {
    expect(fusionnerCoordonnees(ligne({ adresse_rdc: null })).adresseRdc).toBe("");
  });

  it("n'affiche jamais le téléphone provisoire du code", () => {
    expect(fusionnerCoordonnees(ligne({ telephone: null })).telephone).toBe("");
    expect(fusionnerCoordonnees(null).telephone).toBe("");
  });
});

describe("lienTelephone", () => {
  it("retire les séparateurs du lien tel:", () => {
    expect(lienTelephone("+33 (0)6 12.34-56 78")).toBe("tel:+330612345678");
  });

  it("ne produit aucun lien sans numéro", () => {
    expect(lienTelephone("")).toBeNull();
  });
});

describe("destinatairesNotification", () => {
  it("préfère l'e-mail saisi dans le back-office", () => {
    expect(destinatairesNotification("a@b.fr", "x@y.fr")).toEqual(["a@b.fr"]);
  });

  it("retombe sur la variable d'environnement, qui peut lister plusieurs adresses", () => {
    expect(destinatairesNotification(null, "x@y.fr, z@y.fr")).toEqual(["x@y.fr", "z@y.fr"]);
  });

  it("ne renvoie personne si rien n'est configuré", () => {
    expect(destinatairesNotification(" ", undefined)).toEqual([]);
  });
});

describe("resoudreWhatsApp", () => {
  it("prend le numéro saisi dans le back-office, chiffres seuls", () => {
    expect(resoudreWhatsApp("+243 81 000", "33611", false)).toEqual({
      numero: "24381000",
      exemple: false,
    });
  });

  it("retombe sur la variable d'environnement", () => {
    expect(resoudreWhatsApp("", "33611", false)).toEqual({ numero: "33611", exemple: false });
  });

  it("utilise le numéro d'exemple hors production seulement", () => {
    expect(resoudreWhatsApp("", "", true)).toEqual({ numero: "33600000000", exemple: true });
    expect(resoudreWhatsApp("", "", false)).toEqual({ numero: "", exemple: false });
  });
});

describe("lienWhatsApp", () => {
  it("ne produit aucun lien sans numéro", () => {
    expect(lienWhatsApp("")).toBeNull();
  });

  it("préremplit le message d'accueil", () => {
    expect(lienWhatsApp("33611")).toBe(
      "https://wa.me/33611?text=Bonjour%2C%20je%20vous%20%C3%A9cris%20depuis%20le%20site%20de%20Respusse.",
    );
  });
});
