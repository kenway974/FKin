/**
 * Vrai si l'erreur Supabase signale une table qui n'existe pas encore :
 * `42P01` côté Postgres, `PGRST205` côté API (cache de schéma). C'est le cas
 * tant que `supabase/schema.sql` n'a pas été relancé après une mise à jour.
 */
export function estTableAbsente(erreur: unknown): boolean {
  if (!erreur || typeof erreur !== "object" || !("code" in erreur)) return false;
  return erreur.code === "42P01" || erreur.code === "PGRST205";
}
