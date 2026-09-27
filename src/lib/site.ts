/**
 * Métadonnées éditoriales du site, centralisées ici pour éviter de les
 * dupliquer entre le header, le footer, le JSON-LD et les balises SEO.
 *
 * Le propriétaire du site peut modifier ce seul fichier pour changer le nom de
 * la structure, ses coordonnées ou ses réseaux sociaux.
 */

export const site = {
  nom: "Respusse",
  nomLong: "Respusse — France ↔ Congo",
  baseline: "Le matériel dont vous n'avez plus l'usage devient une salle de classe équipée.",
  description:
    "Nous collectons du matériel informatique, électrique et scolaire auprès des entreprises partout en France et l'acheminons vers des écoles, mairies et associations au Congo.",
  email: "respusse@gmail.com",
  // Numéro provisoire, à remplacer par la ligne réelle de la structure.
  telephone: "+33 1 00 00 00 00",
  adresse: {
    rue: "—",
    codePostal: "94240",
    ville: "L'Haÿ-les-Roses",
    pays: "FR",
  },
  zones: ["France entière (collecte)", "Kinshasa et République du Congo (distribution)"],
} as const;

/** Navigation principale, réutilisée par le header, le footer et le sitemap. */
export const navigation = [
  { href: "/", libelle: "Accueil" },
  { href: "/services", libelle: "Nos services" },
  { href: "/realisations", libelle: "Réalisations" },
  { href: "/comment-ca-marche", libelle: "Comment ça marche" },
  { href: "/actualites", libelle: "Actualités" },
  { href: "/contact", libelle: "Contact" },
] as const;
