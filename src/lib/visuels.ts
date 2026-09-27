import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Détection des photographies de bannière déposées par le propriétaire.
 *
 * Le dépôt ne contient aucune photo : les bannières s'appuient donc sur des
 * illustrations SVG. Mais dès que le propriétaire dépose un fichier dans
 * `public/bannieres/`, la bannière correspondante bascule automatiquement
 * dessus — sans toucher une ligne de code.
 *
 * La vérification a lieu au build (les pages publiques sont statiques), ce qui
 * ne coûte rien à l'exécution. Ajouter une photo suppose donc un redéploiement,
 * ce qui est de toute façon le cas pour tout fichier de `public/`.
 */

const DOSSIER = "bannieres";
const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

/**
 * Renvoie le chemin public de la photo correspondant à `nom`, ou `null` si
 * aucune n'a été déposée.
 *
 * @param nom nom de fichier sans extension, ex. « accueil »
 */
export function trouverPhotoBanniere(nom: string): string | null {
  for (const extension of EXTENSIONS) {
    const relatif = `${DOSSIER}/${nom}.${extension}`;
    if (existsSync(path.join(process.cwd(), "public", relatif))) {
      return `/${relatif}`;
    }
  }
  return null;
}
