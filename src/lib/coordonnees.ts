import { site } from "@/lib/site";
import type { LigneCoordonnees } from "@/types/database";

/**
 * Coordonnées affichées sur le site : celles saisies dans le back-office,
 * complétées par celles du code (`site.ts`) pour tout champ absent.
 *
 * Fonctions pures, sans accès à la base : la lecture se fait dans
 * `lib/data.ts`.
 */
export type Coordonnees = {
  email: string;
  telephone: string;
  rue: string;
  codePostal: string;
  ville: string;
  pays: string;
  adresseRdc: string;
  whatsapp: string;
};

const texte = (valeur: string | null | undefined) => valeur?.trim() ?? "";

/**
 * L'e-mail, le code postal et la ville retombent toujours sur le code.
 * Le téléphone, la rue et WhatsApp restent vides s'ils ne sont pas saisis :
 * le numéro provisoire et le « — » de `site.ts` ne doivent jamais
 * s'afficher. L'adresse de Kinshasa vient du code seulement si la base est
 * illisible ; vidée par l'admin, elle est masquée.
 */
export function fusionnerCoordonnees(ligne: LigneCoordonnees | null): Coordonnees {
  return {
    email: texte(ligne?.email) || site.email,
    telephone: texte(ligne?.telephone),
    rue: texte(ligne?.rue),
    codePostal: texte(ligne?.code_postal) || site.adresse.codePostal,
    ville: texte(ligne?.ville) || site.adresse.ville,
    pays: site.adresse.pays,
    adresseRdc: ligne ? texte(ligne.adresse_rdc) : site.adresseRdc,
    whatsapp: texte(ligne?.whatsapp),
  };
}

/** Lien `tel:` sans espaces ni séparateurs, ou `null` sans numéro. */
export function lienTelephone(telephone: string): string | null {
  // « +33 (0)6 … » : le 0 entre parenthèses ne se compose pas depuis l'étranger.
  const numero = telephone.replace(/\(0\)/g, "").replace(/[^\d+]/g, "");
  return numero ? `tel:${numero}` : null;
}

/**
 * Destinataires des notifications du formulaire de contact : l'e-mail saisi
 * dans le back-office, sinon la variable `CONTACT_NOTIFICATION_EMAIL`
 * (plusieurs adresses possibles, séparées par des virgules).
 */
export function destinatairesNotification(
  emailBase: string | null | undefined,
  variable: string | undefined,
): string[] {
  const email = texte(emailBase);
  if (email) return [email];
  return (variable ?? "")
    .split(",")
    .map((adresse) => adresse.trim())
    .filter(Boolean);
}

/** Numéro d'exemple, manifestement factice, des déploiements hors production. */
const NUMERO_WHATSAPP_EXEMPLE = "33600000000";

/**
 * Numéro WhatsApp à utiliser, chiffres seuls : celui du back-office, sinon
 * la variable `WHATSAPP_NUMERO`, sinon (hors production uniquement) un
 * numéro d'exemple pour que le bouton reste visible et vérifiable.
 */
export function resoudreWhatsApp(
  base: string,
  variable: string,
  horsProduction: boolean,
): { numero: string; exemple: boolean } {
  const configure = base.replace(/\D/g, "") || variable.replace(/\D/g, "");
  if (configure) return { numero: configure, exemple: false };
  return horsProduction
    ? { numero: NUMERO_WHATSAPP_EXEMPLE, exemple: true }
    : { numero: "", exemple: false };
}

/** Lien d'ouverture de la conversation, message d'accueil pré-rempli. */
export function lienWhatsApp(
  numero: string,
  message = "Bonjour, je vous écris depuis le site de Respusse.",
): string | null {
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}
