import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, GraduationCap, PackageCheck, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitre } from "@/components/ui/card";
import { ChiffreCle, EtatVide, Section, TitreSection } from "@/components/sections";
import { CarteProjet } from "@/components/carte-projet";
import { CarteArticle } from "@/components/carte-article";
import { listerArticlesPublies, listerProjetsPublies } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donnez une seconde vie à votre matériel",
  description:
    "Nous collectons le matériel informatique, électrique et scolaire des entreprises d'Île-de-France et l'acheminons vers des écoles et associations au Congo. Traçabilité, reçus, comptes rendus d'usage.",
  alternates: { canonical: "/" },
};

/**
 * Les trois temps du parcours d'un don. Repris (en version détaillée) sur la
 * page « Comment ça marche » — la source de vérité éditoriale reste ici.
 */
const etapes = [
  {
    icone: Truck,
    titre: "1. Collecte en Île-de-France",
    texte:
      "Vous nous signalez le matériel dont votre entreprise se sépare. Nous évaluons ce qui est réemployable, planifions l'enlèvement sur site et repartons avec un inventaire signé.",
  },
  {
    icone: Ship,
    titre: "2. Préparation et acheminement",
    texte:
      "Le matériel est testé, nettoyé, les disques sont effacés puis les lots sont palettisés et expédiés par conteneur vers Kinshasa, où un partenaire local prend le relais au dédouanement.",
  },
  {
    icone: GraduationCap,
    titre: "3. Mise en service au Congo",
    texte:
      "Les équipements sont installés dans des écoles, mairies et associations identifiées à l'avance. Chaque livraison donne lieu à des photos et à un compte rendu d'usage qui vous est transmis.",
  },
] as const;

