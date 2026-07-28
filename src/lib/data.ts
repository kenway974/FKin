import "server-only";

import { creerClientServeur } from "@/lib/supabase/server";
import { supabaseConfigure } from "@/lib/env";
import type { Article, Projet } from "@/types/database";

/**
 * Lectures publiques de la base.
 *
 * Toutes les fonctions dégradent proprement : si Supabase n'est pas encore
 * branché, ou si la requête échoue, on renvoie une liste vide et on journalise
 * un avertissement. Le site reste ainsi consultable en ligne même avant que la
 * base ne soit créée — les sections concernées affichent un état vide soigné
 * plutôt qu'une page d'erreur.
 *
 * Les politiques RLS filtrent déjà les brouillons côté base ; les filtres
 * `.eq()` ci-dessous sont une seconde barrière, utile si les politiques
 * évoluent.
 */

/** Journalise un problème de lecture sans jamais casser le rendu de la page. */
function signaler(operation: string, erreur: unknown) {
  if (!supabaseConfigure) {
    console.warn(`[data] ${operation} ignorée : Supabase n'est pas configuré (voir .env.example).`);
    return;
  }
  console.error(`[data] Échec de ${operation} :`, erreur);
}

/** Articles publiés, du plus récent au plus ancien. */
export async function listerArticlesPublies(limite?: number): Promise<Article[]> {
  const supabase = await creerClientServeur();
  if (!supabase) {
    signaler("listerArticlesPublies", null);
    return [];
  }

  let requete = supabase
    .from("articles")
    .select("*")
    .eq("statut", "publie")
    .order("date_publication", { ascending: false, nullsFirst: false });

  if (limite) requete = requete.limit(limite);

  const { data, error } = await requete;
  if (error) {
    signaler("listerArticlesPublies", error);
    return [];
  }
  return data ?? [];
}

/** Un article publié identifié par son slug, ou `null` s'il n'existe pas. */
export async function trouverArticleParSlug(slug: string): Promise<Article | null> {
  const supabase = await creerClientServeur();
  if (!supabase) {
    signaler("trouverArticleParSlug", null);
    return null;
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("statut", "publie")
    .maybeSingle();

  if (error) {
    signaler("trouverArticleParSlug", error);
    return null;
  }
  return data;
}

/** Projets visibles dans la galerie, triés par ordre d'affichage puis par date. */
export async function listerProjetsPublies(limite?: number): Promise<Projet[]> {
  const supabase = await creerClientServeur();
  if (!supabase) {
    signaler("listerProjetsPublies", null);
    return [];
  }

  let requete = supabase
    .from("projets")
    .select("*")
    .eq("publie", true)
    .order("ordre", { ascending: true })
    .order("date_projet", { ascending: false, nullsFirst: false });

  if (limite) requete = requete.limit(limite);

  const { data, error } = await requete;
  if (error) {
    signaler("listerProjetsPublies", error);
    return [];
  }
  return data ?? [];
}
