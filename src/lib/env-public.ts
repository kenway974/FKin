import { z } from "zod";

/**
 * Variables d'environnement destinées au navigateur.
 *
 * Ce module est volontairement séparé de `lib/env.ts` : il ne connaît que les
 * variables `NEXT_PUBLIC_*`, et c'est le seul que du code client a le droit
 * d'importer.
 *
 * Next.js n'inline jamais la valeur d'une variable non préfixée `NEXT_PUBLIC_`
 * dans un bundle client — les secrets ne fuitaient donc pas auparavant. Mais
 * décrire ici toutes les variables, secrets compris, envoyait leur nom et leur
 * schéma de validation au navigateur pour rien, et exposait le projet à une
 * erreur future : il aurait suffi qu'un secret soit lu autrement que par
 * `process.env` pour qu'il parte réellement. Cette séparation supprime le
 * risque à la racine.
 */
const schemaPublic = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20).optional(),
  NEXT_PUBLIC_SUPABASE_BUCKET: z.string().min(1).default("medias"),
});

// Chaque variable est nommée littéralement : Next.js ne substitue
// `process.env.NEXT_PUBLIC_*` à la compilation que sous cette forme exacte.
const brut = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_BUCKET: process.env.NEXT_PUBLIC_SUPABASE_BUCKET,
};

// Une chaîne vide dans un `.env` mal rempli vaut « non définie ».
const nettoye = Object.fromEntries(
  Object.entries(brut).filter(([, valeur]) => valeur !== undefined && valeur !== ""),
);

const resultat = schemaPublic.safeParse(nettoye);

if (!resultat.success) {
  console.error(
    "Variables d'environnement publiques invalides :",
    z.flattenError(resultat.error).fieldErrors,
  );
  throw new Error("Variables d'environnement publiques invalides. Voir .env.example.");
}

export const envPublic = resultat.data;

/** Vrai si les variables permettant de lire la base publique sont présentes. */
export const supabaseConfigure = Boolean(
  envPublic.NEXT_PUBLIC_SUPABASE_URL && envPublic.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/** URL publique du site, sans slash final. */
export const urlSite = envPublic.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
