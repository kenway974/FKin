"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { schemaProjet } from "@/lib/validation/contenu";
import { accesAdmin, valider, messageErreurBase } from "@/lib/actions-serveur";
import type { ResultatAction } from "@/lib/actions-types";

/**
 * Écritures sur les projets de la galerie.
 *
 * Contrôle d'accès et validation : voir `lib/actions-serveur.ts`.
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
    latitude: donnees.latitude,
    longitude: donnees.longitude,
  };
}

const DOUBLON = "Ce slug est déjà utilisé par un autre projet. Choisissez-en un autre.";

export async function creerProjet(donneesBrutes: unknown): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const validation = valider(schemaProjet, donneesBrutes);
  if (validation.erreur) return validation.erreur;

  const { data, error } = await supabase
    .from("projets")
    .insert(versLigne(validation.donnees))
    .select("id")
    .single();

  if (error) {
    console.error("[admin] Création de projet impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error, DOUBLON) };
  }

  rafraichirPagesPubliques();
  revalidatePath("/admin/projets");

  return { statut: "succes", message: "Projet créé.", id: data.id };
}

export async function modifierProjet(id: string, donneesBrutes: unknown): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const validation = valider(schemaProjet, donneesBrutes);
  if (validation.erreur) return validation.erreur;

  const { data, error } = await supabase
    .from("projets")
    .update({ ...versLigne(validation.donnees), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    console.error("[admin] Modification de projet impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error, DOUBLON) };
  }

  rafraichirPagesPubliques();
  revalidatePath("/admin/projets");

  return { statut: "succes", message: "Modifications enregistrées.", id: data.id };
}

export async function supprimerProjet(id: string): Promise<ResultatAction> {
  const acces = await accesAdmin();
  if (acces.erreur) return acces.erreur;
  const { supabase } = acces;

  const { error } = await supabase.from("projets").delete().eq("id", id);

  if (error) {
    console.error("[admin] Suppression de projet impossible :", error);
    return { statut: "erreur", message: messageErreurBase(error, DOUBLON) };
  }

  rafraichirPagesPubliques();
  revalidatePath("/admin/projets");

  return { statut: "succes", message: "Projet supprimé." };
}
