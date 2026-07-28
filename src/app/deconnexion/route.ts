import { NextResponse, type NextRequest } from "next/server";
import { creerClientServeur } from "@/lib/supabase/server";

/**
 * Déconnexion.
 *
 * Exposée en POST uniquement : une déconnexion est une action qui modifie
 * l'état de la session, elle ne doit donc pas pouvoir être déclenchée par une
 * simple visite d'URL (ni par le préchargement d'un lien).
 */
export async function POST(requete: NextRequest) {
  const supabase = await creerClientServeur();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const url = requete.nextUrl.clone();
  url.pathname = "/connexion";
  url.search = "";

  // 303 : force le navigateur à repasser en GET sur la destination.
  return NextResponse.redirect(url, { status: 303 });
}
