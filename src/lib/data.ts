import "server-only";

import { creerClientPublic } from "@/lib/supabase/server";
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
  const supabase = creerClientPublic();
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
  const supabase = creerClientPublic();
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

/**
 * Chiffres-clés de la page d'accueil.
 *
 * Calculés à partir du contenu réellement publié plutôt que saisis en dur :
 * un site qui affiche des statistiques inventées perd la crédibilité qu'il
 * cherche justement à établir auprès des entreprises donatrices.
 *
 * Renvoie des zéros si la base est injoignable ; la page masque alors la
 * section entière au lieu d'annoncer « 0 projet ».
 */
export async function compterPourAccueil(): Promise<{
  projets: number;
  articles: number;
  lieux: number;
}> {
  const vide = { projets: 0, articles: 0, lieux: 0 };

  const supabase = creerClientPublic();
  if (!supabase) {
    signaler("compterPourAccueil", null);
    return vide;
  }

  const [projets, articles] = await Promise.all([
    // `lieu` est rapatrié pour compter les lieux distincts : la table reste
    // petite (quelques dizaines de lignes), un agrégat côté base serait ici
    // plus coûteux à maintenir qu'utile.
    supabase.from("projets").select("lieu").eq("publie", true),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("statut", "publie"),
  ]);

  if (projets.error || articles.error) {
    signaler("compterPourAccueil", projets.error ?? articles.error);
    return vide;
  }

  const lignes = projets.data ?? [];

  return {
    projets: lignes.length,
    articles: articles.count ?? 0,
    lieux: new Set(lignes.map((ligne) => ligne.lieu.trim().toLowerCase())).size,
  };
}

/** Projets visibles dans la galerie, triés par ordre d'affichage puis par date. */
export async function listerProjetsPublies(limite?: number): Promise<Projet[]> {
  const supabase = creerClientPublic();
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
