import "server-only";

import { createHash } from "node:crypto";
import { env } from "@/lib/env";
import type { creerClientService } from "@/lib/supabase/server";

/**
 * Limitation de débit partagée, stockée dans Supabase (table `limites_envoi`,
 * voir `supabase/schema.sql`, section 12) : le compteur est le même pour toutes
 * les instances du serveur, contrairement à un compteur en mémoire.
 *
 * L'adresse IP n'est jamais enregistrée : seule son empreinte, salée avec un
 * secret du serveur, sert de clé.
 *
 * En cas de panne de la base, l'envoi est accepté : mieux vaut laisser passer
 * un spam que perdre une vraie demande. Le honeypot et le piège temporel du
 * formulaire restent actifs.
 *
 * @returns 0 si l'envoi est accepté, sinon le nombre de secondes à attendre.
 */
export async function consommerEnvoi(
  supabase: NonNullable<ReturnType<typeof creerClientService>>,
  entetes: Headers,
  maxEnvois: number,
  fenetreSecondes: number,
): Promise<number> {
  const { data, error } = await supabase.rpc("consommer_envoi", {
    p_cle: empreinte(adresseIp(entetes)),
    p_max: maxEnvois,
    p_fenetre_s: fenetreSecondes,
  });
  if (error) {
    console.error("[limite] Vérification impossible, envoi accepté :", error);
    return 0;
  }
  return data ?? 0;
}

function adresseIp(entetes: Headers): string {
  const premiere = entetes.get("x-forwarded-for")?.split(",")[0]?.trim();
  return premiere || entetes.get("x-real-ip") || "inconnu";
}

function empreinte(valeur: string): string {
  return createHash("sha256")
    .update(`${env.SUPABASE_SERVICE_ROLE_KEY ?? ""}:${valeur}`)
    .digest("hex");
}
