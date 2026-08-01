import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitre } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Section } from "@/components/sections";
import { BannierePage } from "@/components/bannieres";
import { trouverPhotoBanniere } from "@/lib/visuels";
import { urlSite } from "@/lib/env";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Le parcours complet d'un don, du premier message d'une entreprise francilienne jusqu'à la mise en service du matériel dans une école au Congo, étape par étape et avec les délais.",
  alternates: { canonical: "/comment-ca-marche" },
};

/**
 * Le parcours d'un don, étape par étape.
 *
 * Structuré en données plutôt qu'en JSX pour pouvoir alimenter, à partir de la
 * même source, à la fois le rendu visuel et le balisage JSON-LD `HowTo`.
 */
const etapes = [
  {
    numero: "01",
    titre: "Vous nous signalez le matériel",
    delai: "Jour 0",
    texte:
      "Un message via le formulaire suffit : nature du matériel, quantité approximative, adresse et date de libération du local.",
  },
  {
    numero: "02",
    titre: "Nous qualifions le lot",
    delai: "Sous 72 h",
    texte:
      "Nous répondons en trois catégories : ce que nous emportons pour réemploi, ce qui part au recyclage, et ce que nous ne prenons pas.",
  },
  {
    numero: "03",
    titre: "Enlèvement sur votre site",
    delai: "Sous 2 à 4 semaines",
    texte:
      "Notre équipe se déplace au créneau convenu et assure la manutention. Un inventaire est signé sur place.",
  },
  {
    numero: "04",
    titre: "Test, effacement, reconditionnement",
    delai: "2 à 3 semaines",
    texte:
      "Chaque équipement est testé, les données effacées (certificat remis) ou détruites. Le matériel non fonctionnel est démonté pour pièces.",
  },
  {
    numero: "05",
    titre: "Palettisation et départ en conteneur",
    delai: "Selon le calendrier des convois",
    texte:
      "Les lots sont palettisés puis chargés en conteneur au Havre ou à Anvers. La traversée jusqu'à Matadi dure environ cinq semaines.",
  },
  {
    numero: "06",
    titre: "Dédouanement et acheminement local",
    delai: "1 à 3 semaines",
    texte:
      "Notre partenaire prend en charge le dédouanement puis la route jusqu'à la structure. C'est l'étape la plus incertaine.",
  },
  {
    numero: "07",
    titre: "Installation et prise en main",
    delai: "Jour de la livraison",
    texte:
      "Matériel installé, raccordé et testé avec la personne référente. Première prise en main avec les enseignants ou agents.",
  },
  {
    numero: "08",
    titre: "Compte rendu d'usage",
    delai: "3 à 6 mois après",
    texte:
      "Nous repassons constater l'usage et recenser les pannes. Le compte rendu est publié et envoyé à l'entreprise donatrice.",
  },
] as const;

export default function PageCommentCaMarche() {
  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Le parcours d'un don de matériel, de l'Île-de-France au Congo",
    description:
      "Les huit étapes suivies par un lot de matériel, de son signalement par une entreprise francilienne à sa mise en service dans une structure au Congo.",
    url: `${urlSite}/comment-ca-marche`,
    step: etapes.map((etape, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: etape.titre,
      text: etape.texte,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
      />

      <BannierePage
        surtitre="Comment ça marche"
        titre="Le parcours complet d'un don"
        chapo="Du signalement d'un lot à l'installation des élèves devant les postes : trois à quatre mois. Voici ce qui se passe, délais réels compris."
        ton="indigo"
        photo={trouverPhotoBanniere("comment-ca-marche")}
      />

      <Section>
        <div className="contenu">
          <ol className="space-y-4">
            {etapes.map((etape) => (
              <li key={etape.numero}>
                <Card>
                  <CardBody className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start">
                      <span
                        aria-hidden="true"
                        className="font-titre text-terre/40 text-3xl font-bold"
                      >
                        {etape.numero}
                      </span>
                      <span className="bg-ocre-voile rounded-full px-2.5 py-1 text-xs font-semibold text-[#7a4a08]">
                        {etape.delai}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <CardTitre className="text-lg">{etape.titre}</CardTitre>
                      <p className="text-doux text-sm leading-relaxed">{etape.texte}</p>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <Alert titre="Pourquoi ces délais ?">
              <p>
                La traversée maritime et le dédouanement pèsent à eux seuls la moitié du délai. Nous
                préférons annoncer un calendrier réaliste : un lot enlevé en janvier arrive
                généralement en salle de classe entre avril et mai.
              </p>
            </Alert>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardBody className="space-y-3">
                <CardTitre className="text-lg">Vous êtes une entreprise</CardTitre>
                <p className="text-doux text-sm">
                  Votre seule action est le premier message. Tout le reste est pris en charge.
                </p>
                <Button asChild variante="principal">
                  <Link href="/contact?profil=entreprise">
                    Signaler du matériel
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="space-y-3">
                <CardTitre className="text-lg">Vous êtes une structure au Congo</CardTitre>
                <p className="text-doux text-sm">
                  Déposez votre demande : elle sera examinée lors du prochain arrivage.
                </p>
                <Button asChild variante="secondaire">
                  <Link href="/contact?profil=beneficiaire">
                    Demander un équipement
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
