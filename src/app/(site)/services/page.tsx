import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  HardDrive,
  Handshake,
  Recycle,
  Sparkles,
  Truck,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Bande, Point, Section, TitreSection } from "@/components/sections";
import { DeuxPortes } from "@/components/deux-portes";
import { BannierePage } from "@/components/bannieres";
import { Blob } from "@/components/formes";
import { trouverPhotoBanniere } from "@/lib/visuels";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Collecte et effacement des données pour les entreprises partout en France ; équipement d'écoles et d'associations en France et au Congo, réparation du matériel par des jeunes et centre de formation aux métiers de l'informatique.",
  alternates: { canonical: "/services" },
};

/** Prestations proposées aux entreprises donatrices. */
const servicesEntreprises = [
  {
    icone: ClipboardCheck,
    titre: "Diagnostic du lot",
    texte:
      "Envoyez-nous une liste, même approximative. Sous 72 heures, nous vous disons ce qui est réemployable et ce qui part au recyclage.",
  },
  {
    icone: Truck,
    titre: "Enlèvement sur site",
    texte:
      "Partout en France, étage compris. Chargement assuré par notre équipe : rien à préparer de votre côté.",
  },
  {
    icone: HardDrive,
    titre: "Effacement des données",
    texte:
      "Effacement multi-passes ou destruction physique sur demande. Certificat joint à l'inventaire.",
  },
  {
    icone: FileText,
    titre: "Inventaire et attestation",
    texte:
      "Inventaire détaillé et attestation de don, directement exploitables pour votre rapport RSE.",
  },
  {
    icone: Handshake,
    titre: "Compte rendu d'usage",
    texte:
      "Quelques mois plus tard, photos et compte rendu : qui a reçu votre matériel et à quoi il sert.",
  },
  {
    icone: Users,
    titre: "Partenariat sur la durée",
    texte:
      "Renouvellement régulier de votre parc ? Nous mettons en place un calendrier d'enlèvements et un interlocuteur unique.",
  },
] as const;

/** Prestations proposées aux structures bénéficiaires. */
const servicesBeneficiaires = [
  {
    icone: FileText,
    titre: "Étude de votre demande",
    texte:
      "Vous décrivez votre structure et vos besoins. Nous vérifions avec vous, ou avec notre relais local au Congo, les conditions d'accueil.",
  },
  {
    icone: Warehouse,
    titre: "Dotation en matériel",
    texte:
      "Selon les arrivages : postes informatiques, onduleurs, mobilier scolaire, fournitures. Matériel testé et fonctionnel.",
  },
  {
    icone: Wrench,
    titre: "Installation et prise en main",
    texte:
      "Notre équipe en France, nos partenaires locaux au Congo accompagnent l'installation et la première prise en main, pour un usage dès la première semaine.",
  },
  {
    icone: Handshake,
    titre: "Suivi après livraison",
    texte:
      "Nous repassons quelques mois plus tard : usage réel, pannes éventuelles, dotation complétée à la livraison suivante.",
  },
] as const;

/** Alterne les trois silhouettes de forme souple, pour ne jamais répéter la même. */
const variante = (index: number) => ((index % 3) + 1) as 1 | 2 | 3;

