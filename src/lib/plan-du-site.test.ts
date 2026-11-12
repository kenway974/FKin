import { describe, expect, it } from "vitest";
import { construireSitemap, PAGES_INDEXABLES } from "@/lib/plan-du-site";

const URL_SITE = "https://respusse.fr";

const article = (slug: string, updated_at: string, date_publication: string | null = null) => ({
  slug,
  updated_at,
  date_publication,
});

describe("construireSitemap", () => {
  it("liste toutes les pages publiques indexables, sans doublon", () => {
    const urls = construireSitemap({ urlSite: URL_SITE, articles: [], projets: [] }).map(
      (entree) => entree.url,
    );
    expect(urls).toEqual(
      PAGES_INDEXABLES.map((chemin) => (chemin === "/" ? URL_SITE : URL_SITE + chemin)),
    );
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("n'expose ni le back-office, ni la connexion", () => {
    const urls = construireSitemap({ urlSite: URL_SITE, articles: [], projets: [] }).map(
      (entree) => entree.url,
    );
    expect(urls.some((url) => /\/(admin|connexion|deconnexion)/.test(url))).toBe(false);
  });

  it("n'invente aucune date : les pages fixes n'ont pas de lastModified", () => {
    const entrees = construireSitemap({ urlSite: URL_SITE, articles: [], projets: [] });
    for (const entree of entrees) expect(entree.lastModified).toBeUndefined();
  });

  it("n'utilise ni changeFrequency ni priority, ignorés par Google", () => {
    const entrees = construireSitemap({
      urlSite: URL_SITE,
      articles: [article("a", "2026-10-01T10:00:00Z")],
      projets: [],
    });
    for (const entree of entrees) {
      expect(entree).not.toHaveProperty("changeFrequency");
      expect(entree).not.toHaveProperty("priority");
    }
  });

  it("ajoute chaque article avec sa date de dernière modification", () => {
    const entrees = construireSitemap({
      urlSite: URL_SITE,
      articles: [article("convoi-octobre", "2026-10-12T08:00:00Z", "2026-10-10")],
      projets: [],
    });
    expect(entrees).toContainEqual({
      url: `${URL_SITE}/actualites/convoi-octobre`,
      lastModified: "2026-10-12T08:00:00Z",
    });
  });

  it("date les listes et l'accueil du contenu le plus récent qu'ils affichent", () => {
    const entrees = construireSitemap({
      urlSite: URL_SITE,
      articles: [
        article("ancien", "2026-01-01T00:00:00Z"),
        article("recent", "2026-09-01T00:00:00Z"),
      ],
      projets: [{ updated_at: "2026-10-05T00:00:00Z" }, { updated_at: "2026-03-01T00:00:00Z" }],
    });
    const date = (url: string) => entrees.find((entree) => entree.url === url)?.lastModified;

    expect(date(`${URL_SITE}/actualites`)).toBe("2026-09-01T00:00:00Z");
    expect(date(`${URL_SITE}/realisations`)).toBe("2026-10-05T00:00:00Z");
    expect(date(URL_SITE)).toBe("2026-10-05T00:00:00Z");
    expect(date(`${URL_SITE}/services`)).toBeUndefined();
  });
});
