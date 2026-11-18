import { describe, expect, it } from "vitest";
import { filAriane } from "@/lib/fil-ariane";

const URL_SITE = "https://www.respusse.com";

describe("filAriane", () => {
  it("décrit le chemin depuis l'accueil, avec des positions à partir de 1", () => {
    expect(
      filAriane(URL_SITE, [
        { nom: "Actualités", chemin: "/actualites" },
        { nom: "Le convoi de septembre", chemin: "/actualites/convoi-septembre" },
      ]),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: URL_SITE },
        { "@type": "ListItem", position: 2, name: "Actualités", item: `${URL_SITE}/actualites` },
        {
          "@type": "ListItem",
          position: 3,
          name: "Le convoi de septembre",
          item: `${URL_SITE}/actualites/convoi-septembre`,
        },
      ],
    });
  });

  it("refuse un chemin qui n'est pas canonique", () => {
    expect(() => filAriane(URL_SITE, [{ nom: "Services", chemin: "/Services/" }])).toThrow();
  });
});
