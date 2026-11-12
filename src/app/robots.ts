import type { MetadataRoute } from "next";
import { urlSite } from "@/lib/env";

/**
 * Génère /robots.txt.
 *
 * Seuls le back-office et les routes d'authentification sont fermés aux
 * robots : ils n'ont aucun intérêt dans un moteur de recherche. Tout le reste
 * est ouvert, et le sitemap indique les pages à explorer.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/connexion", "/deconnexion"] }],
    sitemap: `${urlSite}/sitemap.xml`,
  };
}
