"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { schemaArticle } from "@/lib/validation/contenu";
import { accesAdmin, valider, messageErreurBase } from "@/lib/actions-serveur";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Écritures sur les articles de blog.
 *
 * Contrôle d'accès et validation : voir `lib/actions-serveur.ts`.
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

const DOUBLON = "Ce slug est déjà utilisé par un autre article. Choisissez-en un autre.";

export async function creerArticle(donneesBrutes: unknown): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const validation = valider(schemaArticle, donneesBrutes);
  if (validation.erreur) return validation.erreur;

  const { data, error } = await supabase
    .from("articles")
    .insert(versLigne(validation.donnees))
    .select("id, slug")
    .single();

  if (error) {
    console.error("[admin] Création d'article impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error, DOUBLON) };
  }

  rafraichirPagesPubliques(data.slug);
  revalidatePath("/admin/articles");

  return { statut: "succes", message: "Article créé.", id: data.id };
}

export async function modifierArticle(id: string, donneesBrutes: unknown): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const validation = valider(schemaArticle, donneesBrutes);
  if (validation.erreur) return validation.erreur;

  // L'ancien slug est récupéré avant modification : si le slug change, l'URL
  // précédente doit elle aussi être invalidée dans le cache.
  const { data: avant } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();

  const { data, error } = await supabase
    .from("articles")
    .update({ ...versLigne(validation.donnees), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) {
    console.error("[admin] Modification d'article impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error, DOUBLON) };
  }

  if (avant?.slug && avant.slug !== data.slug) rafraichirPagesPubliques(avant.slug);
  rafraichirPagesPubliques(data.slug);
  revalidatePath("/admin/articles");

  return { statut: "succes", message: "Modifications enregistrées.", id: data.id };
}

export async function supprimerArticle(id: string): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const { data: avant } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("[admin] Suppression d'article impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error, DOUBLON) };
  }

  rafraichirPagesPubliques(avant?.slug);
  revalidatePath("/admin/articles");

  return { statut: "succes", message: "Article supprimé." };
}
