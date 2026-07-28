import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  HardDrive,
  Handshake,
  Truck,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitre } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Section, TitreSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Enlèvement de matériel, effacement des données, inventaire et attestation pour les entreprises d'Île-de-France ; équipement, installation et suivi pour les écoles et associations au Congo.",
  alternates: { canonical: "/services" },
};

/** Prestations proposées aux entreprises donatrices. */
const servicesEntreprises = [
  {
    icone: ClipboardCheck,
    titre: "Diagnostic du lot",
    texte:
      "Vous nous transmettez une liste, même approximative. Nous vous disons sous 72 heures ce qui est réemployable, ce qui part en filière de recyclage agréée, et ce que nous ne pouvons pas prendre.",
  },
  {
    icone: Truck,
    titre: "Enlèvement sur site",
    texte:
      "Nous nous déplaçons dans toute l'Île-de-France, y compris en étage et sur créneau imposé. Le chargement est assuré par notre équipe : vous n'avez ni palette à préparer, ni manutention à prévoir.",
  },
  {
    icone: HardDrive,
    titre: "Effacement des données",
    texte:
      "Chaque support de stockage est effacé selon une procédure d'écrasement multi-passes, ou détruit physiquement si vous le demandez. Un certificat d'effacement est joint à l'inventaire.",
  },
  {
    icone: FileText,
    titre: "Inventaire et attestation",
    texte:
      "Vous recevez un inventaire détaillé du lot enlevé et une attestation de don. Ces pièces sont directement exploitables pour votre rapport RSE ou votre bilan de fin d'exercice.",
  },
  {
    icone: Handshake,
    titre: "Compte rendu d'usage",
    texte:
      "Quelques mois après la livraison, nous vous adressons des photos et un compte rendu indiquant quelle structure a reçu votre matériel et à quoi il sert aujourd'hui.",
  },
  {
    icone: Users,
    titre: "Partenariat sur la durée",
    texte:
      "Si votre entreprise renouvelle son parc régulièrement, nous mettons en place un calendrier d'enlèvements et un interlocuteur unique côté association.",
  },
] as const;

/** Prestations proposées aux structures bénéficiaires. */
const servicesBeneficiaires = [
  {
    icone: FileText,
    titre: "Étude de votre demande",
    texte:
      "Vous nous décrivez votre structure, vos effectifs et vos besoins. Notre relais local vérifie sur place les conditions d'accueil : local sécurisé, alimentation électrique, personne référente.",
  },
  {
    icone: Warehouse,
    titre: "Dotation en matériel",
    texte:
      "Selon les arrivages, nous constituons un lot adapté : postes informatiques, onduleurs, rallonges et multiprises, mobilier scolaire, fournitures. Le matériel est fonctionnel et testé.",
  },
  {
    icone: Wrench,
    titre: "Installation et prise en main",
    texte:
      "Nos partenaires locaux accompagnent l'installation, l'organisation de la salle et la première prise en main par les enseignants ou les agents, afin que le matériel serve dès la première semaine.",
  },
  {
    icone: Handshake,
    titre: "Suivi après livraison",
    texte:
      "Nous repassons quelques mois plus tard pour constater l'usage réel, recenser les pannes et, si besoin, compléter la dotation lors du convoi suivant.",
  },
] as const;

export default function PageServices() {
  return (
    <>
      <Section fond="sable">
        <div className="contenu">
          <TitreSection
            niveau={1}
            surtitre="Nos services"
            titre="Deux métiers, une même chaîne"
            chapo="D'un côté, décharger les entreprises franciliennes d'un matériel devenu encombrant, en leur garantissant sécurité des données et traçabilité. De l'autre, équiper durablement des structures au Congo, avec un accompagnement qui ne s'arrête pas à la livraison."
          />
        </div>
      </Section>

      {/* --------------------------------------------------------- Entreprises */}
      <Section id="entreprises" aria-labelledby="titre-entreprises">
        <div className="contenu">
          <TitreSection
            id="titre-entreprises"
            surtitre="Pour les entreprises d'Île-de-France"
            titre="Vous vous séparez de matériel : nous nous occupons de tout"
            chapo="Aucun coût pour votre entreprise, aucune logistique à organiser de votre côté. Notre engagement porte sur trois points : la sécurité de vos données, la traçabilité du lot et un retour documenté sur son usage final."
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
                Nous refusons le matériel hors d&apos;usage, les écrans cathodiques, les batteries
                gonflées et tout équipement dont la remise en service coûterait plus cher que son
                remplacement. Dans ce cas, nous vous orientons vers une filière de recyclage agréée
                plutôt que de vous laisser sans solution.
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
            chapo="Les demandes sont examinées au fil des arrivages. Nous privilégions les structures qui accueillent un public scolaire et qui disposent d'un local pouvant être sécurisé et alimenté en électricité."
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
                    "Le nom exact et l'adresse de la structure, ainsi que son statut (école publique, école conventionnée, mairie, association).",
                    "Le nombre de personnes concernées : élèves, enseignants, agents, usagers.",
                    "Le matériel souhaité, par ordre de priorité, et l'usage prévu.",
                    "L'état du local : surface, fermeture, présence et stabilité de l'électricité.",
                    "Le nom et le contact direct d'une personne référente sur place.",
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
    </>
  );
}
