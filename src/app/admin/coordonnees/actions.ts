"use server";

import { revalidatePath } from "next/cache";
import { schemaCoordonnees } from "@/lib/validation/contenu";
import { accesAdmin, valider, echec } from "@/lib/actions-serveur";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Écriture des coordonnées du site (ligne unique de la table `coordonnees`).
 *
 * Contrôle d'accès et validation : voir `lib/actions-serveur.ts`.
 */
export async function enregistrerCoordonnees(donneesBrutes: unknown): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const validation = valider(schemaCoordonnees, donneesBrutes);
  if (validation.erreur) return validation.erreur;

  const d = validation.donnees;
  const ouNull = (valeur: string) => valeur || null;
  const { error } = await supabase.from("coordonnees").upsert(
    {
      id: true,
      email: d.email,
      telephone: ouNull(d.telephone),
      rue: ouNull(d.rue),
      code_postal: d.codePostal,
      ville: d.ville,
      adresse_rdc: ouNull(d.adresseRdc),
      whatsapp: ouNull(d.whatsapp),
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[admin] Enregistrement des coordonnées impossible :", error);
    return echec("L'enregistrement a échoué.");
  }

  // Pied de page : toutes les pages publiques sont concernées.
  revalidatePath("/", "layout");
  revalidatePath("/admin/coordonnees");
  return { statut: "succes", message: "Coordonnées enregistrées." };
}
