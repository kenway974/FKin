import type { ChampsContact } from "@/lib/validation/contact";

type Profil = NonNullable<ChampsContact["typeEmetteur"]>;

/**
 * Tous les libellés du formulaire de contact qui changent selon le profil,
 * au même endroit : les étapes n'ont plus de conditions de texte à gérer.
 */
export const TEXTES: Record<
  Profil,
  {
    etapes: string[];
    questions: string[];
    materiel: string;
    quantite: string;
    photos: string;
    aidePhotos: string;
    ville: string;
    exempleVille: string;
    organisation: string;
    usageTelephone: string;
    envoyer: string;
    recapMateriel: string;
    recapLieu: string;
  }
> = {
  entreprise: {
    etapes: ["Vous", "Le matériel", "L'enlèvement", "Vos coordonnées"],
    questions: [
      "Qui êtes-vous ?",
      "Quel matériel souhaitez-vous donner ?",
      "Où et quand venir le chercher ?",
      "Comment vous joindre ?",
    ],
    materiel: "Type de matériel",
    quantite: "Nombre d'appareils, à peu près",
    photos: "Photos du lot",
    aidePhotos: "Deux ou trois photos suffisent pour évaluer le lot plus vite. 5 au maximum.",
    ville: "Ville de l'enlèvement",
    exempleVille: "Ex. : Lyon",
    organisation: "Entreprise",
    usageTelephone: "organiser l'enlèvement",
    envoyer: "Envoyer ma proposition",
    recapMateriel: "Matériel",
    recapLieu: "Enlèvement",
  },
  beneficiaire: {
    etapes: ["Vous", "Vos besoins", "Le lieu", "Vos coordonnées"],
    questions: [
      "Qui êtes-vous ?",
      "De quoi avez-vous besoin ?",
      "Où se trouve votre structure ?",
      "Comment vous joindre ?",
    ],
    materiel: "Matériel recherché",
    quantite: "Quantité souhaitée",
    photos: "Photos de votre local",
    aidePhotos:
      "La salle qui accueillera le matériel nous aide à préparer le bon lot. 5 au maximum.",
    ville: "Ville",
    exempleVille: "Ex. : Kinshasa",
    organisation: "Nom de la structure",
    usageTelephone: "vous rappeler",
    envoyer: "Envoyer ma demande",
    recapMateriel: "Besoins",
    recapLieu: "Lieu",
  },
};
