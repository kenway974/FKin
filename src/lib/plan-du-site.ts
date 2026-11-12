import type { MetadataRoute } from "next";

/**
 * Contenu de /sitemap.xml, calculé à partir des données publiées.
 *
 * Règles :
 *  - seules les pages publiques indexables y figurent (ni back-office, ni
 *    connexion), sous leur URL canonique exacte ;
 *  - aucune date inventée : `lastModified` n'est renseigné que lorsqu'on le
 *    connaît réellement (date de modification d'un article ou d'un projet).
 *    Une date qui change à chaque génération apprend aux moteurs à l'ignorer ;
 *  - pas de `changeFrequency` ni de `priority` : Google les ignore.
 */

/** Pages publiques à fournir aux moteurs, dans l'ordre de la navigation. */
export const PAGES_INDEXABLES = [
  "/",
  "/services",
  "/realisations",
  "/comment-ca-marche",
  "/actualites",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
] as const;

type ArticlePlan = { slug: string; updated_at: string; date_publication: string | null };
type ProjetPlan = { updated_at: string };

/** Date ISO la plus récente d'une liste, ou `undefined` si elle est vide. */
function plusRecente(dates: string[]): string | undefined {
  return dates.reduce<string | undefined>(
    (max, date) => (max === undefined || Date.parse(date) > Date.parse(max) ? date : max),
    undefined,
  );
}

export function construireSitemap({
  urlSite,
  articles,
  projets,
}: {
  /** URL du site, sans barre oblique finale. */
  urlSite: string;
  articles: ArticlePlan[];
  projets: ProjetPlan[];
}): MetadataRoute.Sitemap {
  const dateArticles = (article: ArticlePlan) => article.updated_at ?? article.date_publication;
  const derniereActualite = plusRecente(articles.map(dateArticles).filter(Boolean));
  const derniereRealisation = plusRecente(projets.map((projet) => projet.updated_at));

  // Une page qui affiche une liste change quand son élément le plus récent
  // change ; l'accueil reprend les dernières actualités et réalisations.
  const dates: Partial<Record<(typeof PAGES_INDEXABLES)[number], string | undefined>> = {
    "/": plusRecente([derniereActualite, derniereRealisation].filter((d) => d !== undefined)),
    "/actualites": derniereActualite,
    "/realisations": derniereRealisation,
  };

  const pages = PAGES_INDEXABLES.map((chemin) => {
    // L'accueil a pour URL canonique l'origine nue, comme la balise
    // `<link rel="canonical">` générée par Next.js.
    const entree: MetadataRoute.Sitemap[number] = {
      url: chemin === "/" ? urlSite : `${urlSite}${chemin}`,
    };
    const date = dates[chemin];
    if (date) entree.lastModified = date;
    return entree;
  });

  const pagesArticles = articles.map((article) => ({
    url: `${urlSite}/actualites/${article.slug}`,
    lastModified: dateArticles(article),
  }));

  return [...pages, ...pagesArticles];
}
