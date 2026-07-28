import { z } from "zod";

/**
 * Lecture et validation centralisées des variables d'environnement.
 *
 * Choix assumé : **rien n'est obligatoire au build**. Le site doit pouvoir être
 * cloné, installé et lancé avant que le projet Supabase n'existe — c'est
 * exactement le scénario décrit dans le cahier des charges. Les fonctionnalités
 * qui dépendent d'un service manquant se désactivent proprement plutôt que de
 * faire planter l'application (voir `lib/supabase/*` et `lib/data.ts`).
 *
 * Les helpers `exigerX()` en bas de fichier servent aux points d'entrée qui,
 * eux, ne peuvent pas fonctionner sans la variable : ils lèvent une erreur
 * explicite au moment de l'appel, pas à l'import.
 */
const schemaEnv = z.object({
  // --- Public (exposé au navigateur) -----------------------------------------
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20).optional(),
  NEXT_PUBLIC_SUPABASE_BUCKET: z.string().min(1).default("medias"),

  // --- Serveur uniquement (jamais envoyé au navigateur) ----------------------
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  RESEND_FROM_EMAIL: z.string().min(3).optional(),
  CONTACT_NOTIFICATION_EMAIL: z.string().min(3).optional(),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Next.js remplace `process.env.NEXT_PUBLIC_*` à la compilation uniquement si
 * la référence est écrite littéralement. On ne peut donc pas passer
 * `process.env` en bloc : chaque variable publique est nommée explicitement.
 */
const brut = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_BUCKET: process.env.NEXT_PUBLIC_SUPABASE_BUCKET,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
  NODE_ENV: process.env.NODE_ENV,
};

// Les chaînes vides d'un `.env` mal rempli sont traitées comme « non définie ».
const nettoye = Object.fromEntries(
  Object.entries(brut).filter(([, valeur]) => valeur !== undefined && valeur !== ""),
);

const resultat = schemaEnv.safeParse(nettoye);

if (!resultat.success) {
  console.error(
    "Variables d'environnement invalides :",
    z.flattenError(resultat.error).fieldErrors,
  );
  throw new Error("Variables d'environnement invalides. Voir .env.example.");
}

export const env = resultat.data;

/** Vrai si les variables permettant de lire la base publique sont présentes. */
export const supabaseConfigure = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/** Vrai si l'écriture privilégiée côté serveur est possible (messages entrants). */
export const supabaseServiceConfigure = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
);

/** Vrai si la notification e-mail du formulaire de contact peut partir. */
export const resendConfigure = Boolean(
  env.RESEND_API_KEY && env.RESEND_FROM_EMAIL && env.CONTACT_NOTIFICATION_EMAIL,
);

/** URL publique du site, sans slash final. */
export const urlSite = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
