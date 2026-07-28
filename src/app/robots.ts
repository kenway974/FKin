import type { MetadataRoute } from "next";
import { urlSite } from "@/lib/env";

/**
 * Génère /robots.txt.
 * Le back-office et la page de connexion sont exclus de l'indexation : ils
 * n'ont aucun intérêt pour un moteur de recherche.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/connexion", "/api/"],
      },
    ],
    sitemap: `${urlSite}/sitemap.xml`,
    host: urlSite,
  };
}
