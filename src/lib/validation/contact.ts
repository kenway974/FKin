import { z } from "zod";

/**
 * Schéma du formulaire de contact.
 *
 * Volontairement partagé entre le client (react-hook-form) et le serveur
 * (Server Action) : une seule définition, donc aucune divergence possible entre
 * ce que le navigateur autorise et ce que le serveur accepte réellement.
 */
export const schemaContact = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Merci d'indiquer votre nom (2 caractères minimum).")
    .max(120, "Ce nom est trop long."),

  email: z.email("Cette adresse e-mail ne semble pas valide.").max(180),

  organisation: z
    .string()
    .trim()
    .max(160, "Ce nom d'organisation est trop long.")
    .optional()
    .or(z.literal("")),

  telephone: z.string().trim().max(30, "Ce numéro est trop long.").optional().or(z.literal("")),

  typeEmetteur: z.enum(["entreprise", "beneficiaire"], {
    message: "Merci de préciser qui vous êtes.",
  }),

  sujet: z
    .string()
    .trim()
    .min(3, "Merci d'indiquer un objet.")
    .max(180, "Cet objet est trop long."),

  message: z
    .string()
    .trim()
    .min(20, "Merci de détailler un peu votre demande (20 caractères minimum).")
    .max(4000, "Ce message dépasse 4 000 caractères."),

  /**
   * Champ « miroir » (honeypot) : invisible et hors du flux de tabulation.
   * Un humain ne le remplit jamais ; un robot qui remplit tous les champs, si.
   * Doit donc rester vide.
   */
  siteWeb: z.string().max(0, "Envoi refusé.").optional().or(z.literal("")),

  /**
   * Horodatage d'affichage du formulaire, en millisecondes.
   * Sert de piège temporel : un envoi en moins de 3 secondes est
   * quasi certainement automatisé (vérifié côté serveur).
   */
  charge: z.number().int().nonnegative().optional(),
});

export type DonneesContact = z.infer<typeof schemaContact>;

/** Délai minimal, en millisecondes, entre l'affichage et l'envoi du formulaire. */
export const DELAI_MINIMAL_ENVOI_MS = 3000;

/** Libellés lisibles pour l'affichage du type d'émetteur dans le back-office. */
export const libellesEmetteur = {
  entreprise: "Entreprise donatrice",
  beneficiaire: "Structure bénéficiaire",
} as const;
