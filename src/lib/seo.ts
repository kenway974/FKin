import type { Metadata } from "next";
import { site } from "@/lib/site";
import { cheminCanonique } from "@/lib/url-canonique";

/**
 * Image de partage par défaut, générée par `app/opengraph-image.tsx`.
 * Next.js cesse de l'ajouter d'office dès qu'une page déclare son propre
 * objet `openGraph` : on la référence donc explicitement.
 */
const IMAGE_PARTAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.nom} — dons de matériel, en France et au Congo`,
};

/**
 * Métadonnées d'une page publique.
 *
 * Next.js ne fusionne pas les objets `openGraph` et `twitter` du layout avec
 * ceux d'une page : une page qui n'en déclare pas hérite tels quels de ceux
 * de l'accueil, URL comprise. Passer par cette fonction garantit à chaque
 * page une URL canonique, une URL Open Graph et des cartes de partage qui lui
 * sont propres.
 *
 * Les chemins sont relatifs : `metadataBase` (layout racine) les complète
 * avec l'URL du site.
 */
export function metadonneesPage({
  titre,
  description,
  chemin,
  titrePartage = titre,
  type = "website",
}: {
  /** Titre de l'onglet, complété par « · Respusse » via le modèle du layout. */
  titre: string;
  description: string;
  /** Chemin canonique de la page : `/`, `/services`, `/actualites/mon-article`… */
  chemin: string;
  /** Titre affiché dans les aperçus de partage, si différent de `titre`. */
  titrePartage?: string;
  type?: "website" | "article";
}): Metadata {
  if (!chemin.startsWith("/") || cheminCanonique(chemin) !== null) {
    throw new Error(`Chemin non canonique pour les métadonnées : « ${chemin} »`);
  }

  return {
    title: titre,
    description,
    alternates: { canonical: chemin },
    openGraph: {
      type,
      locale: "fr_FR",
      siteName: site.nom,
      url: chemin,
      title: titrePartage,
      description,
      images: [IMAGE_PARTAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: titrePartage,
      description,
      images: [IMAGE_PARTAGE.url],
    },
  };
}
