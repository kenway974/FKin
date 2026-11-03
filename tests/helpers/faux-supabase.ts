import { vi } from "vitest";

/**
 * Faux client Supabase, limité à ce qu'utilisent `lib/auth.ts` et les Server
 * Actions du back-office. Chaque appel à `from(table)` est enregistré pour que
 * les tests puissent vérifier qu'aucune écriture n'a été tentée.
 */
export type OptionsFauxSupabase = {
  /** Utilisateur renvoyé par `auth.getUser()` (null = pas de session). */
  utilisateur?: { id: string; email?: string | null } | null;
  /** Ligne renvoyée par la requête sur la table `admins` (null = absente). */
  ligneAdmin?: { user_id: string; email: string | null; nom_affichage: string | null } | null;
  /** Erreur renvoyée par la requête sur la table `admins`. */
  erreurAdmin?: { message: string } | null;
};

export function creerFauxSupabase(options: OptionsFauxSupabase = {}) {
  const { utilisateur = null, ligneAdmin = null, erreurAdmin = null } = options;

  const ecritures = {
    delete: vi.fn(),
    update: vi.fn(),
    insert: vi.fn(),
  };
  const filtresAdmins: Array<[string, unknown]> = [];

  const client = {
    auth: {
      getUser: vi.fn(async () => ({ data: { user: utilisateur }, error: null })),
    },
    from: vi.fn((table: string) => {
      if (table === "admins") {
        const requete = {
          select: () => requete,
          eq: (colonne: string, valeur: unknown) => {
            filtresAdmins.push([colonne, valeur]);
            return requete;
          },
          maybeSingle: async () => ({ data: ligneAdmin, error: erreurAdmin }),
        };
        return requete;
      }

      const resultat = { eq: async () => ({ error: null }) };
      return {
        delete: (...args: unknown[]) => {
          ecritures.delete(table, ...args);
          return resultat;
        },
        update: (...args: unknown[]) => {
          ecritures.update(table, ...args);
          return resultat;
        },
        insert: async (...args: unknown[]) => {
          ecritures.insert(table, ...args);
          return { error: null };
        },
      };
    }),
  };

  return { client, ecritures, filtresAdmins };
}
