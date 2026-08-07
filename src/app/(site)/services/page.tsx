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
import { Card, CardBody, CardTitre } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Section, TitreSection } from "@/components/sections";
import { BannierePage } from "@/components/bannieres";
import { MotifAngle } from "@/components/illustrations";
import { trouverPhotoBanniere } from "@/lib/visuels";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Collecte et effacement des données pour les entreprises partout en France ; équipement des écoles au Congo, réparation du matériel par des jeunes et centre de formation aux métiers de l'informatique.",
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
      "Vous décrivez votre structure et vos besoins. Notre relais local vérifie sur place les conditions d'accueil.",
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
      "Nos partenaires locaux accompagnent l'installation et la première prise en main, pour un usage dès la première semaine.",
  },
  {
    icone: Handshake,
    titre: "Suivi après livraison",
    texte:
      "Nous repassons quelques mois plus tard : usage réel, pannes éventuelles, dotation complétée au convoi suivant.",
  },
] as const;

export default function PageServices() {
  return (
    <>
      <BannierePage
        surtitre="Nos services"
        titre="Une même chaîne, de la collecte à la formation"
        chapo="Collecter le matériel des entreprises partout en France, équiper des structures au Congo, faire réparer par des jeunes ce qui peut l'être, et former aux métiers de l'informatique."
        ton="terre"
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

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicesEntreprises.map((service) => (
              <li key={service.titre}>
                <Card className="h-full">
                  <CardBody className="space-y-3">
                    <span className="bg-terre-voile inline-flex size-11 items-center justify-center rounded-full">
                      <service.icone className="text-terre size-5" aria-hidden="true" />
                    </span>
                    <CardTitre className="text-lg">{service.titre}</CardTitre>
                    <p className="text-doux text-sm leading-relaxed">{service.texte}</p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-5">
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
      <Section id="beneficiaires" fond="sable" aria-labelledby="titre-beneficiaires">
        <div className="contenu">
          <TitreSection
            id="titre-beneficiaires"
            surtitre="Pour les structures au Congo"
            titre="Écoles, mairies et associations : comment être équipé"
            chapo="Demandes examinées au fil des arrivages. Priorité aux structures à public scolaire disposant d'un local sécurisable et alimenté en électricité."
          />

          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {servicesBeneficiaires.map((service) => (
              <li key={service.titre}>
                <Card className="h-full">
                  <CardBody className="space-y-3">
                    <span className="bg-vert-voile inline-flex size-11 items-center justify-center rounded-full">
                      <service.icone className="text-vert size-5" aria-hidden="true" />
                    </span>
                    <CardTitre className="text-lg">{service.titre}</CardTitre>
                    <p className="text-doux text-sm leading-relaxed">{service.texte}</p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Card>
              <CardBody className="space-y-4">
                <CardTitre>Ce qu&apos;il faut nous transmettre</CardTitre>
                <ul className="text-doux space-y-2.5 text-sm">
                  {[
                    "Nom, adresse et statut de la structure (école, mairie, association).",
                    "Nombre de personnes concernées : élèves, enseignants, agents.",
                    "Matériel souhaité, par ordre de priorité, et usage prévu.",
                    "État du local : surface, fermeture, stabilité de l'électricité.",
                    "Contact direct d'une personne référente sur place.",
                  ].map((element) => (
                    <li key={element} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="bg-ocre mt-2 size-1.5 shrink-0 rounded-full"
                      />
                      <span>{element}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variante="secondaire">
                  <Link href="/contact?profil=beneficiaire">
                    Déposer une demande d&apos;équipement
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ Réparation */}
      <Section id="reparation" aria-labelledby="titre-reparation">
        <div className="contenu">
          <TitreSection
            id="titre-reparation"
            surtitre="Réemploi et insertion"
            titre="Réparer plutôt que jeter, et former en réparant"
            chapo="Une partie du matériel arrive endommagée. Plutôt que de la mettre au rebut, nous la confions à des recycleries à Kinshasa, où des jeunes apprennent à le remettre en état."
          />

          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              {
                icone: Recycle,
                titre: "Matériel récupéré",
                texte: "Postes et périphériques endommagés qui, ailleurs, finiraient à la benne.",
              },
              {
                icone: Wrench,
                titre: "Remis en état sur place",
                texte: "Diagnostic, réparation et test dans des recycleries partenaires à Kinshasa.",
              },
              {
                icone: Users,
                titre: "Des jeunes formés",
                texte: "Chaque réparation est un atelier : les jeunes acquièrent un vrai savoir-faire.",
              },
            ].map((bloc) => (
              <li key={bloc.titre}>
                <Card className="h-full">
                  <CardBody className="space-y-3">
                    <span className="bg-soleil-voile inline-flex size-11 items-center justify-center rounded-full">
                      <bloc.icone className="text-ocre size-5" aria-hidden="true" />
                    </span>
                    <CardTitre className="text-lg">{bloc.titre}</CardTitre>
                    <p className="text-doux text-sm leading-relaxed">{bloc.texte}</p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ------------------------------------------------------------- Formation */}
      <Section id="formation" fond="sable" aria-labelledby="titre-formation">
        <div className="contenu">
          <div className="rounded-douce border-bordure relative overflow-hidden border bg-white p-8 md:p-12">
            <MotifAngle className="text-indigo -top-16 -right-16 size-72 opacity-10" />
            <div className="relative max-w-2xl">
              <span className="bg-indigo-voile text-indigo inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Bientôt
              </span>
              <h2 id="titre-formation" className="font-titre mt-4 text-2xl font-bold md:text-3xl">
                Un centre de formation aux métiers de l&apos;informatique
              </h2>
              <p className="text-doux mt-3 leading-relaxed">
                À Kinshasa, un centre de formation voit le jour : maintenance, réparation et bases du
                numérique, pour donner aux jeunes un métier autour du matériel qui arrive.
              </p>
              <p className="text-doux mt-3 text-sm">
                Le projet est en cours de montage. Écrivez-nous pour suivre son ouverture ou y
                contribuer.
              </p>
              <Button asChild variante="secondaire" className="mt-6">
                <Link href="/contact">
                  En savoir plus sur le centre
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
