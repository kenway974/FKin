import { describe, expect, it } from "vitest";
import { cheminCanonique } from "@/lib/url-canonique";

describe("cheminCanonique", () => {
  it("renvoie null pour un chemin déjà propre", () => {
    expect(cheminCanonique("/")).toBeNull();
    expect(cheminCanonique("/services")).toBeNull();
    expect(cheminCanonique("/actualites/livraison-ordinateurs-kinshasa")).toBeNull();
  });

  it("met le chemin en minuscules", () => {
    expect(cheminCanonique("/Services")).toBe("/services");
    expect(cheminCanonique("/ACTUALITES/Mon-Article")).toBe("/actualites/mon-article");
  });

  it("fusionne les barres obliques répétées", () => {
    expect(cheminCanonique("//services")).toBe("/services");
    expect(cheminCanonique("/actualites//mon-article")).toBe("/actualites/mon-article");
  });

  it("retire la barre oblique finale, sauf pour l'accueil", () => {
    expect(cheminCanonique("/contact/")).toBe("/contact");
    expect(cheminCanonique("/Contact//")).toBe("/contact");
  });

  it("laisse intacts les caractères encodés (leur casse a un sens)", () => {
    expect(cheminCanonique("/actualites/%C3%A9t%C3%A9")).toBeNull();
    expect(cheminCanonique("/Actualites/%C3%A9t%C3%A9")).toBe("/actualites/%C3%A9t%C3%A9");
  });
});