export default async function PageAccueil() {
  // Deux requêtes indépendantes : lancées en parallèle pour ne pas additionner
  // les temps d'attente sur une connexion lente.
  const [projets, articles] = await Promise.all([
    listerProjetsPublies(3),
    listerArticlesPublies(3),
  ]);

  return (
    <>
      {/* ---------------------------------------------------------------- Héros */}
      <section className="border-bordure bg-sable motif-tissu border-b">
        <div className="contenu grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div>
            <p className="bg-terre-voile text-terre-fonce mb-3 inline-flex rounded-full px-3 py-1 text-sm font-bold">
              Collecte en Île-de-France · Distribution au Congo
            </p>
            <h1 className="text-4xl leading-[1.1] font-bold md:text-5xl lg:text-6xl">
              Le matériel dont vous n&apos;avez plus l&apos;usage devient une salle de classe
              équipée.
            </h1>
            <p className="text-doux mt-5 max-w-xl text-lg leading-relaxed">
              Nous accompagnons les entreprises franciliennes qui renouvellent leur parc
              informatique, électrique ou mobilier, et nous acheminons ce matériel jusqu&apos;à des
              écoles, mairies et associations au Congo. De l&apos;enlèvement au compte rendu
              d&apos;usage, chaque étape est tracée.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild taille="lg">
                <Link href="/contact?profil=entreprise">
                  Proposer un don
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild taille="lg" variante="contour">
                <Link href="/realisations">Voir nos réalisations</Link>
              </Button>
            </div>
          </div>

          {/* Composition décorative : trois « cartes » évoquant le trajet du don. */}
          <div aria-hidden="true" className="hidden md:block">
            <div className="relative mx-auto max-w-sm">
              <div className="rounded-douce border-bordure border bg-white p-5 shadow-sm">
                <Building2 className="text-terre size-7" />
                <p className="mt-2 font-semibold">Une entreprise francilienne</p>
                <p className="text-doux text-sm">40 postes de travail renouvelés</p>
              </div>
              <div className="border-ocre mx-6 my-3 h-8 border-l-2 border-dashed" />
              <div className="rounded-douce border-bordure border bg-white p-5 shadow-sm">
                <PackageCheck className="text-ocre size-7" />
                <p className="mt-2 font-semibold">Testé, effacé, palettisé</p>
                <p className="text-doux text-sm">Inventaire et attestation remis</p>
              </div>
              <div className="border-ocre mx-6 my-3 h-8 border-l-2 border-dashed" />
              <div className="rounded-douce border-vert/30 bg-vert-voile border p-5 shadow-sm">
                <GraduationCap className="text-vert size-7" />
                <p className="text-vert-fonce mt-2 font-semibold">Une salle informatique</p>
                <p className="text-vert-fonce/85 text-sm">Un lycée de Kinshasa, 180 élèves</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Chiffres */}
      <Section>
        <div className="contenu">
          <TitreSection
            surtitre="Notre action en bref"
            titre="Une démarche mesurée, pas une promesse"
            chapo="Nous publions ce que nous constatons sur le terrain. Chaque chiffre correspond à des livraisons documentées, photographiées et signées par les structures bénéficiaires."
          />
          {/*
            TODO (propriétaire du site) : remplacer ces quatre chiffres par vos
            données réelles avant la mise en ligne. Ils sont volontairement
            modestes et vérifiables plutôt que spectaculaires.
          */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ChiffreCle valeur="1 200+" libelle="équipements collectés" precision="Depuis 2021" />
            <ChiffreCle
              valeur="18"
              libelle="structures équipées"
              precision="Écoles, mairies, associations"
            />
            <ChiffreCle valeur="9" libelle="entreprises partenaires" precision="En Île-de-France" />
            <ChiffreCle
              valeur="100 %"
              libelle="des livraisons documentées"
              precision="Photos et compte rendu"
            />
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- Les 3 temps */}
      <Section fond="sable" aria-labelledby="titre-parcours">
        <div className="contenu">
          <TitreSection
            id="titre-parcours"
            surtitre="Comment ça fonctionne"
            titre="Trois temps, de votre local à une salle de classe"
            chapo="Vous n'avez rien à organiser : nous prenons en charge l'ensemble du parcours et vous rendons compte de ce qui a été fait du matériel."
          />

          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {etapes.map((etape) => (
              <li key={etape.titre}>
                <Card className="h-full">
                  <CardBody className="space-y-3">
                    <span className="bg-terre-voile inline-flex size-12 items-center justify-center rounded-full">
                      <etape.icone className="text-terre size-6" aria-hidden="true" />
                    </span>
                    <CardTitre>{etape.titre}</CardTitre>
                    <p className="text-doux text-sm leading-relaxed">{etape.texte}</p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Button asChild variante="contour">
              <Link href="/comment-ca-marche">
                Le parcours détaillé d&apos;un don
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- Deux audiences */}
      <Section>
        <div className="contenu">
          <TitreSection
            surtitre="À qui nous nous adressons"
            titre="Deux interlocuteurs, deux besoins"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Card>
              <CardBody className="space-y-3">
                <Building2 className="text-terre size-8" aria-hidden="true" />
                <CardTitre>Vous êtes une entreprise d&apos;Île-de-France</CardTitre>
                <p className="text-doux text-sm leading-relaxed">
                  Vous renouvelez votre parc et cherchez une alternative à la benne. Nous organisons
                  l&apos;enlèvement, garantissons l&apos;effacement des données et vous remettons un
                  inventaire ainsi qu&apos;un compte rendu d&apos;usage exploitable dans votre
                  rapport RSE.
                </p>
                <Button asChild variante="lien" className="px-0">
                  <Link href="/services#entreprises">
                    Ce que nous proposons aux entreprises
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-3">
                <GraduationCap className="text-vert size-8" aria-hidden="true" />
                <CardTitre>Vous êtes une structure au Congo</CardTitre>
                <p className="text-doux text-sm leading-relaxed">
                  École, mairie ou association : vous pouvez nous adresser une demande
                  d&apos;équipement. Nous examinons chaque dossier avec nos relais locaux, en
                  fonction du matériel disponible et de votre capacité à l&apos;accueillir
                  (électricité, local, personne référente).
                </p>
                <Button asChild variante="lien" className="px-0">
                  <Link href="/services#beneficiaires">
                    Ce que nous proposons aux bénéficiaires
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- Réalisations */}
      <Section fond="sable" aria-labelledby="titre-realisations">
        <div className="contenu">
          <TitreSection
            id="titre-realisations"
            surtitre="Sur le terrain"
            titre="Nos dernières réalisations"
            chapo="Chaque projet indique le lieu, le matériel livré et ce qu'il a permis de faire."
          />

          {projets.length > 0 ? (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projets.map((projet, index) => (
                <li key={projet.id}>
                  <CarteProjet projet={projet} priorite={index === 0} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8">
              <EtatVide titre="Les réalisations arrivent bientôt">
                <p>
                  Les projets s&apos;afficheront ici dès qu&apos;ils auront été ajoutés depuis
                  l&apos;espace d&apos;administration.
                </p>
              </EtatVide>
            </div>
          )}

          {projets.length > 0 ? (
            <div className="mt-8">
              <Button asChild variante="contour">
                <Link href="/realisations">
                  Toutes les réalisations
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </Section>

      {/* ------------------------------------------------------------ Actualités */}
      {articles.length > 0 ? (
        <Section aria-labelledby="titre-actualites">
          <div className="contenu">
            <TitreSection
              id="titre-actualites"
              surtitre="Actualités"
              titre="Ce que nous racontons de nos convois"
            />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.id}>
                  <CarteArticle article={article} />
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild variante="contour">
                <Link href="/actualites">
                  Toutes les actualités
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------------------------- CTA final */}
      <section className="bg-vert py-16 md:py-20">
        <div className="contenu max-w-3xl text-center">
          <h2 className="font-titre text-3xl font-bold text-white md:text-4xl">
            Un local à vider ? Parlons-en avant la benne.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            Décrivez-nous en quelques lignes le matériel concerné et son volume. Nous revenons vers
            vous sous 72 heures avec une réponse claire : ce que nous pouvons prendre, ce que nous
            ne pouvons pas, et sous quel délai.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild taille="lg" className="text-vert-fonce bg-white hover:bg-white/90">
              <Link href="/contact?profil=entreprise">Proposer un don de matériel</Link>
            </Button>
            <Button
              asChild
              taille="lg"
              variante="contour"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/contact?profil=beneficiaire">Demander un équipement</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/75">
            Ou écrivez-nous directement à{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-white underline">
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
