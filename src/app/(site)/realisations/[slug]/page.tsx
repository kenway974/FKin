import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, MapPin, Package } from "lucide-react";
import { metadonneesPage } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { BannierePage } from "@/components/bannieres";
import { VisuelParDefaut } from "@/components/sections";
import { FilArianeJsonLd } from "@/components/fil-ariane";
import { listerProjetsPublies, trouverProjetParSlug } from "@/lib/data";
import { extraireResume, formaterDate, jsonLdSur } from "@/lib/utils";
import { urlSite } from "@/lib/env";
import { site } from "@/lib/site";

type Proprietes = {
  params: Promise<{ slug: string }>;
};

/** Pré-génère les fiches des projets déjà publiés au moment du build. */
export async function generateStaticParams() {
  const projets = await listerProjetsPublies();
  return projets.map((projet) => ({ slug: projet.slug }));
}

export const revalidate = 3600;

/** Titre d'onglet : le projet et son lieu, pour qu'il se suffise dans Google. */
function titreProjet(projet: { titre: string; lieu: string }) {
  return projet.titre.toLowerCase().includes(projet.lieu.toLowerCase())
    ? projet.titre
    : `${projet.titre} (${projet.lieu})`;
}

export async function generateMetadata({ params }: Proprietes): Promise<Metadata> {
  const { slug } = await params;
  const projet = await trouverProjetParSlug(slug);

  if (!projet) {
    return { title: "Réalisation introuvable", robots: { index: false, follow: false } };
  }

  const base = metadonneesPage({
    titre: titreProjet(projet),
    description: extraireResume(`${projet.description} ${projet.resultat}`, 155),
    chemin: `/realisations/${projet.slug}`,
  });

  if (!projet.image_url) return base;
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [{ url: projet.image_url }] },
    twitter: { ...base.twitter, images: [projet.image_url] },
  };
}

export default async function PageProjet({ params }: Proprietes) {
  const { slug } = await params;
  const projet = await trouverProjetParSlug(slug);

  // Slug inconnu ou projet dépublié : page 404.
  if (!projet) notFound();

  const url = `${urlSite}/realisations/${projet.slug}`;
  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: projet.titre,
    description: projet.description,
    url,
    locationCreated: { "@type": "Place", name: projet.lieu },
    ...(projet.date_projet ? { dateCreated: projet.date_projet } : {}),
    ...(projet.image_url ? { image: projet.image_url } : {}),
    creator: { "@type": "Organization", name: site.nom, url: urlSite },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSur(donneesStructurees) }}
      />
      <FilArianeJsonLd
        etapes={[
          { nom: "Réalisations", chemin: "/realisations" },
          { nom: projet.titre, chemin: `/realisations/${projet.slug}` },
        ]}
      />

      <article className="pb-16">
        <BannierePage
          titre={projet.titre}
          ton="bleu"
          avant={
            <Button asChild variante="courbe-clair">
              <Link href="/realisations">
                <ArrowLeft aria-hidden="true" />
                Toutes les réalisations
              </Link>
            </Button>
          }
        >
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {projet.lieu}
            </span>
            {projet.date_projet ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                <time dateTime={projet.date_projet}>{formaterDate(projet.date_projet)}</time>
              </span>
            ) : null}
          </p>
        </BannierePage>

        <div className="contenu relative z-10 -mt-6 max-w-4xl md:-mt-10">
          {projet.image_url ? (
            <div className="bg-nuage forme-blob-3 relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={projet.image_url}
                alt={projet.image_alt ?? `Photographie du projet : ${projet.titre}`}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <VisuelParDefaut
              className="forme-blob-3"
              legende={`Photographie à venir pour le projet ${projet.titre}`}
            />
          )}
        </div>

        <div className="contenu mt-10 max-w-3xl space-y-8">
          <p className="text-encre text-lg leading-relaxed whitespace-pre-line">
            {projet.description}
          </p>

          <dl className="space-y-5">
            <div>
              <dt className="text-encre flex items-center gap-2 font-semibold">
                <Package className="text-rouge size-5" aria-hidden="true" />
                Matériel livré
              </dt>
              <dd className="text-doux mt-1">{projet.type_materiel}</dd>
            </div>
            <div className="border-bleu-vif border-l-4 pl-4">
              <dt className="text-bleu-fonce font-semibold">Résultat obtenu</dt>
              <dd className="text-bleu-fonce/90 mt-1 whitespace-pre-line">{projet.resultat}</dd>
            </div>
          </dl>
        </div>
      </article>
    </>
  );
}