export default function PageServices() {
  return (
    <>
      <BannierePage
        surtitre="Nos services"
        titre="Une même chaîne, de la collecte à la formation"
        chapo="Collecter le matériel des entreprises partout en France, équiper des structures en France et au Congo, faire réparer par des jeunes ce qui peut l'être, et former aux métiers de l'informatique."
        ton="rouge"
        photo={trouverPhotoBanniere("services")}
      />

      {/* --------------------------------------------------------- Entreprises */}
      <Section id="entreprises" aria-labelledby="titre-entreprises">
        <div className="contenu">
          <TitreSection
            id="titre-entreprises"
            surtitre="Pour les entreprises en France"
            titre="Vous vous séparez de matériel : nous nous occupons de tout"
            chapo="Sans coût ni logistique de votre côté. Notre engagement : sécurité des données, traçabilité du lot, retour documenté sur son usage."
          />

          <ul
            data-apparition-cascade=""
            className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {servicesEntreprises.map((service, index) => (
              <li key={service.titre}>
                <Point
                  icone={service.icone}
                  titre={service.titre}
                  ton="rouge"
                  variante={variante(index)}
                >
                  <p>{service.texte}</p>
                </Point>
              </li>
            ))}
          </ul>

          <div className="mt-14 space-y-8">
            <Alert titre="Ce que nous ne prenons pas">
              <p>
                Ni matériel hors d&apos;usage, ni écrans cathodiques, ni batteries gonflées, ni
                équipement irréparable à coût raisonnable. Dans ce cas, nous vous orientons vers une
                filière de recyclage agréée.
              </p>
            </Alert>

            <Button asChild taille="lg">
              <Link href="/contact?profil=entreprise">
                Décrire un lot de matériel
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- Bénéficiaires */}
      <Bande id="beneficiaires" fond="nuage" aria-labelledby="titre-beneficiaires">
        <div className="contenu">
          <TitreSection
            id="titre-beneficiaires"
            surtitre="Pour les structures en France et au Congo"
            titre="Écoles, mairies et associations : comment être équipé"
            chapo="Demandes examinées au fil des collectes et des arrivages. Priorité aux structures à public scolaire disposant d'un local sécurisable et alimenté en électricité."
          />

          <ul data-apparition-cascade="" className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {servicesBeneficiaires.map((service, index) => (
              <li key={service.titre}>
                <Point
                  icone={service.icone}
                  titre={service.titre}
                  ton="bleu"
                  variante={variante(index)}
                >
                  <p>{service.texte}</p>
                </Point>
              </li>
            ))}
          </ul>

          {/* Pièces à fournir : une liste numérotée posée sur la page, sans
              encadré. */}
          <div data-apparition="" className="mt-16 grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold md:text-3xl">
                Ce qu&apos;il faut nous transmettre
              </h3>
              <Button asChild variante="secondaire">
                <Link href="/contact?profil=beneficiaire">
                  Déposer une demande d&apos;équipement
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <ol className="space-y-5">
              {[
                "Nom, adresse et statut de la structure (école, mairie, association).",
                "Nombre de personnes concernées : élèves, enseignants, agents.",
                "Matériel souhaité, par ordre de priorité, et usage prévu.",
                "État du local : surface, fermeture, stabilité de l'électricité.",
                "Contact direct d'une personne référente sur place.",
              ].map((element, index) => (
                <li key={element} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="font-titre bg-bleu-vif inline-flex size-9 shrink-0 items-center justify-center rounded-full font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <span className="text-doux pt-1 text-lg leading-relaxed">{element}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Bande>

      {/* ------------------------------------------------------------ Réparation */}
      <Bande id="reparation" fond="marine" aria-labelledby="titre-reparation">
        <div className="contenu">
          <TitreSection
            id="titre-reparation"
            sombre
            surtitre="Réemploi et insertion"
            titre="Réparer plutôt que jeter, et former en réparant"
            chapo="Une partie du matériel arrive endommagée. Plutôt que de la mettre au rebut, nous la confions à des recycleries à Kinshasa, où des jeunes apprennent à le remettre en état."
          />

          <ul data-apparition-cascade="" className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-3">
            {[
              {
                icone: Recycle,
                titre: "Matériel récupéré",
                texte: "Postes et périphériques endommagés qui, ailleurs, finiraient à la benne.",
              },
              {
                icone: Wrench,
                titre: "Remis en état sur place",
                texte:
                  "Diagnostic, réparation et test dans des recycleries partenaires à Kinshasa.",
              },
              {
                icone: Users,
                titre: "Des jeunes formés",
                texte:
                  "Chaque réparation est un atelier : les jeunes acquièrent un vrai savoir-faire.",
              },
            ].map((bloc, index) => (
              <li key={bloc.titre}>
                <Point
                  icone={bloc.icone}
                  titre={bloc.titre}
                  ton={index === 1 ? "rouge" : "bleu"}
                  variante={variante(index)}
                  sombre
                >
                  <p>{bloc.texte}</p>
                </Point>
              </li>
            ))}
          </ul>
        </div>
      </Bande>

      {/* ------------------------------------------------------------- Formation */}
      <Section id="formation" aria-labelledby="titre-formation">
        <div className="contenu">
          {/* Pas d'encadré : une grande forme souple porte le pictogramme, le
              texte est posé à côté. */}
          <div
            data-apparition=""
            className="grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-16"
          >
            <Blob teinte="bg-rouge-vif" variante={2} className="size-40 text-white md:size-56">
              <Sparkles className="size-16 md:size-20" aria-hidden="true" />
            </Blob>
            <div className="max-w-2xl">
              <span className="bg-marine inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                Bientôt
              </span>
              <h2 id="titre-formation" className="font-titre mt-4 text-3xl font-bold md:text-5xl">
                Un centre de formation aux métiers de l&apos;informatique
              </h2>
              <p className="text-doux mt-4 text-lg leading-relaxed">
                À Kinshasa, un centre de formation voit le jour : maintenance, réparation et bases
                du numérique, pour donner aux jeunes un métier autour du matériel qui arrive.
              </p>
              <p className="text-doux mt-3">
                Le projet est en cours de montage. Écrivez-nous pour suivre son ouverture ou y
                contribuer.
              </p>
              <Button asChild variante="secondaire" className="mt-7">
                <Link href="/contact">
                  En savoir plus sur le centre
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <DeuxPortes />
    </>
  );
}
