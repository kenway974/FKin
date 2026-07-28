"use server";

import { revalidatePath } from "next/cache";
import { creerClientServeur } from "@/lib/supabase/server";
import { recupererAdmin } from "@/lib/auth";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Actions sur les messages reçus.
 *
 * Les messages ne sont jamais modifiés sur le fond : seul leur état « lu » peut
 * changer, et ils peuvent être supprimés. Cela garantit que le contenu affiché
 * dans le back-office est bien celui qui a été envoyé.
 */

export async function marquerCommeLu(id: string, lu: boolean): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: "Supabase n'est pas configuré." };

  const { error } = await supabase.from("messages").update({ lu }).eq("id", id);

  if (error) {
    console.error("[admin] Changement de statut du message impossible :", error);
    return { statut: "erreur", message: "La mise à jour a échoué." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);

  return { statut: "succes", message: lu ? "Message marqué comme lu." : "Message marqué non lu." };
}

export async function supprimerMessage(id: string): Promise<ResultatAction> {
  const admin = await recupererAdmin();
  if (!admin) return { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: "Supabase n'est pas configuré." };

  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) {
    console.error("[admin] Suppression du message impossible :", error);
    return { statut: "erreur", message: "La suppression a échoué." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/messages");

  return { statut: "succes", message: "Message supprimé." };
}
