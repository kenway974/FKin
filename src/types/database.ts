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
  latitude: number | null;
  longitude: number | null;
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
  /** Réponses structurées du formulaire en étapes (null pour les anciens messages). */
  details: DetailsDon | null;
  /** Chemins des photos jointes dans le bucket privé « photos-dons ». */
  photos: string[];
  created_at: string;
};

/** Réponses du formulaire en étapes, rangées dans `messages.details`. */
export type DetailsDon = {
  materiel?: string[];
  quantite?: string;
  etat?: string;
  ville?: string;
  pays?: string;
  delai?: string;
  structure?: string;
  effectifs?: string;
};

export type ChiffreCle = {
  id: string;
  valeur: number;
  suffixe: string;
  libelle: string;
  precision: string | null;
  ordre: number;
  created_at: string;
  updated_at: string;
};

export type LigneFaq = {
  id: string;
  question: string;
  reponse: string;
  public: "donateurs" | "beneficiaires" | "tous";
  essentielle: boolean;
  ordre: number;
  created_at: string;
  updated_at: string;
};

/** Ligne unique des coordonnées du site (clé `id` toujours `true`). */
export type LigneCoordonnees = {
  id: boolean;
  email: string | null;
  telephone: string | null;
  rue: string | null;
  code_postal: string | null;
  ville: string | null;
  adresse_rdc: string | null;
  whatsapp: string | null;
  updated_at: string;
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
        Insert: Omit<Projet, "id" | "created_at" | "updated_at" | "latitude" | "longitude"> & {
          latitude?: number | null;
          longitude?: number | null;
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Projet, "id" | "created_at">>;
        Relationships: [];
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at" | "lu" | "details" | "photos"> & {
          id?: string;
          created_at?: string;
          lu?: boolean;
          details?: DetailsDon | null;
          photos?: string[];
        };
        Update: Partial<Omit<Message, "id" | "created_at">>;
        Relationships: [];
      };
      chiffres_cles: {
        Row: ChiffreCle;
        Insert: Omit<ChiffreCle, "id" | "created_at" | "updated_at" | "suffixe" | "precision"> & {
          id?: string;
          suffixe?: string;
          precision?: string | null;
        };
        Update: Partial<Omit<ChiffreCle, "id" | "created_at">>;
        Relationships: [];
      };
      faq: {
        Row: LigneFaq;
        Insert: Omit<
          LigneFaq,
          "id" | "created_at" | "updated_at" | "public" | "essentielle" | "ordre"
        > & {
          id?: string;
          public?: LigneFaq["public"];
          essentielle?: boolean;
          ordre?: number;
        };
        Update: Partial<Omit<LigneFaq, "id" | "created_at">>;
        Relationships: [];
      };
      coordonnees: {
        Row: LigneCoordonnees;
        Insert: Partial<Omit<LigneCoordonnees, "updated_at">>;
        Update: Partial<Omit<LigneCoordonnees, "id" | "updated_at">>;
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
      // Limite d'envois du formulaire de contact : 0 = accepté, sinon secondes à attendre.
      consommer_envoi: {
        Args: { p_cle: string; p_max: number; p_fenetre_s: number };
        Returns: number;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
