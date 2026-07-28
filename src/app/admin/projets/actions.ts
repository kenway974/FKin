"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { schemaProjet } from "@/lib/validation/contenu";
import { creerClientServeur } from "@/lib/supabase/server";
import { recupererAdmin } from "@/lib/auth";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Écritures sur les projets de la galerie.
 *
 * Même principe que pour les articles : vérification de l'administrateur en
 * tête de chaque action, validation zod, puis RLS côté base.
 */

/** Invalide les pages publiques où la galerie apparaît. */
function rafraichirPagesPubliques() {
  revalidatePath("/");
  revalidatePath("/realisations");
}

function versLigne(donnees: z.infer<typeof schemaProjet>) {
  return {
    titre: donnees.titre,
    slug: donnees.slug,
    description: donnees.description,
    lieu: donnees.lieu,
    date_projet: donnees.dateProjet || null,
    type_materiel: donnees.typeMateriel,
    resultat: donnees.resultat,
    image_url: donnees.imageUrl || null,
    image_alt: donnees.imageAlt || null,
    publie: donnees.publie,
    ordre: donnees.ordre,
  };
}

function messageErreurBase(erreur: { code?: string; message: string }) {
  if (erreur.code === "23505") {
    return "Ce slug est déjà utilisé par un autre projet. Choisissez-en un autre.";
  }
  if (erreur.code === "42501") {
    return "Vous n'avez pas les droits nécessaires pour cette opération.";
  }
  return "L'enregistrement a échoué. Réessayez dans quelques instants.";
}

export async function creerProjet(donneesBrutes: unknown): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const analyse = schemaProjet.safeParse(donneesBrutes);
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
    .from("projets")
    .insert(versLigne(analyse.data))
    .select("id")
    .single();

  if (error) {
    console.error("[admin] Création de projet impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error) };
  }

  rafraichirPagesPubliques();
  revalidatePath("/admin/projets");

  return { statut: "succes", message: "Projet créé.", id: data.id };
}

export async function modifierProjet(id: string, donneesBrutes: unknown): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const analyse = schemaProjet.safeParse(donneesBrutes);
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
    .from("projets")
    .update({ ...versLigne(analyse.data), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    console.error("[admin] Modification de projet impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error) };
  }

  rafraichirPagesPubliques();
  revalidatePath("/admin/projets");

  return { statut: "succes", message: "Modifications enregistrées.", id: data.id };
}

export async function supprimerProjet(id: string): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: "Supabase n'est pas configuré." };

  const { error } = await supabase.from("projets").delete().eq("id", id);

  if (error) {
    console.error("[admin] Suppression de projet impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error) };
  }

  rafraichirPagesPubliques();
  revalidatePath("/admin/projets");

  return { statut: "succes", message: "Projet supprimé." };
}
