import { cheminCanonique } from "@/lib/url-canonique";

/** Une étape du fil d'Ariane, après l'accueil (ajouté d'office). */
export type EtapeFil = { nom: string; chemin: string };

/**
 * Données structurées `BreadcrumbList` d'une page.
 *
 * C'est ce balisage qui permet à Google d'afficher, sous le nom du site,
 * l'emplacement de la page (« respusse.com › Actualités › … ») plutôt que le
 * seul nom de domaine.
 */
export function filAriane(urlSite: string, etapes: EtapeFil[]) {
  for (const { chemin } of etapes) {
    if (!chemin.startsWith("/") || cheminCanonique(chemin) !== null) {
      throw new Error(`Chemin non canonique pour le fil d'Ariane : « ${chemin} »`);
    }
  }

  const elements = [{ nom: "Accueil", url: urlSite }].concat(
    etapes.map(({ nom, chemin }) => ({ nom, url: `${urlSite}${chemin}` })),
  );

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: elements.map(({ nom, url }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: nom,
      item: url,
    })),
  };
}
