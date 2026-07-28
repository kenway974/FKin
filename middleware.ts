import { NextResponse, type NextRequest } from "next/server";
import { rafraichirSession } from "@/lib/supabase/middleware";

/**
 * Middleware d'accès.
 *
 * Deux rôles :
 *  1. rafraîchir les cookies de session Supabase à chaque requête ;
 *  2. fermer la porte de `/admin` aux visiteurs non authentifiés.
 *
 * Il ne s'agit que du premier filtre : la vérification de l'appartenance à la
 * table `admins` a lieu côté serveur dans `lib/auth.ts`, et les politiques RLS
 * de la base constituent la protection de dernier recours.
 */
export async function middleware(requete: NextRequest) {
  const { reponse, utilisateur } = await rafraichirSession(requete);
  const chemin = requete.nextUrl.pathname;

  // Espace d'administration : session obligatoire.
  if (chemin.startsWith("/admin") && !utilisateur) {
    const url = requete.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = `?suite=${encodeURIComponent(chemin)}`;
    return NextResponse.redirect(url);
  }

  // Déjà connecté : la page de connexion n'a plus d'intérêt.
  if (chemin === "/connexion" && utilisateur) {
    const url = requete.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return reponse;
}

export const config = {
  /**
   * On exclut les fichiers statiques et les images : les faire passer par le
   * middleware coûterait un aller-retour réseau inutile à chaque asset, ce qui
   * pèse lourd sur les connexions lentes visées par ce projet.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
