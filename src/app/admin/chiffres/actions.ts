"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { schemaChiffre } from "@/lib/validation/contenu";
import { creerClientServeur } from "@/lib/supabase/server";
import { recupererAdmin } from "@/lib/auth";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Écritures sur les chiffres d'impact de la page d'accueil.
 *
 * Même principe que pour les articles et les projets : vérification de
 * l'administrateur en tête de chaque action, validation zod, puis RLS côté
 * base.
 */

function rafraichir() {
  revalidatePath("/");
  revalidatePath("/admin/chiffres");
}

/** Crée un chiffre (sans `id`) ou met à jour un chiffre existant. */
export async function enregistrerChiffre(
  id: string | null,
  donneesBrutes: unknown,
): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const analyse = schemaChiffre.safeParse(donneesBrutes);
  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Certains champs doivent être corrigés.",
      erreursChamps: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: "Supabase n'est pas configuré." };

  const ligne = {
    valeur: analyse.data.valeur,
    suffixe: analyse.data.suffixe ?? "",
    libelle: analyse.data.libelle,
    precision: analyse.data.precision || null,
    ordre: analyse.data.ordre,
  };

  const { data, error } = id
    ? await supabase.from("chiffres_cles").update(ligne).eq("id", id).select("id").single()
    : await supabase.from("chiffres_cles").insert(ligne).select("id").single();

  if (error) {
    console.error("[admin] Enregistrement du chiffre impossible :", error);
    return { statut: "erreur", message: "L'enregistrement a échoué." };
  }

  rafraichir();
  return { statut: "succes", message: "Chiffre enregistré.", id: data.id };
}

export async function supprimerChiffre(id: string): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: "Supabase n'est pas configuré." };

  const { error } = await supabase.from("chiffres_cles").delete().eq("id", id);
  if (error) {
    console.error("[admin] Suppression du chiffre impossible :", error);
    return { statut: "erreur", message: "La suppression a échoué." };
  }

  rafraichir();
  return { statut: "succes", message: "Chiffre supprimé." };
}
