"use server";

import { revalidatePath } from "next/cache";
import { schemaChiffre } from "@/lib/validation/contenu";
import { accesAdmin, valider, echec } from "@/lib/actions-serveur";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Écritures sur les chiffres d'impact de la page d'accueil.
 *
 * Contrôle d'accès et validation : voir `lib/actions-serveur.ts`.
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
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const validation = valider(schemaChiffre, donneesBrutes);
  if (validation.erreur) return validation.erreur;

  const ligne = {
    valeur: validation.donnees.valeur,
    suffixe: validation.donnees.suffixe ?? "",
    libelle: validation.donnees.libelle,
    precision: validation.donnees.precision || null,
    ordre: validation.donnees.ordre,
  };

  const { data, error } = id
    ? await supabase.from("chiffres_cles").update(ligne).eq("id", id).select("id").single()
    : await supabase.from("chiffres_cles").insert(ligne).select("id").single();

  if (error) {
    console.error("[admin] Enregistrement du chiffre impossible :", error);
    return echec("L'enregistrement a échoué.");
  }

  rafraichir();
  return { statut: "succes", message: "Chiffre enregistré.", id: data.id };
}

export async function supprimerChiffre(id: string): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const { error } = await supabase.from("chiffres_cles").delete().eq("id", id);
  if (error) {
    console.error("[admin] Suppression du chiffre impossible :", error);
    return echec("La suppression a échoué.");
  }

  rafraichir();
  return { statut: "succes", message: "Chiffre supprimé." };
}
