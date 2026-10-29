import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Apparitions } from "@/components/apparitions";
import { BoutonWhatsApp } from "@/components/whatsapp";
import { EffetsClic } from "@/components/effets-clic";
import { Intro, SCRIPT_INTRO } from "@/components/intro";
import { site } from "@/lib/site";
import { lireCoordonnees } from "@/lib/data";
import { jsonLdSur } from "@/lib/utils";
import { urlSite } from "@/lib/env";

/**
 * Layout des pages publiques : en-tête, contenu, pied de page.
 *
 * Le back-office (`/admin`) et la page de connexion ont leur propre layout et
 * ne chargent donc ni ce header ni ce footer.
 *
 * Le JSON-LD `Organization` est posé ici pour être présent sur toutes les
 * pages publiques du site, sans duplication.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const coordonnees = await lireCoordonnees();
  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.nom,
    alternateName: site.nomLong,
    url: urlSite,
    description: site.description,
    email: coordonnees.email,
    ...(coordonnees.telephone ? { telephone: coordonnees.telephone } : {}),
    address: {
      "@type": "PostalAddress",
      ...(coordonnees.rue ? { streetAddress: coordonnees.rue } : {}),
      addressLocality: coordonnees.ville,
      postalCode: coordonnees.codePostal,
      addressCountry: coordonnees.pays,
    },
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "République démocratique du Congo" },
      { "@type": "Country", name: "République du Congo" },
    ],
    knowsAbout: ["Réemploi de matériel informatique", "Équipement scolaire", "Mécénat de matériel"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Contact général",
      email: coordonnees.email,
      availableLanguage: ["fr"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Coordonnées saisies dans le back-office : `jsonLdSur` échappe les
        // `<` pour qu'un texte ne puisse pas fermer la balise.
        dangerouslySetInnerHTML={{ __html: jsonLdSur(donneesStructurees) }}
      />
      {/* Doit précéder l'écran d'ouverture : décide, avant le premier
          affichage, s'il se joue (première page de la visite). Contenu
          statique, aucune donnée injectée. */}
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_INTRO }} />
      <Intro />
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main id="contenu-principal" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <BoutonWhatsApp />
      <EffetsClic />
      <Apparitions />
    </>
  );
}
