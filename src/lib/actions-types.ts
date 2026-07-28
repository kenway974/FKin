/**
 * Forme de réponse commune à toutes les Server Actions du back-office.
 *
 * Ce type vit dans un module à part plutôt que dans un fichier « use server » :
 * ces derniers ne doivent exporter que des fonctions asynchrones.
 */
export type ResultatAction =
  | { statut: "succes"; message: string; id?: string }
  | { statut: "erreur"; message: string; erreursChamps?: Record<string, string[]> };

/** Réponse du formulaire de contact public. */
export type ResultatContact = {
  statut: "succes" | "erreur";
  message: string;
  /** Erreurs par champ, remontées telles quelles dans react-hook-form. */
  erreursChamps?: Record<string, string[]>;
};
