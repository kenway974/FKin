-- =============================================================================
--  Durcissement des privilèges de la table `messages`
-- =============================================================================
--  À appliquer sur une base déjà provisionnée avec une version antérieure de
--  `supabase/schema.sql` (qui contient désormais ce même bloc). Idempotent :
--  peut être rejoué sans effet de bord.
--
--  Les politiques RLS ne changent pas. Ce script aligne les privilèges de
--  table sur ce que l'application utilise réellement, pour que la table reste
--  fermée même si la RLS venait à être désactivée par erreur :
--    - `anon` : aucun droit (le formulaire écrit via la clé service_role) ;
--    - `authenticated` : lecture, suppression, et mise à jour de la seule
--      colonne `lu` (le contenu d'un message reçu n'est jamais modifiable).
--  `service_role` n'est pas concerné.
--
--  Retour arrière, si nécessaire :
--    grant all on public.messages to anon, authenticated;
-- =============================================================================

revoke all on public.messages from anon;
revoke insert, update, truncate, references, trigger on public.messages from authenticated;
grant  select, delete on public.messages to authenticated;
grant  update (lu) on public.messages to authenticated;
