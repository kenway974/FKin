import "server-only";

import { redirect } from "next/navigation";
import { creerClientServeur } from "@/lib/supabase/server";

/**
 * Contrôle d'accès du back-office.
 *
 * L'appartenance à l'équipe d'administration n'est PAS codée en dur : elle est
 * matérialisée par une ligne dans la table `admins` (voir `supabase/schema.sql`).
 * Ajouter un second administrateur se fait donc en créant un utilisateur dans
 * Supabase Auth puis en insérant son `user_id` dans cette table — sans toucher
 * au code.
 */

export type AdminConnecte = {
  id: string;
  email: string | null;
  nomAffichage: string | null;
};

/**
 * Renvoie l'administrateur connecté, ou `null`.
 * Ne redirige pas : à utiliser quand l'absence de session est un cas normal.
 */
export async function recupererAdmin(): Promise<AdminConnecte | null> {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Un compte Supabase Auth valide ne suffit pas : il doit être référencé
  // comme administrateur. C'est ce qui permettra d'ouvrir plus tard des
  // comptes non-admin sans leur donner accès au back-office.
  const { data: admin, error } = await supabase
    .from("admins")
    .select("user_id, email, nom_affichage")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !admin) return null;

  return {
    id: user.id,
    email: admin.email ?? user.email ?? null,
    nomAffichage: admin.nom_affichage ?? null,
  };
}

/**
 * Variante stricte : redirige vers la page de connexion si l'utilisateur n'est
 * pas un administrateur. Le middleware bloque déjà `/admin`, mais cette
 * vérification serveur est la garantie réelle (le middleware ne voit pas la
 * table `admins`).
 */
export async function exigerAdmin(cheminDemande = "/admin"): Promise<AdminConnecte> {
  const admin = await recupererAdmin();
  if (!admin) {
    redirect(`/connexion?suite=${encodeURIComponent(cheminDemande)}`);
  }
  return admin;
}
