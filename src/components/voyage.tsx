"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  HeartHandshake,
  Monitor,
  School,
  Ship,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * « Le voyage d'un don » : le trajet du matériel, raconté au défilement.
 *
 * Défilement vertical ordinaire — rien n'est détourné. Sur grand écran, un
 * visuel reste fixe à gauche (pictogramme animé, photo en médaillon, chiffre
 * géant) et change en fondu à chaque étape, pendant que le texte défile à
 * droite. Au centre, une route verticale : le véhicule — le don lui-même —
 * descend dessus en laissant une traînée rouge, et change de forme en chemin.
 *
 * Performance, pensée pour les téléphones modestes :
 *   - le véhicule et sa traînée sont en `position: sticky` : c'est le
 *     navigateur qui les déplace, sans aucun calcul pendant le défilement ;
 *   - l'étape courante est détectée par un IntersectionObserver (un appel au
 *     passage de chaque étape, pas à chaque image) ;
 *   - seules les animations de l'étape courante tournent, et uniquement sur
 *     `transform` et `opacity`, que la carte graphique gère seule.
 *
 * Sans JavaScript, ou si le visiteur a demandé à réduire les animations, tout
 * le contenu reste affiché, simplement sans mouvement.
 */

type Ton = "bleu" | "rouge" | "marine";

type Etape = {
  id: string;
  lieu: string;
  titre: string;
  texte: string;
  icone: LucideIcon;
  /** Animation continue du pictogramme (classes `picto-*` du CSS global). */
  anim: "flotte" | "roule" | "outil" | "tangue" | "lumiere" | "battement";
  /** Forme du véhicule quand il passe sur cette étape. */
  vehicule: LucideIcon;
  ton: Ton;
  repere: { valeur: string; libelle: string };
  photo?: { src: string; alt: string };
  /** Vagues sous le pictogramme (traversée vers le Congo). */
  mer?: boolean;
  action?: React.ReactNode;
};

const etapes: Etape[] = [
  {
    id: "chez-vous",
    lieu: "Chez vous",
    titre: "Vous nous signalez le matériel",
    texte:
      "Ordinateurs, écrans, onduleurs, mobilier scolaire… Un message suffit : nature, quantité, adresse et date de libération du local.",
    icone: Building2,
    anim: "flotte",
    vehicule: Monitor,
    ton: "bleu",
    repere: { valeur: "72 h", libelle: "pour une réponse claire" },
    action: (
      <Button asChild>
        <Link href="/contact?profil=entreprise">
          Signaler du matériel
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    ),
  },
  {
    id: "route",
    lieu: "Sur la route",
    titre: "Nous venons le chercher",
    texte:
      "Partout en France, au créneau convenu. Manutention comprise, inventaire signé et attestation de don remis sur place.",
    icone: Truck,
    anim: "roule",
    vehicule: Truck,
    ton: "rouge",
    repere: { valeur: "0 €", libelle: "l'enlèvement, partout en France" },
    photo: { src: "/voyage/route.webp", alt: "Un livreur charge des cartons dans une camionnette" },
  },
  {
    id: "atelier",
    lieu: "À l'atelier",
    titre: "Testé, effacé, remis en état",
    texte:
      "Chaque équipement est testé et ses données effacées, certificat à l'appui. Ce qui se répare part en atelier plutôt qu'à la benne.",
    icone: Wrench,
    anim: "outil",
    vehicule: Wrench,
    ton: "marine",
    repere: { valeur: "100 %", libelle: "des disques effacés ou détruits" },
    photo: { src: "/voyage/atelier.webp", alt: "Des mains réparent un circuit électronique" },
  },
  {
    id: "france",
    lieu: "Destination · En France",
    titre: "Livré directement, en quelques semaines",
    texte:
      "Écoles, mairies et associations en France reçoivent le matériel en direct, sans intermédiaire.",
    icone: Truck,
    anim: "roule",
    vehicule: Truck,
    ton: "bleu",
    repere: { valeur: "2-4 sem.", libelle: "de l'atelier à la salle" },
    photo: {
      src: "/voyage/france.webp",
      alt: "Deux enfants travaillent sur un ordinateur en classe",
    },
  },
  {
    id: "congo",
    lieu: "Destination · Au Congo",
    titre: "Par conteneur, jusqu'à Kinshasa",
    texte:
      "Départ du Havre ou d'Anvers, cinq semaines de mer, puis dédouanement et route jusqu'à la structure avec nos relais locaux.",
    icone: Ship,
    anim: "tangue",
    vehicule: Ship,
    ton: "rouge",
    repere: { valeur: "3-4 mois", libelle: "du local vide à la classe" },
    photo: { src: "/voyage/congo.webp", alt: "Un porte-conteneurs à quai dans un port" },
    mer: true,
    action: (
      <Button asChild variante="secondaire">
        <Link href="/contact?profil=beneficiaire">
          Demander un équipement
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    ),
  },
  {
    id: "classe",
    lieu: "En classe",
    titre: "Installé, allumé, utilisé",
    texte:
      "Le matériel est installé et testé avec une personne référente. Élèves, enseignants et agents s'en servent dès la livraison.",
    icone: School,
    anim: "lumiere",
    vehicule: School,
    ton: "bleu",
    repere: { valeur: "Jour J", libelle: "prise en main sur place" },
    photo: {
      src: "/voyage/classe.webp",
      alt: "Des enfants regardent un ordinateur portable devant une case",
    },
  },
  {
    id: "suite",
    lieu: "Six mois plus tard",
    titre: "Nous vous racontons la suite",
    texte:
      "Nous repassons constater l'usage réel et vous envoyons le compte rendu : du concret pour votre rapport RSE.",
    icone: HeartHandshake,
    anim: "battement",
    vehicule: HeartHandshake,
    ton: "rouge",
    repere: { valeur: "6 mois", libelle: "jusqu'au compte rendu d'usage" },
    action: (
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <Button asChild>
          <Link href="/contact?profil=entreprise">
            Proposer un don
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variante="courbe">
          <Link href="/realisations">Voir nos réalisations</Link>
        </Button>
      </div>
    ),
  },
];

