/**
 * Forme canonique des chemins du site.
 *
 * Toutes les URL du site sont en minuscules, sans barre oblique finale ni
 * barres obliques répétées. Une variante (`/Services`, `/contact/`,
 * `//actualites`) est redirigée de façon permanente vers sa forme canonique
 * par le middleware : une page n'est ainsi jamais servie sous deux adresses,
 * ce qui diluerait son référencement.
 *
 * Les séquences encodées (`%C3%A9`) sont conservées telles quelles : leur
 * casse fait partie de l'encodage.
 */

/**
 * Renvoie le chemin canonique, ou `null` si `chemin` l'est déjà (aucune
 * redirection à faire).
 */
export function cheminCanonique(chemin: string): string | null {
  let canonique = chemin
    .replace(/\/{2,}/g, "/")
    .replace(/%[0-9a-f]{2}|[^%]+/gi, (morceau) =>
      morceau.startsWith("%") ? morceau : morceau.toLowerCase(),
    );

  if (canonique.length > 1) canonique = canonique.replace(/\/+$/, "") || "/";

  return canonique === chemin ? null : canonique;
}
