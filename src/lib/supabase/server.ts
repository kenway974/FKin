import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, supabaseConfigure, supabaseServiceConfigure } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Client Supabase pour les Server Components, Server Actions et Route Handlers.
 *
 * Il porte la session de l'utilisateur via les cookies : les politiques RLS
 * définies dans `supabase/schema.sql` s'appliquent donc réellement. C'est ce
 * client qui sert au back-office — un visiteur non authentifié ne peut rien
 * modifier, même en rejouant les requêtes à la main.
 *
 * `cookies()` est asynchrone depuis Next.js 15, d'où le `await`.
 */
export async function creerClientServeur() {
  if (!supabaseConfigure) return null;

  const magasinCookies = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return magasinCookies.getAll();
        },
        setAll(cookiesAPoser) {
          try {
            for (const { name, value, options } of cookiesAPoser) {
              magasinCookies.set(name, value, options);
            }
          } catch {
            // Appelé depuis un Server Component : l'écriture de cookies y est
            // interdite. Le rafraîchissement de session est alors assuré par
            // le middleware, ce cas est donc sans conséquence.
          }
        },
      },
    },
  );
}

/**
 * Client de lecture publique, sans cookies.
 *
 * Les pages publiques n'affichent que du contenu publié : elles n'ont donc
 * aucun besoin de la session du visiteur. Utiliser le client à cookies pour
 * ces lectures aurait deux défauts :
 *
 *  1. `cookies()` est interdit hors d'une requête — `generateStaticParams` et
 *     le sitemap échoueraient au build (c'est exactement ce qui se produisait) ;
 *  2. lire les cookies force le rendu dynamique, ce qui ferait perdre le cache
 *     statique dont dépendent les visiteurs sur connexion lente.
 *
 * La clé anonyme reste soumise aux politiques RLS : ce client ne voit que ce
 * qu'un visiteur non authentifié peut voir.
 */
export function creerClientPublic() {
  if (!supabaseConfigure) return null;

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

/**
 * Client privilégié « service_role ».
 *
 * ⚠️ Contourne toutes les politiques RLS. Réservé à un seul usage :
 * l'enregistrement des messages du formulaire de contact. Cela permet de
 * n'accorder AUCUN droit d'écriture au rôle anonyme sur la table `messages`,
 * tout en laissant le formulaire public fonctionner.
 *
 * Ne jamais importer ce module depuis un composant client.
 */
export function creerClientService() {
  if (!supabaseServiceConfigure) return null;

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      // Aucun cookie : ce client ne doit jamais hériter d'une session.
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
