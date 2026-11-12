import { NextResponse, type NextRequest } from "next/server";
import { rafraichirSession } from "@/lib/supabase/middleware";
import { cheminCanonique } from "@/lib/url-canonique";

/**
 * Middleware d'accès.
 *
 * Trois rôles :
 *  1. rediriger (308, permanente) toute variante d'URL vers sa forme
 *     canonique — minuscules, sans barre oblique finale ni répétée — pour
 *     qu'une page ne soit jamais servie sous deux adresses ;
 *  2. rafraîchir les cookies de session Supabase à chaque requête ;
 *  3. fermer la porte de `/admin` aux visiteurs non authentifiés.
 *
 * Emplacement : `src/middleware.ts`. Avec un dossier `src/`, Next.js ignore
 * un middleware placé à la racine du projet.
 *
 * Il ne s'agit que du premier filtre : la vérification de l'appartenance à la
 * table `admins` a lieu côté serveur dans `lib/auth.ts`, et les politiques RLS
 * de la base constituent la protection de dernier recours.
 */
export async function middleware(requete: NextRequest) {
  const canonique = cheminCanonique(requete.nextUrl.pathname);
  if (canonique) {
    const url = requete.nextUrl.clone();
    url.pathname = canonique;
    return NextResponse.redirect(url, 308);
  }

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
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