const fonds: Record<Ton, string> = {
  bleu: "bg-bleu-vif",
  rouge: "bg-rouge-vif",
  marine: "bg-marine",
};
const textes: Record<Ton, string> = {
  bleu: "text-bleu",
  rouge: "text-rouge",
  marine: "text-marine",
};

/** Visuel d'une étape : pictogramme animé, halo, photo en médaillon. */
function Visuel({ etape, grand = false }: { etape: Etape; grand?: boolean }) {
  return (
    <div className="relative flex items-center">
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full text-white shadow-[0_24px_48px_-20px_rgba(22,35,63,0.5)]",
          grand ? "size-56 lg:size-64" : "size-24",
          fonds[etape.ton],
        )}
      >
        <span className={cn("absolute inset-0 rounded-full", `halo-${etape.ton}`)} />
        {etape.mer ? <Vagues /> : null}
        <etape.icone
          className={cn(
            "relative",
            grand ? "size-24 lg:size-28" : "size-11",
            `picto-${etape.anim}`,
          )}
          aria-hidden="true"
        />
      </span>
      {etape.photo ? (
        <span
          className={cn(
            "medaillon ring-fond relative overflow-hidden rounded-full shadow-xl",
            grand ? "-ml-14 size-44 ring-[10px] lg:size-52" : "-ml-5 size-20 ring-[6px]",
          )}
        >
          <Image
            src={etape.photo.src}
            alt={etape.photo.alt}
            fill
            sizes={grand ? "208px" : "80px"}
            className="object-cover"
          />
        </span>
      ) : null}
    </div>
  );
}

/** Vagues sous le bateau : une bande qui glisse (transform seul). */
function Vagues() {
  return (
    <span className="absolute inset-x-[12%] bottom-[14%] h-[16%] overflow-hidden">
      <span className="vagues absolute inset-y-0 left-0 w-[200%]" />
    </span>
  );
}

