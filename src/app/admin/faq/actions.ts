"use server";

import { revalidatePath } from "next/cache";
import { schemaQuestionFaq } from "@/lib/validation/contenu";
import { accesAdmin, valider, echec } from "@/lib/actions-serveur";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Écritures sur la FAQ (page « Comment ça marche » et FAQ courte de la page
 * contact).
 *
 * Contrôle d'accès et validation : voir `lib/actions-serveur.ts`.
 */

function rafraichir() {
  revalidatePath("/comment-ca-marche");
  revalidatePath("/contact");
  revalidatePath("/admin/faq");
}

/** Crée une question (sans `id`) ou met à jour une question existante. */
export async function enregistrerQuestion(
  id: string | null,
  donneesBrutes: unknown,
): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const validation = valider(schemaQuestionFaq, donneesBrutes);
  if (validation.erreur) return validation.erreur;

  const ligne = validation.donnees;
  const { data, error } = id
    ? await supabase.from("faq").update(ligne).eq("id", id).select("id").single()
    : await supabase.from("faq").insert(ligne).select("id").single();

  if (error) {
    console.error("[admin] Enregistrement de la question impossible :", error);
    return echec("L'enregistrement a échoué.");
  }

  rafraichir();
  return { statut: "succes", message: "Question enregistrée.", id: data.id };
}

export async function supprimerQuestion(id: string): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const { error } = await supabase.from("faq").delete().eq("id", id);
  if (error) {
    console.error("[admin] Suppression de la question impossible :", error);
    return echec("La suppression a échoué.");
  }

  rafraichir();
  return { statut: "succes", message: "Question supprimée." };
}
