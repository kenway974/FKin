import { describe, expect, it } from "vitest";
import { destinationApresConnexion } from "./redirection";

describe("destinationApresConnexion", () => {
  it.each(["/admin", "/admin/messages", "/admin/articles/42?onglet=apercu", "/"])(
    "accepte le chemin interne « %s »",
    (suite) => {
      expect(destinationApresConnexion(suite)).toBe(suite);
    },
  );

  it.each([
    "https://evil.com",
    "http://evil.com/admin",
    "//evil.com",
    "//evil.com/admin",
    "javascript:alert(1)",
    "evil.com",
    "admin",
    " /admin",
  ])("rejette « %s » et renvoie vers /admin", (suite) => {
    expect(destinationApresConnexion(suite)).toBe("/admin");
  });

  it("renvoie vers /admin sans paramètre", () => {
    expect(destinationApresConnexion(null)).toBe("/admin");
    expect(destinationApresConnexion("")).toBe("/admin");
  });

  // Limite connue, NON corrigée ici (aucun changement de comportement) :
  // les navigateurs normalisent « \ » en « / » et suppriment tabulations et
  // sauts de ligne, si bien que « /\evil.com » ou « /<TAB>/evil.com » mènent à
  // evil.com. Voir le récapitulatif de sécurité.
  it.todo("rejette « /\\evil.com » et les variantes avec caractères de contrôle");
});
