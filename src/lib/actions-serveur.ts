import "server-only";

import { z } from "zod";
import { creerClientServeur } from "@/lib/supabase/server";
import { recupererAdmin } from "@/lib/auth";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Briques communes aux Server Actions.
 *
 * Une Server Action est une route HTTP à part entière : chaque action du
 * back-office revérifie l'administrateur (`accesAdmin`) avant tout, sans
 * jamais se fier au fait que le formulaire n'était affiché qu'aux admins. Les
 * politiques RLS restent la seconde barrière, côté base.
 */

type ClientServeur = NonNullable<Awaited<ReturnType<typeof creerClientServeur>>>;

export const echec = (message: string): ResultatAction => ({ statut: "erreur", message });

/** Client Supabase de l'administrateur connecté, ou la réponse d'erreur à renvoyer. */
export async function accesAdmin(): Promise<
  { supabase: ClientServeur; erreur?: never } | { erreur: ResultatAction }
> {
  if (!(await recupererAdmin())) return { erreur: echec("Session expirée. Reconnectez-vous.") };
  const supabase = await creerClientServeur();
  if (!supabase) return { erreur: echec("Supabase n'est pas configuré.") };
  return { supabase };
}

/** Valide des données avec un schéma zod ; en cas d'échec, erreurs par champ. */
export function valider<T>(
  schema: z.ZodType<T>,
  donneesBrutes: unknown,
): { donnees: T; erreur?: never } | { erreur: ResultatAction & { statut: "erreur" } } {
  const analyse = schema.safeParse(donneesBrutes);
  if (analyse.success) return { donnees: analyse.data };
  return {
    erreur: {
      statut: "erreur",
      message: "Certains champs doivent être corrigés.",
      erreursChamps: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    },
  };
}

/** Traduit une erreur Postgres en message compréhensible. */
export function messageErreurBase(erreur: { code?: string }, doublon = "Cet élément existe déjà.") {
  if (erreur.code === "23505") return doublon;
  if (erreur.code === "42501")
    return "Vous n'avez pas les droits nécessaires pour cette opération.";
  return "L'enregistrement a échoué. Réessayez dans quelques instants.";
}
