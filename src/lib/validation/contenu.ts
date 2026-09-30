import { z } from "zod";

/**
 * Schémas de validation du back-office (articles et projets).
 *
 * Appliqués côté serveur dans les Server Actions : même si quelqu'un
 * contournait le formulaire, les données resteraient contrôlées avant d'arriver
 * en base.
 */

const slug = z
  .string()
  .trim()
  .min(3, "Le slug doit contenir au moins 3 caractères.")
  .max(80, "Le slug est trop long.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Le slug ne peut contenir que des minuscules, des chiffres et des tirets.",
  );

/** URL d'image : soit une URL http(s) complète, soit vide. */
const urlImage = z
  .union([z.url("L'adresse de l'image doit être une URL valide."), z.literal("")])
  .optional();

export const schemaArticle = z.object({
  titre: z.string().trim().min(3, "Le titre est trop court.").max(180, "Le titre est trop long."),
  slug,
  extrait: z
    .string()
    .trim()
    .max(300, "L'extrait ne doit pas dépasser 300 caractères.")
    .optional()
    .or(z.literal("")),
  contenu: z.string().trim().min(50, "Le contenu doit faire au moins 50 caractères."),
  imageCouverture: urlImage,
  imageAlt: z
    .string()
    .trim()
    .max(200, "La description de l'image est trop longue.")
    .optional()
    .or(z.literal("")),
  statut: z.enum(["brouillon", "publie"]),
  datePublication: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : AAAA-MM-JJ.")
    .optional()
    .or(z.literal("")),
  auteur: z.string().trim().max(120).optional().or(z.literal("")),
});

export type DonneesArticle = z.infer<typeof schemaArticle>;

export const schemaProjet = z
  .object({
    titre: z.string().trim().min(3, "Le titre est trop court.").max(180, "Le titre est trop long."),
    slug,
    description: z.string().trim().min(30, "La description doit faire au moins 30 caractères."),
    lieu: z.string().trim().min(2, "Merci d'indiquer le lieu.").max(160),
    dateProjet: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : AAAA-MM-JJ.")
      .optional()
      .or(z.literal("")),
    typeMateriel: z
      .string()
      .trim()
      .min(2, "Merci d'indiquer le type de matériel.")
      .max(200, "Ce champ est trop long."),
    resultat: z.string().trim().min(10, "Merci de décrire le résultat obtenu.").max(600),
    imageUrl: urlImage,
    imageAlt: z
      .string()
      .trim()
      .max(200, "La description de l'image est trop longue.")
      .optional()
      .or(z.literal("")),
    publie: z.boolean(),
    ordre: z.number().int().min(0).max(999),
    /** Position sur la carte des structures équipées (facultative). */
    latitude: z.number().min(-90).max(90).nullable(),
    longitude: z.number().min(-180).max(180).nullable(),
  })
  .refine((projet) => (projet.latitude === null) === (projet.longitude === null), {
    message: "Renseignez la latitude et la longitude, ou aucune des deux.",
    path: ["longitude"],
  });

export type DonneesProjet = z.infer<typeof schemaProjet>;

/** Extensions et taille acceptées pour les images téléversées vers Storage. */
export const IMAGE_TYPES_ACCEPTES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const IMAGE_TAILLE_MAX_OCTETS = 5 * 1024 * 1024; // 5 Mo

/** Chiffre d'impact affiché sur la page d'accueil. */
export const schemaChiffre = z.object({
  valeur: z
    .number({ message: "Indiquez un nombre." })
    .int("Nombre entier uniquement.")
    .min(0, "Le nombre doit être positif.")
    .max(99_999_999, "Nombre trop grand."),
  suffixe: z.string().trim().max(12, "12 caractères au maximum.").optional().or(z.literal("")),
  libelle: z
    .string()
    .trim()
    .min(3, "Décrivez ce que compte ce chiffre.")
    .max(80, "80 caractères au maximum."),
  precision: z.string().trim().max(120, "120 caractères au maximum.").optional().or(z.literal("")),
  ordre: z.number().int().min(0).max(99),
});

export type DonneesChiffre = z.infer<typeof schemaChiffre>;
