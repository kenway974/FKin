import "server-only";

import { creerClientPublic } from "@/lib/supabase/server";
import { supabaseConfigure } from "@/lib/env";
import type { Article, ChiffreCle, Projet } from "@/types/database";

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

/**
 * Chiffres d'impact saisis par l'équipe dans le back-office. Liste vide si la
 * table n'existe pas encore ou est vide : l'accueil affiche alors les chiffres
 * calculés automatiquement.
 */
export async function listerChiffresCles(): Promise<ChiffreCle[]> {
  const supabase = creerClientPublic();
  if (!supabase) {
    signaler("listerChiffresCles", null);
    return [];
  }

  const { data, error } = await supabase
    .from("chiffres_cles")
    .select("id, valeur, suffixe, libelle, precision, ordre, created_at, updated_at")
    .order("ordre", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    signaler("listerChiffresCles", error);
    return [];
  }
  return data ?? [];
}

/** Un chiffre tel qu'affiché sur la page d'accueil. */
export type ChiffreAffiche = { valeur: string; libelle: string; precision?: string };

/**
 * Chiffres de la section « Notre action en bref » : ceux saisis par l'équipe
 * dans le back-office en priorité ; à défaut, ceux calculés à partir du
 * contenu publié (jamais inventés). Liste vide s'il n'y a rien à montrer.
 */
export async function chiffresAccueil(): Promise<ChiffreAffiche[]> {
  const saisis = await listerChiffresCles();
  if (saisis.length) {
    return saisis.map((chiffre) => ({
      valeur: formaterChiffre(chiffre.valeur, chiffre.suffixe),
      libelle: chiffre.libelle,
      precision: chiffre.precision ?? undefined,
    }));
  }

  const statistiques = await compterPourAccueil();
  if (!statistiques.projets) return [];

  // Le « 100 % documentées » n'est pas une promesse commerciale : la colonne
  // `resultat` est obligatoire en base, aucune fiche ne peut donc exister
  // sans son compte rendu d'usage.
  return [
    {
      valeur: String(statistiques.projets),
      libelle: statistiques.projets > 1 ? "projets menés à terme" : "projet mené à terme",
      precision: "Chacun détaillé dans nos réalisations",
    },
    {
      valeur: String(statistiques.lieux),
      libelle: statistiques.lieux > 1 ? "lieux équipés" : "lieu équipé",
      precision: "Écoles, mairies, associations",
    },
    {
      valeur: String(statistiques.articles),
      libelle: "comptes rendus publiés",
      precision: "Livraisons, installations, retours de terrain",
    },
    {
      valeur: "100 %",
      libelle: "des projets documentés",
      precision: "Lieu, matériel livré et résultat obtenu",
    },
  ];
}

/**
 * « 1200 » + « % » → « 1 200 % » ; « + » reste collé (« 250+ »). Espaces
 * insécables fines, comme le veut la typographie française.
 */
function formaterChiffre(valeur: number, suffixe: string) {
  const nombre = valeur.toLocaleString("fr-FR");
  if (!suffixe) return nombre;
  return suffixe.startsWith("+") ? `${nombre}${suffixe}` : `${nombre}\u202f${suffixe}`;
}
