import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { site } from "@/lib/site";
import { urlSite } from "@/lib/env";

/**
 * Layout racine.
 *
 * Choix typographique assumé : aucune police web n'est téléchargée. La pile
 * système est déjà présente sur l'appareil du visiteur, ce qui supprime 2 à 3
 * requêtes bloquantes et tout scintillement au chargement — un gain net sur
 * les connexions lentes, qui sont une contrainte explicite du projet. Pour
 * basculer sur une police web, voir la section « Personnalisation » du README.
 */

export const metadata: Metadata = {
  metadataBase: new URL(urlSite),
  title: {
    default: `${site.nom} — Dons de matériel, France ↔ Congo`,
    template: `%s · ${site.nom}`,
  },
  description: site.description,
  applicationName: site.nom,
  keywords: [
    "don de matériel informatique",
    "mécénat de matériel",
    "collecte matériel entreprise France",
    "écoles Kinshasa",
    "solidarité Congo",
    "réemploi informatique",
  ],
  authors: [{ name: site.nom }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: urlSite,
    siteName: site.nom,
    title: `${site.nom} — Dons de matériel, France ↔ Congo`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.nom,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fdfaf6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh">
        {/* Lien d'évitement : premier élément focalisable de la page. */}
        <a
          href="#contenu-principal"
          className="rounded-douce bg-terre sr-only px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
