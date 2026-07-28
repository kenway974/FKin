import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EtatVide, Section, TitreSection } from "@/components/sections";
import { CarteProjet } from "@/components/carte-projet";
import { listerProjetsPublies } from "@/lib/data";
import { urlSite } from "@/lib/env";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Les projets menés à leur terme : lieu, matériel livré et résultat obtenu pour chaque école, mairie ou association équipée au Congo.",
  alternates: { canonical: "/realisations" },
  openGraph: {
    title: "Réalisations",
    description: "Les projets menés à leur terme, lieu par lieu, avec le résultat obtenu.",
    url: `${urlSite}/realisations`,
  },
};

/**
 * Revalidation toutes les heures : la galerie est alimentée par la base, mais
 * elle change rarement. Servir une page mise en cache réduit fortement le
 * temps de réponse pour les visiteurs sur connexion lente.
 */
export const revalidate = 3600;

export default async function PageRealisations() {
  const projets = await listerProjetsPublies();

  // JSON-LD : la galerie est décrite comme une liste ordonnée d'éléments, ce
  // qui aide les moteurs à comprendre qu'il s'agit d'un portfolio de projets.
  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Réalisations — ${site.nom}`,
    url: `${urlSite}/realisations`,
    hasPart: projets.map((projet) => ({
      "@type": "CreativeWork",
      name: projet.titre,
      description: projet.description,
      locationCreated: projet.lieu,
      ...(projet.date_projet ? { dateCreated: projet.date_projet } : {}),
    })),
  };

  return (
    <>
      {projets.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
        />
      ) : null}

      <Section fond="sable">
        <div className="contenu">
          <TitreSection
            niveau={1}
            surtitre="Réalisations"
            titre="Ce que le matériel est devenu"
            chapo="Chaque fiche indique où le matériel est arrivé, de quoi il s'agissait et ce qu'il a concrètement permis de faire. C'est la partie la plus utile de ce site : elle vous permet de vérifier que la démarche va au bout."
          />
        </div>
      </Section>

      <Section>
        <div className="contenu">
          {projets.length > 0 ? (
            <>
              <p className="text-doux mb-6 text-sm">
                {projets.length} projet{projets.length > 1 ? "s" : ""} documenté
                {projets.length > 1 ? "s" : ""}.
              </p>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projets.map((projet, index) => (
                  <li key={projet.id}>
                    <CarteProjet projet={projet} priorite={index < 2} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EtatVide titre="Aucun projet publié pour le moment">
              <p>
                Les réalisations apparaîtront ici dès qu&apos;elles auront été ajoutées depuis
                l&apos;espace d&apos;administration.
              </p>
            </EtatVide>
          )}

          <div className="rounded-douce border-bordure bg-sable mt-12 border p-6 md:p-8">
            <h2 className="font-titre text-2xl font-bold">
              Votre entreprise peut être le point de départ du prochain projet
            </h2>
            <p className="text-doux mt-3 max-w-2xl">
              La plupart de ces installations partent d&apos;un simple message : une entreprise qui
              signale un lot de postes à remplacer. Décrivez-nous le vôtre, nous vous disons
              rapidement ce que nous pouvons en faire.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact?profil=entreprise">
                Proposer un don
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
