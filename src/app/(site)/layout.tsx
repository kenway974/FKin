import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { site } from "@/lib/site";
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
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.nom,
    alternateName: site.nomLong,
    url: urlSite,
    description: site.description,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.adresse.ville,
      postalCode: site.adresse.codePostal,
      addressCountry: site.adresse.pays,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Île-de-France" },
      { "@type": "Country", name: "République démocratique du Congo" },
      { "@type": "Country", name: "République du Congo" },
    ],
    knowsAbout: ["Réemploi de matériel informatique", "Équipement scolaire", "Mécénat de matériel"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Contact général",
      email: site.email,
      availableLanguage: ["fr"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Contenu statique issu de `lib/site.ts` : aucune donnée utilisateur
        // n'est injectée ici, il n'y a donc pas de surface XSS.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
      />
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main id="contenu-principal" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
