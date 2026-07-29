import "server-only";

import { z } from "zod";
import { envPublic } from "@/lib/env-public";

/**
 * Variables d'environnement du serveur.
 *
 * Ce module importe `server-only` : toute tentative de l'inclure depuis un
 * composant client échoue à la compilation, avec un message explicite. Les
 * secrets décrits ici ne peuvent donc pas atteindre le navigateur, même par
 * accident lors d'une refonte future. Le code client passe par
 * `lib/env-public.ts`.
 *
 * Choix assumé : **rien n'est obligatoire au build**. Le site doit pouvoir
 * être cloné, installé et déployé avant que le projet Supabase n'existe.
 * Les fonctionnalités dépendant d'un service manquant se désactivent
 * proprement plutôt que de faire planter l'application (voir `lib/data.ts`).
 */
const schemaServeur = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  RESEND_FROM_EMAIL: z.string().min(3).optional(),
  CONTACT_NOTIFICATION_EMAIL: z.string().min(3).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const brut = {
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

const resultat = schemaServeur.safeParse(nettoye);

if (!resultat.success) {
  console.error(
    "Variables d'environnement serveur invalides :",
    z.flattenError(resultat.error).fieldErrors,
  );
  throw new Error("Variables d'environnement serveur invalides. Voir .env.example.");
}

/**
 * Toutes les variables lisibles côté serveur : les publiques et les secrètes.
 * Le code serveur n'a ainsi qu'un seul point d'entrée à connaître.
 */
export const env = { ...envPublic, ...resultat.data };

/** Vrai si l'écriture privilégiée côté serveur est possible (messages entrants). */
export const supabaseServiceConfigure = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
);

/** Vrai si la notification e-mail du formulaire de contact peut partir. */
export const resendConfigure = Boolean(
  env.RESEND_API_KEY && env.RESEND_FROM_EMAIL && env.CONTACT_NOTIFICATION_EMAIL,
);

// Réexportés pour que le code serveur n'ait pas à jongler entre deux modules.
export { supabaseConfigure, urlSite } from "@/lib/env-public";
