import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, GraduationCap, Recycle, School, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitre } from "@/components/ui/card";
import { ChiffreCle, EtatVide, Section, TitreSection } from "@/components/sections";
import { BandeauAccent, BanniereAccueil, RubanDefilant } from "@/components/bannieres";
import { Coeur, Vague } from "@/components/formes";
import { VideoDetouree } from "@/components/video-detouree";
import { CarteProjet } from "@/components/carte-projet";
import { CarteArticle } from "@/components/carte-article";
import { compterPourAccueil, listerArticlesPublies, listerProjetsPublies } from "@/lib/data";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Donnez une seconde vie à votre matériel",
  description:
    "Nous collectons le matériel informatique, électrique et scolaire des entreprises partout en France et l'acheminons vers des écoles et associations au Congo. Traçabilité, reçus, comptes rendus d'usage.",
  alternates: { canonical: "/" },
};

/**
 * Les trois temps du parcours d'un don. Repris (en version détaillée) sur la
 * page « Comment ça marche » — la source de vérité éditoriale reste ici.
 *
 * Les couleurs alternent bleu, rouge, marine : les trois teintes du logo,
 * dans l'ordre où l'œil les lit sur le cœur.
 */
const etapes = [
  {
    icone: Truck,
    ton: "bleu" as const,
    titre: "Collecte partout en France",
    texte: "Enlèvement sur votre site, inventaire signé.",
  },
  {
    icone: Ship,
    ton: "rouge" as const,
    titre: "Préparation et acheminement",
    texte: "Matériel testé, données effacées, conteneur vers Kinshasa.",
  },
  {
    icone: School,
    ton: "marine" as const,
    titre: "Mise en service au Congo",
    texte: "Installation en école ou mairie, compte rendu d'usage.",
  },
] as const;

