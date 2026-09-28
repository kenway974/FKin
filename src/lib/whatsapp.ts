import "server-only";

/**
 * Lien direct WhatsApp.
 *
 * Le numéro se règle avec la variable d'environnement `WHATSAPP_NUMERO`, au
 * format international (« +33 6 12 34 56 78 » ou « +243 … » : espaces et « + »
 * sont retirés). Tant qu'elle est vide, aucun bouton WhatsApp n'apparaît en
 * production.
 *
 * En local et sur les déploiements de prévisualisation uniquement, un numéro
 * d'exemple manifestement factice est utilisé pour que le bouton soit visible
 * et vérifiable ; il ne peut jamais atteindre la production.
 */

const configure = (process.env.WHATSAPP_NUMERO ?? "").replace(/\D/g, "");
const horsProduction =
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";

export const numeroWhatsApp = configure || (horsProduction ? "33600000000" : "");

/** Vrai quand le numéro affiché est l'exemple factice. */
export const whatsAppExemple = !configure && Boolean(numeroWhatsApp);

/** Lien d'ouverture de la conversation, message d'accueil pré-rempli. */
export function lienWhatsApp(message = "Bonjour, je vous écris depuis le site de Respusse.") {
  if (!numeroWhatsApp) return null;
  return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
}
