import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, GraduationCap, PackageCheck, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitre } from "@/components/ui/card";
import { ChiffreCle, EtatVide, Section, TitreSection } from "@/components/sections";
import { BandeauAccent, BanniereAccueil, RubanDefilant } from "@/components/bannieres";
import { IlluCollecte, IlluEcole, IlluTransport, MotifAngle } from "@/components/illustrations";
import { trouverPhotoBanniere } from "@/lib/visuels";
import { CarteProjet } from "@/components/carte-projet";
import { CarteArticle } from "@/components/carte-article";
import { compterPourAccueil, listerArticlesPublies, listerProjetsPublies } from "@/lib/data";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

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
    illustration: IlluCollecte,
    ton: "terre" as const,
    titre: "1. Collecte en Île-de-France",
    texte: "Enlèvement sur votre site, inventaire signé.",
  },
  {
    icone: Ship,
    illustration: IlluTransport,
    ton: "ocre" as const,
    titre: "2. Préparation et acheminement",
    texte: "Matériel testé, données effacées, conteneur vers Kinshasa.",
  },
  {
    icone: GraduationCap,
    illustration: IlluEcole,
    ton: "vert" as const,
    titre: "3. Mise en service au Congo",
    texte: "Installation en école ou mairie, compte rendu d'usage.",
  },
] as const;