/** Classes des pastilles numérotées, par ton. */
const pastilles = {
  bleu: "bg-bleu-vif text-white",
  rouge: "bg-rouge-vif text-white",
  marine: "bg-marine text-white",
} as const;

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
          <VideoDetouree
            sources={[
              { src: "/heros/enfants-detoures.mp4", type: "video/mp4" },
              { src: "/heros/enfants-detoures.webm", type: "video/webm" },
            ]}
            poster="/heros/enfants-detoures.webp"
            largeur={612}
            hauteur={900}
            alt="Trois écoliers en survêtement bleu, souriants, font coucou"
            className="w-full"
          />
        }
      >
        <h1 className="anim-entree text-[2.6rem] leading-[1.02] font-bold text-balance sm:text-5xl lg:text-7xl">
          Ce qui dort chez vous <span className="text-rouge-clair">fait école</span> là-bas.
        </h1>

        <div className="anim-entree anim-retard-2 mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-10">
          <Button asChild taille="lg">
            <Link href="/contact?profil=entreprise">
              Proposer un don
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variante="courbe-clair" className="text-base">
            <Link href="/realisations">Voir nos réalisations</Link>
          </Button>
        </div>
      </BanniereAccueil>

      {/* ---------------------------------------------------------------- Ruban */}
      <RubanDefilant
        mentions={[
          "Enlèvement gratuit partout en France",
          "Effacement certifié des disques",
          "Inventaire et attestation de don",
          "Acheminement par conteneur",
          "Installation par nos relais locaux",
          "Compte rendu d'usage à 6 mois",
        ]}
      />

      {/* ------------------------------------------------------------- Chiffres */}
      {/* Masquée tant qu'aucun projet n'est publié : mieux vaut pas de section
          du tout qu'une rangée de zéros. */}
      {statistiques.projets > 0 ? (
        <Section>
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
                precision="Convois, installations, retours de terrain"
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

      {/* --------------------------------------------------------- Les 3 temps */}
      <section aria-labelledby="titre-parcours" className="mt-14 md:mt-20">
        <Vague className="text-nuage" retourne />
        <div className="bg-nuage motif-tissu py-14 md:py-20">
          <div className="contenu">
            <TitreSection
              id="titre-parcours"
              surtitre="Comment ça fonctionne"
              titre="Trois temps, de votre local à une salle de classe"
              chapo="Vous n'avez rien à organiser : nous prenons en charge tout le parcours."
            />

            <ol className="anim-defilement relative mt-12 grid gap-6 md:grid-cols-3">
              {/* Fil qui relie les trois étapes, en courbe, sur grand écran. */}
              <svg
                viewBox="0 0 1000 60"
                preserveAspectRatio="none"
                className="text-bordure absolute inset-x-[12%] top-7 hidden h-12 md:block"
                aria-hidden="true"
              >
                <path
                  d="M0 40C160 0 330 0 500 30S840 60 1000 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="2 12"
                  strokeLinecap="round"
                />
              </svg>

              {etapes.map((etape, index) => (
                <li key={etape.titre} className="relative flex flex-col">
                  <span
                    className={cn(
                      "font-titre ring-nuage relative z-10 mx-auto flex size-16 items-center justify-center rounded-full text-2xl font-bold shadow-lg ring-8 md:mx-0",
                      pastilles[etape.ton],
                    )}
                  >
                    {index + 1}
                  </span>
                  <Card
                    className={cn(
                      "carte-relief mt-5 flex-1",
                      index % 2 === 1 && "forme-coeur-inverse",
                    )}
                  >
                    <CardBody className="space-y-3">
                      <etape.icone
                        className={cn(
                          "size-7",
                          etape.ton === "bleu" && "text-bleu",
                          etape.ton === "rouge" && "text-rouge",
                          etape.ton === "marine" && "text-marine",
                        )}
                        aria-hidden="true"
                      />
                      <CardTitre>{etape.titre}</CardTitre>
                      <p className="text-doux leading-relaxed">{etape.texte}</p>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ol>

            <BandeauAccent ton="marine" className="anim-defilement mt-12">
              <p className="font-titre text-xl font-semibold">Comptez trois à quatre mois</p>
              <p className="mt-1.5 leading-relaxed text-white/85">
                Un lot enlevé en janvier arrive généralement en salle de classe entre avril et mai —
                la traversée maritime et le dédouanement pèsent la moitié du délai.
              </p>
            </BandeauAccent>

            <div className="mt-10">
              <Button asChild variante="courbe">
                <Link href="/comment-ca-marche">
                  Le parcours détaillé d&apos;un don
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Vague className="text-nuage" />
      </section>

      {/* ------------------------------------------------------- Deux audiences */}
      <Section>
        <div className="contenu">
          <TitreSection
            surtitre="À qui nous nous adressons"
            titre="Deux interlocuteurs, deux besoins"
          />
          <div className="anim-defilement mt-10 grid gap-6 md:grid-cols-2">
            <div className="forme-coeur bg-rouge-voile relative isolate overflow-hidden p-7 md:p-9">
              <Coeur className="text-rouge-vif -right-14 -bottom-16 -z-10 w-44 opacity-10" />
              <span className="bg-rouge-vif inline-flex size-14 items-center justify-center rounded-full text-white">
                <Building2 className="size-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-semibold">Vous êtes une entreprise en France</h3>
              <p className="text-doux mt-3 leading-relaxed">
                Une alternative à la benne : nous organisons l&apos;enlèvement, effaçons les données
                et vous remettons inventaire et compte rendu d&apos;usage pour votre rapport RSE.
              </p>
              <Button asChild variante="courbe" className="mt-6">
                <Link href="/services#entreprises">
                  Ce que nous proposons aux entreprises
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="forme-coeur-inverse bg-bleu-voile relative isolate overflow-hidden p-7 md:p-9">
              <Coeur className="text-bleu-vif -right-14 -bottom-16 -z-10 w-44 opacity-10" />
              <span className="bg-bleu-vif inline-flex size-14 items-center justify-center rounded-full text-white">
                <GraduationCap className="size-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-semibold">Vous êtes une structure au Congo</h3>
              <p className="text-doux mt-3 leading-relaxed">
                École, mairie ou association : adressez-nous une demande d&apos;équipement. Nous
                examinons chaque dossier avec nos relais locaux, selon le matériel disponible.
              </p>
              <Button asChild variante="courbe" className="mt-6">
                <Link href="/services#beneficiaires">
                  Ce que nous proposons aux bénéficiaires
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

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
              <div className="forme-coeur bg-white/[0.07] p-7 ring-1 ring-white/15 md:p-9">
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

              <div className="forme-coeur-inverse bg-white/[0.07] p-7 ring-1 ring-white/15 md:p-9">
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
                <li key={projet.id}>
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
              {articles.map((article) => (
                <li key={article.id}>
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

      {/* ------------------------------------------------------------- CTA final */}
      <section className="contenu py-14 md:py-20">
        <div className="from-bleu-vif to-bleu-fonce relative isolate overflow-hidden rounded-[2rem] rounded-bl-lg bg-linear-to-br px-6 py-14 text-center md:rounded-[3rem] md:rounded-bl-xl md:px-12 md:py-20">
          <Coeur className="-right-12 -bottom-16 -z-10 w-64 text-white/10 md:w-96" />
          <div className="anim-defilement mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Un local à vider ? Parlons-en avant la benne.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/90">
              Décrivez-nous le matériel et son volume. Réponse claire sous 72 heures.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
              <Button asChild taille="lg" variante="clair">
                <Link href="/contact?profil=entreprise">
                  Proposer un don de matériel
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variante="courbe-clair" className="text-base">
                <Link href="/contact?profil=beneficiaire">Demander un équipement</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-white/80">
              Ou écrivez-nous directement à{" "}
              <a href={`mailto:${site.email}`} className="font-bold text-white underline">
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
