"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { schemaArticle } from "@/lib/validation/contenu";
import { creerClientServeur } from "@/lib/supabase/server";
import { recupererAdmin } from "@/lib/auth";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Écritures sur les articles de blog.
 *
 * Chaque action commence par revérifier que l'appelant est administrateur : une
 * Server Action est une route HTTP à part entière, elle ne doit jamais faire
 * confiance au fait que le formulaire n'était affiché qu'aux administrateurs.
 * Les politiques RLS constituent la seconde barrière, côté base.
 */

/** Invalide les pages publiques touchées par une modification d'article. */
function rafraichirPagesPubliques(slug?: string) {
  revalidatePath("/");
  revalidatePath("/actualites");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/actualites/${slug}`);
}

/** Convertit les champs du formulaire vers les colonnes de la table. */
function versLigne(donnees: z.infer<typeof schemaArticle>) {
  return {
    titre: donnees.titre,
    slug: donnees.slug,
    extrait: donnees.extrait || null,
    contenu: donnees.contenu,
    image_couverture: donnees.imageCouverture || null,
    image_alt: donnees.imageAlt || null,
    statut: donnees.statut,
    // Un article publié sans date reçoit la date du jour : cela évite de le
    // voir disparaître du tri par date sur la liste publique.
    date_publication:
      donnees.datePublication ||
      (donnees.statut === "publie" ? new Date().toISOString().slice(0, 10) : null),
    auteur: donnees.auteur || null,
  };
}

/** Traduit une erreur Postgres en message compréhensible. */
function messageErreurBase(erreur: { code?: string; message: string }) {
  if (erreur.code === "23505") {
    return "Ce slug est déjà utilisé par un autre article. Choisissez-en un autre.";
  }
  if (erreur.code === "42501") {
    return "Vous n'avez pas les droits nécessaires pour cette opération.";
  }
  return "L'enregistrement a échoué. Réessayez dans quelques instants.";
}

export async function creerArticle(donneesBrutes: unknown): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const analyse = schemaArticle.safeParse(donneesBrutes);
  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Certains champs doivent être corrigés.",
      erreursChamps: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: "Supabase n'est pas configuré." };

  const { data, error } = await supabase
    .from("articles")
    .insert(versLigne(analyse.data))
    .select("id, slug")
    .single();

  if (error) {
    console.error("[admin] Création d'article impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error) };
  }

  rafraichirPagesPubliques(data.slug);
  revalidatePath("/admin/articles");

  return { statut: "succes", message: "Article créé.", id: data.id };
}

export async function modifierArticle(id: string, donneesBrutes: unknown): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const analyse = schemaArticle.safeParse(donneesBrutes);
  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Certains champs doivent être corrigés.",
      erreursChamps: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: "Supabase n'est pas configuré." };

  // L'ancien slug est récupéré avant modification : si le slug change, l'URL
  // précédente doit elle aussi être invalidée dans le cache.
  const { data: avant } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();

  const { data, error } = await supabase
    .from("articles")
    .update({ ...versLigne(analyse.data), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) {
    console.error("[admin] Modification d'article impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error) };
  }

  if (avant?.slug && avant.slug !== data.slug) rafraichirPagesPubliques(avant.slug);
  rafraichirPagesPubliques(data.slug);
  revalidatePath("/admin/articles");

  return { statut: "succes", message: "Modifications enregistrées.", id: data.id };
}

export async function supprimerArticle(id: string): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: "Supabase n'est pas configuré." };

  const { data: avant } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("[admin] Suppression d'article impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error) };
  }

  rafraichirPagesPubliques(avant?.slug);
  revalidatePath("/admin/articles");

  return { statut: "succes", message: "Article supprimé." };
}
