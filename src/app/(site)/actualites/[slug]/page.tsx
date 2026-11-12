import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { metadonneesPage } from "@/lib/seo";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listerArticlesPublies, trouverArticleParSlug } from "@/lib/data";
import { extraireResume, formaterDate, jsonLdSur } from "@/lib/utils";
import { texteBrut } from "@/lib/mise-en-forme";
import { ContenuArticle } from "@/components/contenu-article";
import { urlSite } from "@/lib/env";
import { site } from "@/lib/site";
import { BannierePage } from "@/components/bannieres";

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

  const description = article.extrait?.trim() || extraireResume(texteBrut(article.contenu), 155);
  const base = metadonneesPage({
    titre: article.titre,
    description,
    chemin: `/actualites/${article.slug}`,
    type: "article",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.date_publication ?? undefined,
      modifiedTime: article.updated_at,
      ...(article.image_couverture ? { images: [{ url: article.image_couverture }] } : {}),
    },
    twitter: {
      ...base.twitter,
      ...(article.image_couverture ? { images: [article.image_couverture] } : {}),
    },
  };
}

export default async function PageArticle({ params }: Proprietes) {
  const { slug } = await params;
  const article = await trouverArticleParSlug(slug);

  // Slug inconnu ou article encore en brouillon : page 404, jamais de fuite.
  if (!article) notFound();

  const description = article.extrait?.trim() || extraireResume(texteBrut(article.contenu), 155);

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
        dangerouslySetInnerHTML={{ __html: jsonLdSur(donneesStructurees) }}
      />

      <article className="pb-16">
        <BannierePage
          titre={article.titre}
          avant={
            <Button asChild variante="courbe-clair">
              <Link href="/actualites">
                <ArrowLeft aria-hidden="true" />
                Toutes les actualités
              </Link>
            </Button>
          }
        >
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
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
        </BannierePage>

        {article.image_couverture ? (
          <div className="contenu relative z-10 -mt-6 max-w-4xl md:-mt-10">
            <div className="bg-nuage forme-blob-3 relative aspect-[16/9] w-full overflow-hidden">
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
            <p className="border-rouge text-encre mb-8 border-l-4 pl-4 text-lg leading-relaxed font-medium">
              {article.extrait}
            </p>
          ) : null}

          {/*
            Texte saisi dans le back-office, mis en forme sans jamais
            interpréter de HTML (voir components/contenu-article.tsx).
          */}
          <ContenuArticle contenu={article.contenu} />
        </div>
      </article>
    </>
  );
}
