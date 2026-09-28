import { z } from "zod";

/**
 * Schéma du formulaire de contact, en étapes.
 *
 * Volontairement partagé entre le client (react-hook-form) et le serveur
 * (Server Action) : une seule définition, donc aucune divergence possible entre
 * ce que le navigateur autorise et ce que le serveur accepte réellement.
 *
 * Le parcours dépend du profil :
 *   - entreprise donatrice : matériel, quantité, état, ville d'enlèvement, délai ;
 *   - structure bénéficiaire : besoins, quantité, type de structure, effectifs,
 *     pays et ville.
 */

// --- Listes de choix (valeur enregistrée → libellé affiché) -----------------

export const MATERIELS = {
  portables: "Ordinateurs portables",
  fixes: "Ordinateurs fixes",
  ecrans: "Écrans",
  imprimantes: "Imprimantes",
  tablettes: "Tablettes et téléphones",
  reseau: "Réseau et serveurs",
  mobilier: "Mobilier scolaire",
  autre: "Autre matériel",
} as const;

export const QUANTITES = {
  "1-10": "1 à 10",
  "11-50": "11 à 50",
  "51-200": "51 à 200",
  "200+": "Plus de 200",
} as const;

export const ETATS = {
  fonctionnel: "Fonctionne",
  "a-verifier": "À vérifier",
  mixte: "Mélangé, une partie hors service",
} as const;

export const DELAIS = {
  urgent: "Dès que possible",
  "1-mois": "Dans le mois",
  "3-mois": "D'ici 3 mois",
  souple: "Pas pressé",
} as const;

export const STRUCTURES = {
  ecole: "École, collège, lycée",
  mairie: "Mairie",
  association: "Association",
  autre: "Autre structure",
} as const;

export const EFFECTIFS = {
  "1-50": "Moins de 50",
  "51-200": "51 à 200",
  "201-500": "201 à 500",
  "500+": "Plus de 500",
} as const;

export const PAYS = {
  france: "France",
  rdc: "RD Congo",
  congo: "Congo-Brazzaville",
  autre: "Autre pays",
} as const;

const cles = <T extends Record<string, string>>(objet: T) =>
  Object.keys(objet) as [keyof T & string, ...(keyof T & string)[]];

// --- Photos -------------------------------------------------------------------

/** Nombre maximal de photos jointes. */
export const PHOTOS_MAX = 5;
/**
 * Poids maximal d'une photo, après compression dans le navigateur (une photo
 * de 1600 px en WebP pèse rarement plus de 500 Ko). Cinq photos restent ainsi
 * sous la limite de 4,5 Mo par requête imposée par l'hébergeur.
 */
export const PHOTO_POIDS_MAX = 800 * 1024;

// --- Schéma -------------------------------------------------------------------

const texteFacultatif = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(""));

/** Champs communs aux deux parcours. */
const champsCommuns = {
  materiel: z
    .array(z.enum(cles(MATERIELS)))
    .min(1, "Choisissez au moins un type de matériel.")
    .max(Object.keys(MATERIELS).length),

  quantite: z.enum(cles(QUANTITES), { message: "Indiquez une quantité approximative." }),

  ville: z.string().trim().min(2, "Indiquez la ville.").max(120, "Ce nom de ville est trop long."),

  nom: z
    .string()
    .trim()
    .min(2, "Merci d'indiquer votre nom (2 caractères minimum).")
    .max(120, "Ce nom est trop long."),

  email: z.email("Cette adresse e-mail ne semble pas valide.").max(180),

  organisation: texteFacultatif(160, "Ce nom d'organisation est trop long."),
  telephone: texteFacultatif(30, "Ce numéro est trop long."),
  precisions: texteFacultatif(4000, "Ce message dépasse 4 000 caractères."),

  /**
   * Champ « miroir » (honeypot) : invisible et hors du flux de tabulation.
   * Un humain ne le remplit jamais ; un robot qui remplit tous les champs, si.
   * Doit donc rester vide.
   */
  siteWeb: z.string().max(0, "Envoi refusé.").optional().or(z.literal("")),

  /**
   * Horodatage d'affichage du formulaire, en millisecondes.
   * Sert de piège temporel : un envoi en moins de 3 secondes est
   * quasi certainement automatisé (vérifié côté serveur).
   */
  charge: z.number().int().nonnegative().optional(),
};

/**
 * Un schéma par profil, réunis par leur discriminant `typeEmetteur` : les
 * champs propres à un parcours y sont obligatoires sans règle conditionnelle,
 * ce qui permet de valider chaque étape isolément.
 */
