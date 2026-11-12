import { describe, expect, it } from "vitest";
import { metadonneesPage } from "@/lib/seo";
import { site } from "@/lib/site";

describe("metadonneesPage", () => {
  const meta = metadonneesPage({
    titre: "Nos services",
    description: "Collecte et réemploi du matériel des entreprises.",
    chemin: "/services",
  });

  it("pose le titre, la description et l'URL canonique de la page", () => {
    expect(meta.title).toBe("Nos services");
    expect(meta.description).toBe("Collecte et réemploi du matériel des entreprises.");
    expect(meta.alternates?.canonical).toBe("/services");
  });

  it("donne à Open Graph l'URL de la page, pas celle de l'accueil", () => {
    expect(meta.openGraph).toMatchObject({
      url: "/services",
      title: "Nos services",
      description: "Collecte et réemploi du matériel des entreprises.",
      siteName: site.nom,
      locale: "fr_FR",
      type: "website",
    });
  });

  it("garde l'image de partage générée du site", () => {
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 }),
    ]);
    expect(meta.twitter?.images).toEqual(["/opengraph-image"]);
  });

  it("reprend titre et description pour les cartes Twitter / X", () => {
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Nos services",
      description: "Collecte et réemploi du matériel des entreprises.",
    });
  });

  it("accepte un titre de partage distinct du titre de l'onglet", () => {
    const accueil = metadonneesPage({
      titre: "Accueil",
      titrePartage: "Respusse — Dons de matériel",
      description: "…",
      chemin: "/",
    });
    expect(accueil.title).toBe("Accueil");
    expect(accueil.openGraph?.title).toBe("Respusse — Dons de matériel");
  });

  it("refuse un chemin qui n'est pas canonique", () => {
    expect(() => metadonneesPage({ titre: "x", description: "x", chemin: "/Services/" })).toThrow();
    expect(() => metadonneesPage({ titre: "x", description: "x", chemin: "services" })).toThrow();
  });
});
