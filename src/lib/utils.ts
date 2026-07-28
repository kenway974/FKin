import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne des classes Tailwind en résolvant les conflits
 * (`px-2 px-4` → `px-4`). Convention shadcn/ui.
 */
export function cn(...entrees: ClassValue[]) {
  return twMerge(clsx(entrees));
}

/** Formate une date ISO en français long : « 12 mars 2025 ». */
export function formaterDate(valeur: string | Date | null | undefined): string {
  if (!valeur) return "";
  const date = valeur instanceof Date ? valeur : new Date(valeur);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Formate une date avec l'heure : « 12 mars 2025 à 14:30 ». */
export function formaterDateHeure(valeur: string | Date | null | undefined): string {
  if (!valeur) return "";
  const date = valeur instanceof Date ? valeur : new Date(valeur);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Transforme un titre en identifiant d'URL : « Écoles de Kinshasa » →
 * « ecoles-de-kinshasa ». Utilisé par le back-office pour pré-remplir le slug.
 */
export function genererSlug(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Coupe un texte proprement, sans casser un mot, et ajoute une ellipse. */
export function extraireResume(texte: string, longueurMax = 160): string {
  const propre = texte.replace(/\s+/g, " ").trim();
  if (propre.length <= longueurMax) return propre;
  const coupe = propre.slice(0, longueurMax);
  return `${coupe.slice(0, coupe.lastIndexOf(" "))}…`;
}

/**
 * Découpe un contenu texte en paragraphes.
 *
 * Le back-office stocke du texte brut (pas de HTML) : c'est volontaire, cela
 * supprime toute possibilité d'injection XSS au rendu. Les lignes vides
 * séparent les paragraphes.
 */
export function decouperParagraphes(contenu: string): string[] {
  return contenu
    .split(/\n{2,}/)
    .map((bloc) => bloc.trim())
    .filter(Boolean);
}
