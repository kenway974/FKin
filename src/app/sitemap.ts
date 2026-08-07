import type { MetadataRoute } from "next";
import { urlSite } from "@/lib/env";
import { listerArticlesPublies } from "@/lib/data";

/**
 * Génère /sitemap.xml.
 *
 * Les pages fixes sont listées en dur ; les articles publiés sont ajoutés
 * depuis la base. Si Supabase n'est pas encore branché, la lecture renvoie une
 * liste vide et le sitemap ne contient que les pages fixes — sans erreur.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const maintenant = new Date();

  const pagesFixes: MetadataRoute.Sitemap = [
    { url: `${urlSite}/`, lastModified: maintenant, changeFrequency: "monthly", priority: 1 },
    {
      url: `${urlSite}/services`,
      lastModified: maintenant,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${urlSite}/realisations`,
      lastModified: maintenant,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${urlSite}/comment-ca-marche`,
      lastModified: maintenant,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${urlSite}/actualites`,
      lastModified: maintenant,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${urlSite}/contact`,
      lastModified: maintenant,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${urlSite}/mentions-legales`,
      lastModified: maintenant,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${urlSite}/confidentialite`,
      lastModified: maintenant,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const articles = await listerArticlesPublies();

  const pagesArticles: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${urlSite}/actualites/${article.slug}`,
    lastModified: new Date(article.updated_at ?? article.date_publication ?? maintenant),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pagesFixes, ...pagesArticles];
}
