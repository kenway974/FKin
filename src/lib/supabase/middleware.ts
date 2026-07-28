import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, supabaseConfigure } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Rafraîchit la session Supabase et renvoie l'utilisateur courant.
 *
 * Le middleware s'exécute avant chaque requête : c'est le seul endroit où l'on
 * peut réécrire les cookies de session expirés. Cette fonction retourne à la
 * fois la réponse (porteuse des cookies mis à jour) et l'utilisateur, pour que
 * le middleware décide ensuite s'il redirige ou non.
 */
export async function rafraichirSession(requete: NextRequest) {
  let reponse = NextResponse.next({ request: requete });

  if (!supabaseConfigure) {
    return { reponse, utilisateur: null };
  }

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return requete.cookies.getAll();
        },
        setAll(cookiesAPoser) {
          for (const { name, value } of cookiesAPoser) {
            requete.cookies.set(name, value);
          }
          reponse = NextResponse.next({ request: requete });
          for (const { name, value, options } of cookiesAPoser) {
            reponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // `getUser()` (et non `getSession()`) : la réponse est validée auprès du
  // serveur Supabase, elle ne peut donc pas être falsifiée côté client.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { reponse, utilisateur: user };
}
