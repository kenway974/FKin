/**
 * Catégories des articles et filtre de la page Actualités.
 *
 * Module sans dépendance serveur : il est utilisé à la fois par le
 * back-office (choix de la catégorie), par la validation et par le composant
 * client qui filtre la liste des actualités.
 */

export const CATEGORIES_ARTICLE = [
  {
    id: "entreprises",
    libelle: "Entreprises",
    description: "Donner son matériel, protéger ses données, valoriser son don.",
  },
  {
    id: "beneficiaires",
    libelle: "Écoles & associations",
    description: "S'équiper en matériel informatique et monter une salle.",
  },
  {
    id: "congo",
    libelle: "Congo",
    description: "Le terrain, l'acheminement, la réparation et la formation.",
  },
  {
    id: "association",
    libelle: "L'association",
    description: "La vie de Respusse, nos convois et nos comptes rendus.",
  },
] as const;

export type CategorieArticle = (typeof CATEGORIES_ARTICLE)[number]["id"];

const IDENTIFIANTS: readonly string[] = CATEGORIES_ARTICLE.map((categorie) => categorie.id);

export function estCategorieArticle(valeur: unknown): valeur is CategorieArticle {
  return typeof valeur === "string" && IDENTIFIANTS.includes(valeur);
}

export function libelleCategorie(id: CategorieArticle): string {
  return CATEGORIES_ARTICLE.find((categorie) => categorie.id === id)?.libelle ?? id;
}

/** Minuscules, sans accents : « École » et « ecole » se valent. */
function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type ArticleFiltrable = { titre: string; extrait: string | null; categorie: string | null };

/**
 * Articles correspondant à une catégorie et à une recherche.
 *
 * La recherche porte sur le titre et le chapô ; chaque mot saisi doit y
 * figurer. Une catégorie inconnue (lien ancien, adresse modifiée à la main)
 * est ignorée plutôt que de vider la liste.
 */
export function filtrerArticles<T extends ArticleFiltrable>(
  articles: T[],
  { categorie, recherche }: { categorie?: string | null; recherche?: string | null },
): T[] {
  const mots = normaliser(recherche ?? "")
    .split(/\s+/)
    .filter(Boolean);
  const filtreCategorie = estCategorieArticle(categorie) ? categorie : null;

  return articles.filter((article) => {
    if (filtreCategorie && article.categorie !== filtreCategorie) return false;
    if (!mots.length) return true;
    const texte = normaliser(`${article.titre} ${article.extrait ?? ""}`);
    return mots.every((mot) => texte.includes(mot));
  });
}
