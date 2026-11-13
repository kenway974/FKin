import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { jsonLdSur } from "@/lib/utils";
import { EtatVide, Section } from "@/components/sections";
import { BannierePage } from "@/components/bannieres";
import { DeuxPortes } from "@/components/deux-portes";
import { trouverPhotoBanniere } from "@/lib/visuels";
import { CarteArticle } from "@/components/carte-article";
import { ListeActualites } from "@/components/liste-actualites";
import { listerArticlesPublies } from "@/lib/data";
import { urlSite } from "@/lib/env";
import { site } from "@/lib/site";

export const metadata: Metadata = metadonneesPage({
  titre: "Actualités",
  description:
    "Comptes rendus de convois, retours de terrain et nouvelles des structures équipées en France et au Congo.",
  chemin: "/actualites",
});

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
          dangerouslySetInnerHTML={{ __html: jsonLdSur(donneesStructurees) }}
        />
      ) : null}

      <BannierePage
        surtitre="Actualités"
        titre="Nouvelles des convois et du terrain"
        chapo="Ce qui se passe entre deux livraisons : livraison d'un lot, départ d'un conteneur, installation d'une salle, difficultés rencontrées."
        ton="rouge"
        photo={trouverPhotoBanniere("actualites")}
      />

      <Section>
        <div className="contenu">
          {articles.length > 0 ? (
            <ListeActualites
              elements={articles.map((article) => ({
                cle: article.id,
                titre: article.titre,
                extrait: article.extrait,
                categorie: article.categorie,
              }))}
              cartes={articles.map((article, index) => (
                <CarteArticle key={article.id} article={article} priorite={index < 2} compacte />
              ))}
            />
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

      <DeuxPortes />
    </>
  );
}