export default async function PageAccueil() {
  // Deux requêtes indépendantes : lancées en parallèle pour ne pas additionner
  // les temps d'attente sur une connexion lente.
  const [projets, articles, statistiques] = await Promise.all([
    listerProjetsPublies(3),
    listerArticlesPublies(3),
    compterPourAccueil(),
  ]);

  // Bascule automatiquement sur une vraie photographie dès qu'un fichier
  // `public/bannieres/accueil.jpg` (ou .png/.webp/.avif) est déposé.
  const photoBanniere = trouverPhotoBanniere("accueil");

  return (
    <>
      {/* ------------------------------------------------------------- Bannière */}
      <BanniereAccueil photo={photoBanniere} photoAlt="">
        <p className="anim-entree bg-soleil/25 ring-soleil/40 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ring-1 backdrop-blur-sm">
          <span className="bg-soleil size-2 rounded-full" aria-hidden="true" />
          Collecte en Île-de-France · Distribution au Congo
        </p>

        <h1 className="anim-entree anim-retard-1 text-4xl leading-[1.08] font-bold text-balance md:text-6xl lg:text-7xl">
          Le matériel dont vous n&apos;avez plus l&apos;usage devient une{" "}
          <span className="text-soleil">salle de classe équipée</span>.
        </h1>

        <p className="anim-entree anim-retard-2 mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
          Nous collectons le matériel dont les entreprises franciliennes se séparent et
          l&apos;acheminons vers des écoles et associations au Congo. Chaque étape est tracée.
        </p>

        <div className="anim-entree anim-retard-3 mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild taille="lg" className="shadow-lg shadow-black/20">
            <Link href="/contact?profil=entreprise">
              Proposer un don
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild taille="lg" variante="contour-clair">
            <Link href="/realisations">Voir nos réalisations</Link>
          </Button>
        </div>

        {/* Trois repères du parcours, directement dans la bannière. */}
        <ul className="anim-entree anim-retard-4 mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              icone: Building2,
              texte: "Enlèvement sur votre site",
              detail: "Toute l'Île-de-France",
            },
            { icone: PackageCheck, texte: "Données effacées", detail: "Certificat remis" },
            { icone: GraduationCap, texte: "Compte rendu d'usage", detail: "Photos à l'appui" },
          ].map((repere) => (
            <li
              key={repere.texte}
              className="rounded-douce flex items-center gap-3 border border-white/20 bg-white/10 p-3.5 backdrop-blur-sm"
            >
              <repere.icone className="text-soleil size-6 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold">{repere.texte}</span>
                <span className="block text-xs text-white/75">{repere.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </BanniereAccueil>

      {/* ---------------------------------------------------------------- Ruban */}
      <RubanDefilant
        mentions={[
          "Enlèvement gratuit en Île-de-France",
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
      <Section fond="sable" aria-labelledby="titre-parcours">
        <div className="contenu">
          <TitreSection
            id="titre-parcours"
            surtitre="Comment ça fonctionne"
            titre="Trois temps, de votre local à une salle de classe"
            chapo="Vous n'avez rien à organiser : nous prenons en charge tout le parcours."
          />

          <ol className="anim-defilement mt-10 grid gap-5 md:grid-cols-3">
            {etapes.map((etape) => (
              <li key={etape.titre}>
                <Card className="carte-relief h-full">
                  {/* Bandeau illustré, teinté selon l'étape. */}
                  <div
                    className={cn(
                      "flex h-32 items-center justify-center px-8",
                      etape.ton === "terre" && "bg-terre-voile",
                      etape.ton === "ocre" && "bg-soleil-voile",
                      etape.ton === "vert" && "bg-vert-voile",
                    )}
                  >
                    <etape.illustration className="anim-flottement h-full w-auto max-w-[160px]" />
                  </div>
                  <CardBody className="space-y-3">
                    <span
                      className={cn(
                        "inline-flex size-12 items-center justify-center rounded-full",
                        etape.ton === "terre" && "bg-terre text-white",
                        etape.ton === "ocre" && "bg-ocre text-white",
                        etape.ton === "vert" && "bg-vert text-white",
                      )}
                    >
                      <etape.icone className="size-6" aria-hidden="true" />
                    </span>
                    <CardTitre>{etape.titre}</CardTitre>
                    <p className="text-doux text-sm leading-relaxed">{etape.texte}</p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ol>

          <BandeauAccent ton="indigo" className="anim-defilement mt-10">
            <p className="font-titre text-lg font-bold">Comptez trois à quatre mois</p>
            <p className="mt-1.5 text-sm leading-relaxed">
              Un lot enlevé en janvier arrive généralement en salle de classe entre avril et mai —
              la traversée maritime et le dédouanement pèsent la moitié du délai.
            </p>
          </BandeauAccent>

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
          <div className="anim-defilement mt-8 grid gap-5 md:grid-cols-2">
            <Card className="carte-relief border-terre/25 relative overflow-hidden">
              <span className="bg-terre absolute inset-x-0 top-0 h-1.5" aria-hidden="true" />
              <MotifAngle className="text-terre -top-12 -right-12 size-48 opacity-10" />
              <CardBody className="relative space-y-3">
                <Building2 className="text-terre size-8" aria-hidden="true" />
                <CardTitre>Vous êtes une entreprise d&apos;Île-de-France</CardTitre>
                <p className="text-doux text-sm leading-relaxed">
                  Une alternative à la benne : nous organisons l&apos;enlèvement, effaçons les
                  données et vous remettons inventaire et compte rendu d&apos;usage pour votre
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

            <Card className="carte-relief border-vert/25 relative overflow-hidden">
              <span className="bg-vert absolute inset-x-0 top-0 h-1.5" aria-hidden="true" />
              <MotifAngle className="text-vert -top-12 -right-12 size-48 opacity-10" />
              <CardBody className="relative space-y-3">
                <GraduationCap className="text-vert size-8" aria-hidden="true" />
                <CardTitre>Vous êtes une structure au Congo</CardTitre>
                <p className="text-doux text-sm leading-relaxed">
                  École, mairie ou association : adressez-nous une demande d&apos;équipement. Nous
                  examinons chaque dossier avec nos relais locaux, selon le matériel disponible.
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
            <ul className="anim-defilement mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <ul className="anim-defilement mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="bg-vert relative isolate overflow-hidden py-16 md:py-24">
        <MotifAngle className="-top-24 -left-24 size-96 text-white/15" aria-hidden="true" />
        <MotifAngle className="-right-20 -bottom-28 size-80 text-white/10" aria-hidden="true" />
        <div className="contenu anim-defilement relative max-w-3xl text-center">
          <h2 className="font-titre text-3xl font-bold text-white md:text-4xl">
            Un local à vider ? Parlons-en avant la benne.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            Décrivez-nous le matériel et son volume. Réponse claire sous 72 heures.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              taille="lg"
              className="pulse-cta bouton-brillant text-vert-fonce bg-white hover:bg-white/90"
            >
              <Link href="/contact?profil=entreprise">Proposer un don de matériel</Link>
            </Button>
            <Button asChild taille="lg" variante="contour-clair">
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
