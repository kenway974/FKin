import type { MetadataRoute } from "next";
import { urlSite } from "@/lib/env";
import { listerArticlesPublies, listerProjetsPublies } from "@/lib/data";
import { construireSitemap } from "@/lib/plan-du-site";

/**
 * Génère /sitemap.xml (règles détaillées dans `lib/plan-du-site.ts`).
 *
 * Si Supabase n'est pas branché, les lectures renvoient des listes vides : le
 * sitemap ne contient alors que les pages fixes, sans erreur.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, projets] = await Promise.all([listerArticlesPublies(), listerProjetsPublies()]);
  return construireSitemap({ urlSite, articles, projets });
}
