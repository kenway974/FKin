import "server-only";

import { creerClientServeur } from "@/lib/supabase/server";
import type { Article, Message, Projet } from "@/types/database";

/**
 * Lectures du back-office.
 *
 * Contrairement à `lib/data.ts`, ces requêtes ne filtrent pas sur le statut de
 * publication : l'administrateur doit voir ses brouillons. La confidentialité
 * est assurée par les politiques RLS, qui n'autorisent ces lectures qu'aux
 * comptes présents dans la table `admins`.
 */

/** Erreur explicite : dans le back-office, un échec doit être visible. */
function verifier<T>(operation: string, donnees: T | null, erreur: unknown): T {
  if (erreur) {
    console.error(`[admin] Échec de ${operation} :`, erreur);
    throw new Error(`Impossible de charger les données (${operation}).`);
  }
  return donnees as T;
}

export async function listerTousLesArticles(): Promise<Article[]> {
  const supabase = await creerClientServeur();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("date_publication", { ascending: false, nullsFirst: true })
    .order("created_at", { ascending: false });

  return verifier("la liste des articles", data ?? [], error);
}

export async function trouverArticle(id: string): Promise<Article | null> {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  return verifier("le chargement de l'article", data, error);
}

export async function listerTousLesProjets(): Promise<Projet[]> {
  const supabase = await creerClientServeur();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projets")
    .select("*")
    .order("ordre", { ascending: true })
    .order("created_at", { ascending: false });

  return verifier("la liste des projets", data ?? [], error);
}

export async function trouverProjet(id: string): Promise<Projet | null> {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const { data, error } = await supabase.from("projets").select("*").eq("id", id).maybeSingle();
  return verifier("le chargement du projet", data, error);
}

export async function listerMessages(): Promise<Message[]> {
  const supabase = await creerClientServeur();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return verifier("la liste des messages", data ?? [], error);
}

export async function trouverMessage(id: string): Promise<Message | null> {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const { data, error } = await supabase.from("messages").select("*").eq("id", id).maybeSingle();
  return verifier("le chargement du message", data, error);
}

/** Compteurs affichés sur le tableau de bord. */
export async function compterElements() {
  const supabase = await creerClientServeur();
  if (!supabase) {
    return { articles: 0, brouillons: 0, projets: 0, messages: 0, messagesNonLus: 0 };
  }

  // `head: true` ne rapatrie aucune ligne : seul le total est demandé, ce qui
  // rend ces cinq requêtes très peu coûteuses malgré leur nombre.
  const options = { count: "exact", head: true } as const;

  const [articles, brouillons, projets, messages, nonLus] = await Promise.all([
    supabase.from("articles").select("*", options),
    supabase.from("articles").select("*", options).eq("statut", "brouillon"),
    supabase.from("projets").select("*", options),
    supabase.from("messages").select("*", options),
    supabase.from("messages").select("*", options).eq("lu", false),
  ]);

  return {
    articles: articles.count ?? 0,
    brouillons: brouillons.count ?? 0,
    projets: projets.count ?? 0,
    messages: messages.count ?? 0,
    messagesNonLus: nonLus.count ?? 0,
  };
}

/**
 * Marque un message comme lu, sans invalidation de cache.
 *
 * Appelé pendant le rendu de la fiche message : `revalidatePath()` est interdit
 * dans ce contexte. Les pages du back-office étant toutes dynamiques, les
 * compteurs se remettent à jour d'eux-mêmes à la navigation suivante.
 */
export async function marquerMessageLuAuRendu(id: string): Promise<void> {
  const supabase = await creerClientServeur();
  if (!supabase) return;

  const { error } = await supabase.from("messages").update({ lu: true }).eq("id", id);
  if (error) console.error("[admin] Impossible de marquer le message comme lu :", error);
}
