import "server-only";

import { creerClientServeur } from "@/lib/supabase/server";
import type { Article, ChiffreCle, Message, Projet } from "@/types/database";

/**
 * Lectures du back-office.
 *
 * Contrairement à `lib/data.ts`, ces requêtes ne filtrent pas sur le statut de
 * publication : l'administrateur doit voir ses brouillons. La confidentialité
 * est assurée par les politiques RLS, qui n'autorisent ces lectures qu'aux
 * comptes présents dans la table `admins`.
 */

type ClientServeur = NonNullable<Awaited<ReturnType<typeof creerClientServeur>>>;

/**
 * Exécute une lecture du back-office. Contrairement au site public, un échec
 * doit y être visible : il est journalisé puis levé (page d'erreur). Sans
 * Supabase configuré, renvoie `defaut`.
 */
async function lire<T>(
  operation: string,
  defaut: T,
  requete: (supabase: ClientServeur) => PromiseLike<{ data: T | null; error: unknown }>,
): Promise<T> {
  const supabase = await creerClientServeur();
  if (!supabase) return defaut;
  const { data, error } = await requete(supabase);
  if (error) {
    console.error(`[admin] Échec de ${operation} :`, error);
    throw new Error(`Impossible de charger les données (${operation}).`);
  }
  return data ?? defaut;
}

export const listerTousLesArticles = (): Promise<Article[]> =>
  lire("la liste des articles", [], (supabase) =>
    supabase
      .from("articles")
      .select("*")
      .order("date_publication", { ascending: false, nullsFirst: true })
      .order("created_at", { ascending: false }),
  );

export const trouverArticle = (id: string): Promise<Article | null> =>
  lire("le chargement de l'article", null, (supabase) =>
    supabase.from("articles").select("*").eq("id", id).maybeSingle(),
  );

export const listerTousLesProjets = (): Promise<Projet[]> =>
  lire("la liste des projets", [], (supabase) =>
    supabase
      .from("projets")
      .select("*")
      .order("ordre", { ascending: true })
      .order("created_at", { ascending: false }),
  );

export const trouverProjet = (id: string): Promise<Projet | null> =>
  lire("le chargement du projet", null, (supabase) =>
    supabase.from("projets").select("*").eq("id", id).maybeSingle(),
  );

export const listerMessages = (): Promise<Message[]> =>
  lire("la liste des messages", [], (supabase) =>
    supabase.from("messages").select("*").order("created_at", { ascending: false }),
  );

export const trouverMessage = (id: string): Promise<Message | null> =>
  lire("le chargement du message", null, (supabase) =>
    supabase.from("messages").select("*").eq("id", id).maybeSingle(),
  );

/** Chiffres d'impact de la page d'accueil, dans l'ordre d'affichage. */
export const listerChiffres = (): Promise<ChiffreCle[]> =>
  lire("le chargement des chiffres", [], (supabase) =>
    supabase
      .from("chiffres_cles")
      .select("*")
      .order("ordre", { ascending: true })
      .order("created_at", { ascending: true }),
  );

/**
 * Liens temporaires (une heure) vers les photos jointes à un message. Le
 * bucket est privé : sans ces liens signés, les photos ne sont lisibles par
 * personne, pas même en connaissant leur chemin.
 */
export async function lierPhotosMessage(chemins: string[]): Promise<string[]> {
  if (!chemins.length) return [];
  const supabase = await creerClientServeur();
  if (!supabase) return [];

  const { data, error } = await supabase.storage
    .from("photos-dons")
    .createSignedUrls(chemins, 60 * 60);
  if (error) {
    console.error("[admin] Liens des photos indisponibles :", error);
    return [];
  }
  return data.flatMap((element) => (element.signedUrl ? [element.signedUrl] : []));
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
