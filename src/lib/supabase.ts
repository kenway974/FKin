/**
 * Point d'entrée « client Supabase typé », tel que nommé dans le cahier des
 * charges.
 *
 * L'implémentation réelle est éclatée en trois fichiers dans `lib/supabase/`,
 * parce qu'un client navigateur, un client serveur et un client privilégié ne
 * peuvent pas cohabiter dans un même module : le second importe `server-only`
 * et le troisième porte la clé `service_role`, qui ne doit jamais atteindre le
 * navigateur.
 *
 * Ce fichier ne réexporte donc que ce qui est sûr partout — les types et l'état
 * de configuration. Importez directement le module voulu selon le contexte :
 *
 *   import { creerClientNavigateur } from "@/lib/supabase/client";  // composant client
 *   import { creerClientServeur }    from "@/lib/supabase/server";  // Server Component / Action
 *   import { creerClientService }    from "@/lib/supabase/server";  // écriture privilégiée
 */

// Réexporté depuis le module public : ce barrel doit rester importable
// partout, y compris depuis un composant client.
// `supabaseServiceConfigure` n'y figure pas volontairement — c'est une notion
// serveur, à importer depuis `@/lib/env`.
export { supabaseConfigure } from "@/lib/env-public";
export type {
  Admin,
  Article,
  Database,
  Message,
  Projet,
  StatutArticle,
  TypeEmetteur,
} from "@/types/database";