export const schemaContact = z.discriminatedUnion(
  "typeEmetteur",
  [
    z.object({
      typeEmetteur: z.literal("entreprise"),
      ...champsCommuns,
      etat: z.enum(cles(ETATS), { message: "Précisez l'état général du matériel." }),
      delai: z.enum(cles(DELAIS), { message: "Indiquez quand le matériel peut être enlevé." }),
    }),
    z.object({
      typeEmetteur: z.literal("beneficiaire"),
      ...champsCommuns,
      structure: z.enum(cles(STRUCTURES), { message: "Précisez le type de structure." }),
      effectifs: z.enum(cles(EFFECTIFS), {
        message: "Indiquez le nombre de personnes concernées.",
      }),
      pays: z.enum(cles(PAYS), { message: "Indiquez le pays." }),
    }),
  ],
  { error: "Merci de préciser qui vous êtes." },
);

export type DonneesContact = z.infer<typeof schemaContact>;

/**
 * Valeurs du formulaire en cours de saisie : tous les champs des deux
 * parcours, à plat, tant que le profil n'est pas encore fixé.
 */
export type ChampsContact = {
  typeEmetteur?: "entreprise" | "beneficiaire";
  materiel: (keyof typeof MATERIELS)[];
  quantite?: keyof typeof QUANTITES;
  etat?: keyof typeof ETATS;
  delai?: keyof typeof DELAIS;
  structure?: keyof typeof STRUCTURES;
  effectifs?: keyof typeof EFFECTIFS;
  pays?: keyof typeof PAYS;
  ville: string;
  nom: string;
  email: string;
  organisation?: string;
  telephone?: string;
  precisions?: string;
  siteWeb?: string;
  charge?: number;
};

/** Champs validés à chaque étape du formulaire (dans l'ordre du parcours). */
export const CHAMPS_PAR_ETAPE: Record<DonneesContact["typeEmetteur"], (keyof ChampsContact)[][]> = {
  entreprise: [
    ["typeEmetteur"],
    ["materiel", "quantite", "etat"],
    ["ville", "delai"],
    ["nom", "email", "organisation", "telephone", "precisions"],
  ],
  beneficiaire: [
    ["typeEmetteur"],
    ["materiel", "quantite", "structure", "effectifs"],
    ["pays", "ville"],
    ["nom", "email", "organisation", "telephone", "precisions"],
  ],
};

/** Délai minimal, en millisecondes, entre l'affichage et l'envoi du formulaire. */
export const DELAI_MINIMAL_ENVOI_MS = 3000;

/** Libellés lisibles pour l'affichage du type d'émetteur dans le back-office. */
export const libellesEmetteur = {
  entreprise: "Entreprise donatrice",
  beneficiaire: "Structure bénéficiaire",
} as const;

/**
 * Résumé lisible d'une demande : sert d'objet et de corps au message
 * enregistré (et à l'e-mail de notification), pour que chaque demande reste
 * complète et compréhensible même sans les colonnes structurées.
 */
export function resumerDemande(donnees: DonneesContact) {
  const materiel = donnees.materiel.map((cle) => MATERIELS[cle].toLowerCase()).join(", ");
  const quantite = QUANTITES[donnees.quantite];

  if (donnees.typeEmetteur === "entreprise") {
    const sujet = `Don : ${materiel} (${quantite}) — ${donnees.ville}`;
    const lignes = [
      `Matériel : ${materiel}`,
      `Quantité : ${quantite}`,
      `État : ${ETATS[donnees.etat]}`,
      `Enlèvement : ${donnees.ville}`,
      `Délai : ${DELAIS[donnees.delai]}`,
    ];
    return { sujet: sujet.slice(0, 180), message: assembler(lignes, donnees.precisions) };
  }

  const pays = PAYS[donnees.pays];
  const sujet = `Besoin : ${materiel} (${quantite}) — ${donnees.ville}, ${pays}`;
  const lignes = [
    `Structure : ${STRUCTURES[donnees.structure]}`,
    `Personnes concernées : ${EFFECTIFS[donnees.effectifs]}`,
    `Besoins : ${materiel}`,
    `Quantité : ${quantite}`,
    `Lieu : ${donnees.ville}, ${pays}`,
  ];
  return { sujet: sujet.slice(0, 180), message: assembler(lignes, donnees.precisions) };
}

function assembler(lignes: (string | null)[], precisions?: string) {
  const bloc = lignes.filter(Boolean).join("\n");
  return precisions ? `${bloc}\n\n${precisions}` : bloc;
}
