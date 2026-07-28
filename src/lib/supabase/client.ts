"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, supabaseConfigure } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Client Supabase pour les composants React côté navigateur.
 *
 * Utilisé uniquement par le formulaire de connexion (Supabase Auth pose alors
 * les cookies de session) et par l'upload d'images vers Storage depuis le
 * back-office. Toutes les autres lectures/écritures passent par le serveur.
 *
 * Renvoie `null` si les variables d'environnement Supabase sont absentes, afin
 * que le site reste utilisable avant le branchement de la base.
 */
export function creerClientNavigateur() {
  if (!supabaseConfigure) return null;

  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );
}
