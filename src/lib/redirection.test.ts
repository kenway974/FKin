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

  it.each([
    ["barre oblique inverse", "/\\evil.com"],
    ["barres mixtes", "/\\/evil.com"],
    ["double barre inverse", "\\\\evil.com"],
    ["tabulation", "/\t/evil.com"],
    ["retour à la ligne", "/\n/evil.com"],
    ["retour chariot", "/\r/evil.com"],
    ["caractère nul", "/\u0000/evil.com"],
    ["espace insécable", "/\u00a0/evil.com"],
    ["espace", "/ /evil.com"],
  ])("rejette une variante normalisée en //evil.com (%s)", (_cas, suite) => {
    expect(destinationApresConnexion(suite)).toBe("/admin");
  });

  it("accepte un chemin contenant une barre inverse encodée, qui reste interne", () => {
    expect(destinationApresConnexion("/admin/%5Cevil.com")).toBe("/admin/%5Cevil.com");
  });

  it("renvoie la chaîne reçue, jamais une version normalisée", () => {
    expect(destinationApresConnexion("/admin/../admin/messages")).toBe("/admin/../admin/messages");
  });

  it.each(["/..//evil.com", "/./..//evil.com", "/admin/../..//evil.com"])(
    "rejette « %s », qui se normalise en //evil.com",
    (suite) => {
      expect(destinationApresConnexion(suite)).toBe("/admin");
    },
  );

  it("refuse les mêmes destinations que le navigateur résoudrait hors du site", () => {
    const base = "https://site.example";
    const tentatives = ["/\\evil.com", "/\t/evil.com", "//evil.com", "https://evil.com"];
    for (const suite of tentatives) {
      expect(new URL(suite, base).origin).not.toBe(base);
      expect(destinationApresConnexion(suite)).toBe("/admin");
    }
  });
});