export function Voyage() {
  const refListe = React.useRef<HTMLOListElement>(null);
  const [active, setActive] = React.useState(0);
  const [pret, setPret] = React.useState(false);

  React.useEffect(() => {
    const liste = refListe.current;
    if (!liste) return;
    const items = Array.from(liste.querySelectorAll<HTMLElement>("[data-etape]"));

    // Étape courante : celle qui traverse le milieu de l'écran.
    const courante = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (entree.isIntersecting) setActive(Number(entree.target.getAttribute("data-etape")));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    // Entrée en scène : une seule fois, quand l'étape arrive à l'écran.
    const apparition = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (entree.isIntersecting) {
            entree.target.setAttribute("data-visible", "");
            apparition.unobserve(entree.target);
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    items.forEach((item) => {
      courante.observe(item);
      apparition.observe(item);
    });
    // Le contenu n'est masqué (en attente de son entrée en scène) qu'une fois
    // ce script actif : sans JavaScript, tout reste visible.
    setPret(true);
    return () => {
      courante.disconnect();
      apparition.disconnect();
    };
  }, []);

  const Vehicule = etapes[active]?.vehicule ?? Monitor;
  const tonActif = etapes[active]?.ton ?? "bleu";

  return (
    <section
      aria-labelledby="titre-voyage"
      data-pret={pret ? "" : undefined}
      className="voyage py-20 md:py-28"
    >
      <div className="contenu">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-rouge mb-3 inline-flex items-center gap-2 text-sm font-extrabold tracking-[0.14em] uppercase">
            <span className="bg-rouge-vif inline-block h-2 w-6 rounded-full" aria-hidden="true" />
            Le voyage d&apos;un don
          </p>
          <h2 id="titre-voyage" className="text-4xl font-bold md:text-6xl">
            De votre bureau à une salle de classe
          </h2>
          <p className="text-doux mx-auto mt-5 max-w-xl text-lg leading-relaxed">
            Suivez le trajet d&apos;un ordinateur dont vous n&apos;avez plus l&apos;usage. Vous
            n&apos;avez rien à organiser : nous prenons tout en charge.
          </p>
        </div>

        <div className="relative mt-10 md:mt-16 md:grid md:grid-cols-[1fr_6rem_1fr] md:gap-x-6">
          {/* Grand écran : visuel fixe, qui change en fondu à chaque étape. */}
          <div className="hidden md:block" aria-hidden="true">
            <div className="sticky top-[calc(50vh-8rem)] h-64">
              {etapes.map((etape, index) => (
                <div
                  key={etape.id}
                  data-actif={index === active ? "true" : "false"}
                  className="scene absolute inset-0 flex items-center justify-end"
                >
                  <p
                    className={cn(
                      "font-titre pointer-events-none absolute -top-20 right-0 text-[8rem] leading-none font-bold whitespace-nowrap opacity-[0.07] select-none lg:text-[10rem]",
                      textes[etape.ton],
                    )}
                  >
                    {etape.repere.valeur}
                  </p>
                  <Visuel etape={etape} grand />
                </div>
              ))}
            </div>
          </div>

          {/* La route : piste en pointillés, véhicule collant et sa traînée.
              `overflow-clip` (et non `hidden`) coupe la traînée au début de
              la route sans casser le `sticky`. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-12 overflow-clip md:relative md:inset-auto md:w-auto"
          >
            <span className="border-bordure absolute inset-y-0 left-1/2 -translate-x-1/2 border-l-4 border-dotted" />
            <div className="sticky top-[50vh] flex h-0 justify-center">
              <span className="bg-rouge-vif absolute bottom-0 left-1/2 h-[200vh] w-1.5 -translate-x-1/2 rounded-full" />
              <span
                key={active}
                className={cn(
                  "vehicule-arrivee relative flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_-8px_rgba(22,35,63,0.55)] ring-4 md:size-16",
                  tonActif === "rouge"
                    ? "text-rouge-vif ring-rouge-vif/30"
                    : tonActif === "marine"
                      ? "text-marine ring-marine/25"
                      : "text-bleu-vif ring-bleu-vif/30",
                )}
              >
                <Vehicule className="size-6 md:size-8" />
              </span>
            </div>
          </div>

          {/* Les étapes. */}
          <ol ref={refListe} className="pl-16 md:pl-0">
            {etapes.map((etape, index) => (
              <li
                key={etape.id}
                data-etape={index}
                data-actif={index === active ? "true" : "false"}
                className="etape flex min-h-[70vh] flex-col justify-center py-10 md:min-h-[85vh]"
              >
                {/* Téléphone : le visuel accompagne le texte. */}
                <div className="entree mb-6 md:hidden" aria-hidden="true">
                  <Visuel etape={etape} />
                </div>
                <p className="entree text-rouge mb-2 text-xs font-extrabold tracking-[0.14em] uppercase md:text-sm">
                  Étape {index + 1} · {etape.lieu}
                </p>
                <h3 className="entree text-[1.8rem] leading-tight font-bold md:text-5xl">
                  {etape.titre}
                </h3>
                <p className="entree text-doux mt-4 leading-relaxed md:text-lg">{etape.texte}</p>
                <p className="entree mt-5 flex items-baseline gap-3">
                  <span
                    className={cn(
                      "font-titre text-4xl font-bold whitespace-nowrap",
                      textes[etape.ton],
                    )}
                  >
                    {etape.repere.valeur}
                  </span>
                  <span className="text-doux text-sm font-semibold">{etape.repere.libelle}</span>
                </p>
                {etape.action ? <div className="entree mt-7">{etape.action}</div> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
