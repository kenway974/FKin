import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChiffreCle, EtatVide, Section, TitreSection } from "@/components/sections";
import { BanniereAccueil, RubanDefilant } from "@/components/bannieres";
import { VoyageDefilant } from "@/components/voyage-defilant";
import { Coeur, Vague } from "@/components/formes";
import { CarteProjet } from "@/components/carte-projet";
import { CarteArticle } from "@/components/carte-article";
import { compterPourAccueil, listerArticlesPublies, listerProjetsPublies } from "@/lib/data";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Donnez une seconde vie à votre matériel",
  description:
    "Nous collectons le matériel informatique, électrique et scolaire des entreprises partout en France et le redistribuons à des écoles et associations, en France comme au Congo. Traçabilité, reçus, comptes rendus d'usage.",
  alternates: { canonical: "/" },
};

/**
 * Vitesses de parallaxe des éléments d'une même rangée : chaque colonne glisse
 * un peu plus que la précédente, ce qui décale doucement les cartes au
 * défilement et donne de la profondeur à la grille. Sur téléphone, où les
 * cartes sont empilées, la vitesse est la même pour toutes : des vitesses
 * différentes les feraient se chevaucher.
 */
const vitesses = [
  "[--parallaxe:1rem] md:[--parallaxe:0.75rem]",
  "[--parallaxe:1rem] md:[--parallaxe:2rem]",
  "[--parallaxe:1rem] md:[--parallaxe:3.25rem]",
] as const;

