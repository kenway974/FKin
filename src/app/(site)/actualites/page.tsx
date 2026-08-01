import type { Metadata } from "next";
import { EtatVide, Section } from "@/components/sections";
import { BannierePage } from "@/components/bannieres";
import { trouverPhotoBanniere } from "@/lib/visuels";
import { CarteArticle } from "@/components/carte-article";
import { listerArticlesPublies } from "@/lib/data";
import { urlSite } from "@/lib/env";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Comptes rendus de convois, retours de terrain et nouvelles des structures équipées au Congo.",
  alternates: { canonical: "/actualites" },
  openGraph: {
    title: "Actualités",
    description: "Comptes rendus de convois et retours de terrain.",
    url: `${urlSite}/actualites`,
  },
};

/** Le blog change peu : une revalidation horaire suffit et allège les requêtes. */
export const revalidate = 3600;

export default async function PageActualites() {
  const articles = await listerArticlesPublies();

  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Actualités — ${site.nom}`,
    url: `${urlSite}/actualites`,
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.titre,
      url: `${urlSite}/actualites/${article.slug}`,
      ...(article.date_publication ? { datePublished: article.date_publication } : {}),
      ...(article.extrait ? { description: article.extrait } : {}),
    })),
  };

  return (
    <>
      {articles.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
        />
      ) : null}

      <BannierePage
        surtitre="Actualités"
        titre="Nouvelles des convois et du terrain"
        chapo="Ce qui se passe entre deux livraisons : départ d'un conteneur, installation d'une salle, difficultés rencontrées."
        ton="terre"
        photo={trouverPhotoBanniere("actualites")}
      />

      <Section>
        <div className="contenu">
          {articles.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <li key={article.id}>
                  <CarteArticle article={article} priorite={index < 2} />
                </li>
              ))}
            </ul>
          ) : (
            <EtatVide titre="Aucun article publié pour le moment">
              <p>
                Les actualités s&apos;afficheront ici dès qu&apos;un article aura été publié depuis
                l&apos;espace d&apos;administration.
              </p>
            </EtatVide>
          )}
        </div>
      </Section>
    </>
  );
}
