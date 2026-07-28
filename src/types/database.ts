/**
 * Types de la base Supabase.
 *
 * Écrits à la main pour rester alignés sur `supabase/schema.sql` sans qu'aucune
 * connexion à un projet distant ne soit nécessaire.
 *
 * Une fois votre projet Supabase créé, vous pouvez régénérer ce fichier
 * automatiquement :
 *   npx supabase gen types typescript --project-id <votre-id> > src/types/database.ts
 */

/** Statut éditorial d'un article de blog. */
export type StatutArticle = "brouillon" | "publie";

/** Nature de l'organisation qui écrit via le formulaire de contact. */
export type TypeEmetteur = "entreprise" | "beneficiaire";

export type Article = {
  id: string;
  slug: string;
  titre: string;
  extrait: string | null;
  contenu: string;
  image_couverture: string | null;
  image_alt: string | null;
  statut: StatutArticle;
  date_publication: string | null;
  auteur: string | null;
  created_at: string;
  updated_at: string;
};

export type Projet = {
  id: string;
  slug: string;
  titre: string;
  description: string;
  lieu: string;
  date_projet: string | null;
  type_materiel: string;
  resultat: string;
  image_url: string | null;
  image_alt: string | null;
  publie: boolean;
  ordre: number;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  nom: string;
  email: string;
  organisation: string | null;
  telephone: string | null;
  type_emetteur: TypeEmetteur;
  sujet: string;
  message: string;
  lu: boolean;
  created_at: string;
};

export type Admin = {
  user_id: string;
  email: string | null;
  nom_affichage: string | null;
  created_at: string;
};

/**
 * Forme attendue par `createClient<Database>()`. Seules les tables réellement
 * utilisées par l'application sont décrites.
 */
export type Database = {
  public: {
    Tables: {
      articles: {
        Row: Article;
        Insert: Omit<Article, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Article, "id" | "created_at">>;
        Relationships: [];
      };
      projets: {
        Row: Projet;
        Insert: Omit<Projet, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Projet, "id" | "created_at">>;
        Relationships: [];
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at" | "lu"> & {
          id?: string;
          created_at?: string;
          lu?: boolean;
        };
        Update: Partial<Omit<Message, "id" | "created_at">>;
        Relationships: [];
      };
      admins: {
        Row: Admin;
        Insert: Admin;
        Update: Partial<Admin>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      // Fonction SQL utilisée par les politiques RLS (voir supabase/schema.sql).
      est_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