export default async function PageAccueil() {
  // Requêtes indépendantes : lancées en parallèle pour ne pas additionner les
  // temps d'attente sur une connexion lente.
  const [projets, articles, statistiques] = await Promise.all([
    listerProjetsPublies(3),
    listerArticlesPublies(3),
    compterPourAccueil(),
  ]);

  return (
    <>
      {/* ------------------------------------------------------------- Bannière */}
      <BanniereAccueil
        sujet={
          <Image
            src="/heros/enfants.webp"
            alt="Trois écoliers en survêtement bleu, souriants, font coucou"
            width={1177}
            height={1696}
            priority
            sizes="(min-width: 1024px) 40vw, 70vw"
            className="h-full w-auto max-w-none drop-shadow-[0_24px_40px_rgba(17,29,54,0.45)]"
          />
        }
      >
        {/* Ce que fait l'association, en deux pastilles : où l'on récupère,
            où l'on distribue. Le détail vient plus bas dans la page. */}
        <ul className="anim-entree mb-5 flex flex-wrap gap-2 text-[0.8rem] font-bold sm:mb-6 sm:text-sm">
          <li className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pr-3.5 pl-2 ring-1 ring-white/15 backdrop-blur-sm">
            <span className="bg-bleu-vif inline-block size-3 rounded-full" aria-hidden="true" />
            Récupération partout en France
          </li>
          <li className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pr-3.5 pl-2 ring-1 ring-white/15 backdrop-blur-sm">
            <span className="bg-rouge-vif inline-block size-3 rounded-full" aria-hidden="true" />
            Distribution en France et au Congo
          </li>
        </ul>

        <h1 className="anim-entree anim-retard-1 text-[clamp(2.5rem,9vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.02em] text-balance lg:text-[clamp(3.5rem,4.8vw,5.75rem)]">
          Ce qui dort chez vous <span className="text-rouge-clair">fait école</span> ailleurs.
        </h1>

        <div className="anim-entree anim-retard-2 mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-10">
          <Button asChild taille="lg">
            <Link href="/contact?profil=entreprise">
              Proposer un don
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variante="courbe-clair" className="text-base">
            <Link href="/contact?profil=beneficiaire">Besoin de matériel ?</Link>
          </Button>
        </div>
      </BanniereAccueil>

      {/* ---------------------------------------------------------------- Ruban */}
      <RubanDefilant
        mentions={[
          "Enlèvement gratuit partout en France",
          "Effacement certifié des disques",
          "Inventaire et attestation de don",
          "Distribution en France et au Congo",
          "Installation par nos relais locaux",
          "Compte rendu d'usage à 6 mois",
        ]}
      />

      {/* ----------------------------------------------------- Le voyage d'un don */}
      <VoyageDefilant />

      {/* ------------------------------------------------------------- Chiffres */}
      {/* Masquée tant qu'aucun projet n'est publié : mieux vaut pas de section
          du tout qu'une rangée de zéros. */}
      {statistiques.projets > 0 ? (
        <Section fond="nuage">
          <div className="contenu">
            <TitreSection
              surtitre="Notre action en bref"
              titre="Une démarche mesurée, pas une promesse"
              chapo="Chaque chiffre correspond à des livraisons documentées et signées sur le terrain."
            />
            {/*
            Ces chiffres sont calculés à partir de la base, jamais saisis en dur.
            Une page qui affiche des statistiques inventées ruinerait exactement
            la crédibilité que ce site cherche à établir : ici, chaque nombre
            correspond à une fiche réellement publiée dans le back-office et
            vérifiable en un clic depuis la page Réalisations.

            Le « 100 % documentées » n'est pas une promesse commerciale : la
            colonne `resultat` est obligatoire en base, aucune fiche ne peut
            donc exister sans son compte rendu d'usage.
          */}
            <div className="anim-defilement mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ChiffreCle
                valeur={String(statistiques.projets)}
                libelle={statistiques.projets > 1 ? "projets menés à terme" : "projet mené à terme"}
                precision="Chacun détaillé dans nos réalisations"
              />
              <ChiffreCle
                valeur={String(statistiques.lieux)}
                libelle={statistiques.lieux > 1 ? "lieux équipés" : "lieu équipé"}
                precision="Écoles, mairies, associations"
              />
              <ChiffreCle
                valeur={String(statistiques.articles)}
                libelle="comptes rendus publiés"
                precision="Livraisons, installations, retours de terrain"
              />
              <ChiffreCle
                valeur="100 %"
                libelle="des projets documentés"
                precision="Lieu, matériel livré et résultat obtenu"
              />
            </div>
          </div>
        </Section>
      ) : null}

      {/* -------------------------------------- Au-delà de la distribution (Congo) */}
      <section className="relative isolate">
        <Vague className="text-marine" retourne />
        <div className="bg-marine relative overflow-hidden py-14 text-white md:py-20">
          <Coeur className="text-bleu-vif -right-16 -bottom-20 w-80 opacity-10 md:w-[26rem]" />
          <div className="contenu relative">
            <p className="text-rouge-clair mb-3 inline-flex items-center gap-2 text-sm font-extrabold tracking-[0.14em] uppercase">
              <span
                className="bg-rouge-clair inline-block h-2 w-6 rounded-full"
                aria-hidden="true"
              />
              Au Congo, au-delà de la distribution
            </p>
            <h2 className="max-w-3xl text-3xl font-bold md:text-5xl">
              Réparer, transmettre, former
            </h2>

            <div className="anim-defilement mt-10 grid gap-6 md:grid-cols-2">
              <div className="forme-coeur parallaxe-vue bg-white/[0.07] p-7 ring-1 ring-white/15 [--parallaxe:0.75rem] md:p-9">
                <Recycle className="text-bleu-clair size-8" aria-hidden="true" />
                <h3 className="mt-4 text-2xl font-semibold">La réparation par les jeunes</h3>
                <p className="mt-3 leading-relaxed text-white/80">
                  Le matériel endommagé part en recyclerie à Kinshasa, où des jeunes apprennent à le
                  remettre en état.
                </p>
                <Button asChild variante="courbe-clair" className="mt-6">
                  <Link href="/services#reparation">
                    Comment ça fonctionne
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="forme-coeur-inverse parallaxe-vue bg-white/[0.07] p-7 ring-1 ring-white/15 [--parallaxe:2.5rem] md:p-9">
                <span className="bg-rouge-vif inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold tracking-wide uppercase">
                  Bientôt
                </span>
                <h3 className="mt-4 text-2xl font-semibold">Un centre de formation</h3>
                <p className="mt-3 leading-relaxed text-white/80">
                  Un centre de formation aux métiers de l&apos;informatique voit le jour à Kinshasa.
                </p>
                <Button asChild variante="courbe-clair" className="mt-6">
                  <Link href="/services#formation">
                    Découvrir le projet
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Vague className="text-marine" />
      </section>

      {/* ---------------------------------------------------------- Réalisations */}
      <Section aria-labelledby="titre-realisations">
        <div className="contenu">
          <TitreSection
            id="titre-realisations"
            surtitre="Sur le terrain"
            titre="Nos dernières réalisations"
            chapo="Chaque projet indique le lieu, le matériel livré et ce qu'il a permis de faire."
          />

          {projets.length > 0 ? (
            <ul className="anim-defilement mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projets.map((projet, index) => (
                <li key={projet.id} className={cn("parallaxe-vue", vitesses[index % 3])}>
                  <CarteProjet projet={projet} priorite={index === 0} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <EtatVide titre="Les réalisations arrivent bientôt">
                <p>
                  Les projets s&apos;afficheront ici dès qu&apos;ils auront été ajoutés depuis
                  l&apos;espace d&apos;administration.
                </p>
              </EtatVide>
            </div>
          )}

          {projets.length > 0 ? (
            <div className="mt-10">
              <Button asChild variante="courbe">
                <Link href="/realisations">
                  Toutes les réalisations
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </Section>

      {/* ------------------------------------------------------------ Actualités */}
      {articles.length > 0 ? (
        <Section fond="nuage" aria-labelledby="titre-actualites">
          <div className="contenu">
            <TitreSection
              id="titre-actualites"
              surtitre="Actualités"
              titre="Ce que nous racontons de nos convois"
            />
            <ul className="anim-defilement mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <li key={article.id} className={cn("parallaxe-vue", vitesses[index % 3])}>
                  <CarteArticle article={article} />
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button asChild variante="courbe">
                <Link href="/actualites">
                  Toutes les actualités
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------- Deux portes d'entrée (CTA) */}
      {/* Les deux publics, côte à côte, chacun avec sa couleur et son action :
          c'est la dernière chose vue avant le pied de page. */}
      <section aria-label="Nous contacter" className="contenu py-14 md:py-20">
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <div className="forme-coeur from-rouge-vif to-rouge-fonce parallaxe-vue relative isolate overflow-hidden bg-linear-to-br p-8 text-white [--parallaxe:1rem] md:p-12 md:[--parallaxe:0.75rem]">
            <Coeur className="-right-12 -bottom-14 -z-10 w-60 text-white/10 md:w-72" />
            <p className="text-sm font-extrabold tracking-[0.14em] text-white/80 uppercase">
              Donateurs
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Du matériel qui dort chez vous ?
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-white/90">
              Entreprises, collectivités : décrivez-nous le lot, nous répondons sous 72 heures et
              venons le chercher gratuitement.
            </p>
            <Button asChild taille="lg" variante="clair" className="mt-8">
              <Link href="/contact?profil=entreprise">
                Proposer un don
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="forme-coeur-inverse from-bleu-vif to-bleu-fonce parallaxe-vue relative isolate overflow-hidden bg-linear-to-br p-8 text-white [--parallaxe:1rem] md:p-12 md:[--parallaxe:2.25rem]">
            <Coeur className="-right-12 -bottom-14 -z-10 w-60 text-white/10 md:w-72" />
            <p className="text-sm font-extrabold tracking-[0.14em] text-white/80 uppercase">
              Bénéficiaires
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Besoin d&apos;équipement ?</h2>
            <p className="mt-3 max-w-md leading-relaxed text-white/90">
              Écoles, mairies, associations, en France ou au Congo : présentez votre structure et
              vos besoins.
            </p>
            <Button asChild taille="lg" variante="clair" className="mt-8">
              <Link href="/contact?profil=beneficiaire">
                Demander un équipement
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="text-doux mt-8 text-center text-sm">
          Ou écrivez-nous directement à{" "}
          <a href={`mailto:${site.email}`} className="text-encre font-bold underline">
            {site.email}
          </a>
        </p>
      </section>
    </>
  );
}
