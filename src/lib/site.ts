/**
 * Métadonnées éditoriales du site, centralisées ici pour éviter de les
 * dupliquer entre le header, le footer, le JSON-LD et les balises SEO.
 *
 * Le nom et la description se modifient ici. Les coordonnées (e-mail,
 * téléphone, adresses) se modifient dans le back-office, onglet
 * « Coordonnées » : les valeurs ci-dessous ne servent plus que de repli tant
 * que la base est vide ou injoignable (voir `lib/coordonnees.ts`).
 */

export const site = {
  nom: "Respusse",
  nomLong: "Respusse — France & Congo",
  baseline: "Le matériel dont vous n'avez plus l'usage devient une salle de classe équipée.",
  description:
    "Nous collectons du matériel informatique, électrique et scolaire auprès des entreprises partout en France et le redistribuons à des écoles, mairies et associations, en France comme au Congo.",
  email: "respusse@gmail.com",
  // Numéro provisoire, à remplacer par la ligne réelle de la structure.
  telephone: "+33 1 00 00 00 00",
  adresse: {
    rue: "—",
    codePostal: "94240",
    ville: "L'Haÿ-les-Roses",
    pays: "FR",
  },
  /** Adresse postale de l'association à Kinshasa. */
  adresseRdc: "Avenue Soki n° 20, commune de Mont-Ngafula, Kinshasa",
  zones: [
    "France entière (collecte et distribution)",
    "Kinshasa et République du Congo (distribution)",
  ],
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
