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
import { BannierePage } from "@/components/bannieres";
import { trouverPhotoBanniere } from "@/lib/visuels";

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
      "Envoyez-nous une liste, même approximative. Sous 72 heures, nous vous disons ce qui est réemployable et ce qui part au recyclage.",
  },
  {
    icone: Truck,
    titre: "Enlèvement sur site",
    texte:
      "Partout en Île-de-France, étage compris. Chargement assuré par notre équipe : rien à préparer de votre côté.",
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
        titre="Deux métiers, une même chaîne"
        chapo="Décharger les entreprises franciliennes de leur matériel, données sécurisées et traçabilité garanties. Équiper durablement des structures au Congo, bien au-delà de la livraison."
        ton="terre"
        photo={trouverPhotoBanniere("services")}
      />

      {/* --------------------------------------------------------- Entreprises */}
      <Section id="entreprises" aria-labelledby="titre-entreprises">
        <div className="contenu">
          <TitreSection
            id="titre-entreprises"
            surtitre="Pour les entreprises d'Île-de-France"
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
    </>
  );
}
