import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listerArticlesPublies, trouverArticleParSlug } from "@/lib/data";
import { decouperParagraphes, extraireResume, formaterDate } from "@/lib/utils";
import { urlSite } from "@/lib/env";
import { site } from "@/lib/site";

type Proprietes = {
  // Depuis Next.js 15, `params` est une promesse dans les Server Components.
  params: Promise<{ slug: string }>;
};

/**
 * Pré-génère les pages des articles déjà publiés au moment du build.
 * Les articles publiés plus tard seront rendus à la demande puis mis en cache.
 */
export async function generateStaticParams() {
  const articles = await listerArticlesPublies();
  return articles.map((article) => ({ slug: article.slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Proprietes): Promise<Metadata> {
  const { slug } = await params;
  const article = await trouverArticleParSlug(slug);

  if (!article) {
    return { title: "Article introuvable", robots: { index: false, follow: false } };
  }

  const description = article.extrait?.trim() || extraireResume(article.contenu, 155);
  const url = `${urlSite}/actualites/${article.slug}`;

  return {
    title: article.titre,
    description,
    alternates: { canonical: `/actualites/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.titre,
      description,
      url,
      publishedTime: article.date_publication ?? undefined,
      images: article.image_couverture ? [{ url: article.image_couverture }] : undefined,
    },
    twitter: {
      card: article.image_couverture ? "summary_large_image" : "summary",
      title: article.titre,
      description,
    },
  };
}

export default async function PageArticle({ params }: Proprietes) {
  const { slug } = await params;
  const article = await trouverArticleParSlug(slug);

  // Slug inconnu ou article encore en brouillon : page 404, jamais de fuite.
  if (!article) notFound();

  const paragraphes = decouperParagraphes(article.contenu);
  const description = article.extrait?.trim() || extraireResume(article.contenu, 155);

  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.titre,
    description,
    url: `${urlSite}/actualites/${article.slug}`,
    ...(article.date_publication
      ? { datePublished: article.date_publication, dateModified: article.updated_at }
      : {}),
    ...(article.image_couverture ? { image: article.image_couverture } : {}),
    author: { "@type": "Organization", name: article.auteur || site.nom },
    publisher: { "@type": "Organization", name: site.nom, url: urlSite },
    mainEntityOfPage: `${urlSite}/actualites/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
      />

      <article className="pb-16">
        <header className="border-bordure bg-sable motif-tissu border-b py-12 md:py-16">
          <div className="contenu max-w-3xl">
            <Button asChild variante="lien" taille="sm" className="mb-4 px-0">
              <Link href="/actualites">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Toutes les actualités
              </Link>
            </Button>

            <h1 className="text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
              {article.titre}
            </h1>

            <p className="text-doux mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {article.date_publication ? (
                <time dateTime={article.date_publication}>
                  Publié le {formaterDate(article.date_publication)}
                </time>
              ) : null}
              {article.auteur ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{article.auteur}</span>
                </>
              ) : null}
            </p>
          </div>
        </header>

        {article.image_couverture ? (
          <div className="contenu -mt-8 max-w-4xl md:-mt-10">
            <div className="rounded-douce border-bordure bg-sable relative aspect-[16/9] w-full overflow-hidden border shadow-sm">
              <Image
                src={article.image_couverture}
                alt={article.image_alt ?? ""}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        ) : null}

        <div className="contenu mt-10 max-w-3xl">
          {article.extrait ? (
            <p className="border-terre text-encre mb-8 border-l-4 pl-4 text-lg leading-relaxed font-medium">
              {article.extrait}
            </p>
          ) : null}

          {/*
            Le contenu est stocké en texte brut et rendu paragraphe par
            paragraphe : aucun HTML n'est interprété, ce qui élimine toute
            possibilité d'injection depuis le back-office.
          */}
          <div className="text-encre/90 space-y-5 text-[1.05rem] leading-relaxed">
            {paragraphes.map((paragraphe, index) => (
              <p key={index}>{paragraphe}</p>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
