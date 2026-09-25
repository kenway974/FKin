"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

/**
 * « Le voyage d'un don », en frise horizontale.
 *
 * La section se fige à l'écran ; le défilement vertical fait glisser la frise
 * de gauche à droite. Un véhicule — le don lui-même — roule sur une route
 * ondulée : ordinateur au départ, camion sur la route, bateau pour le Congo,
 * école à l'arrivée. Chaque étape entre en scène à son passage (pictogramme
 * animé, photo en médaillon, texte), et le ruban rouge de la route se dessine
 * derrière le véhicule.
 *
 * Animation : GSAP + ScrollTrigger, pour un rendu identique sur Safari (qui ne
 * gère pas encore les animations CSS liées au défilement).
 *
 * Accessibilité et repli : le rendu serveur, et tout visiteur qui a demandé à
 * réduire les animations, reçoivent une simple liste verticale des étapes,
 * sans épinglage ni mouvement. Le mode horizontal n'est activé qu'ensuite,
 * côté navigateur.
 */

type Ton = "bleu" | "rouge" | "marine";

type Etape = {
  id: string;
  lieu: string;
  titre: string;
  texte: string;
  icone: LucideIcon;
  /** Animation continue du pictogramme. */
  anim: "flotte" | "roule" | "outil" | "tangue" | "lumiere" | "battement";
  /** Icône du véhicule quand il passe sur cette étape. */
  vehicule: LucideIcon;
  ton: Ton;
  repere: { valeur: string; libelle: string };
  photo?: { src: string; alt: string };
  /** La route devient mer sous cette étape. */
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
    repere: { valeur: "2 à 4 sem.", libelle: "de l'atelier à la salle" },
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
    repere: { valeur: "3 à 4 mois", libelle: "du local vide à la classe" },
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

/** Ordonnée de la route (en px, dans sa bande) à l'abscisse `x` de la frise. */
function hauteurRoute(x: number, periode: number, bande: number) {
  return bande / 2 + bande * 0.28 * Math.sin((2 * Math.PI * x) / periode);
}

export function VoyageDefilant() {
  const refSection = React.useRef<HTMLElement>(null);
  const refPiste = React.useRef<HTMLDivElement>(null);
  const refRoute = React.useRef<HTMLDivElement>(null);
  const refVehicule = React.useRef<HTMLDivElement>(null);
  const refBarre = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const section = refSection.current;
    const piste = refPiste.current;
    const route = refRoute.current;
    const vehicule = refVehicule.current;
    const barre = refBarre.current;
    if (!section || !piste || !route || !vehicule || !barre) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      section.dataset.mode = "horizontal";

      const traces = route.querySelectorAll<SVGPathElement>("path");
      const [piste_, ruban] = [traces[0], traces[1]];
      let largeur = 0;
      let periode = 0;
      let bande = 0;

      // Trace la route à la largeur réelle de la frise (recalculé au
      // redimensionnement).
      const tracer = () => {
        largeur = piste.scrollWidth;
        bande = route.clientHeight;
        periode = Math.max(window.innerWidth * 0.9, 380);
        route.querySelector("svg")?.setAttribute("viewBox", `0 0 ${largeur} ${bande}`);
        let d = `M0 ${hauteurRoute(0, periode, bande).toFixed(1)}`;
        for (let x = 16; x <= largeur; x += 16) {
          d += `L${x} ${hauteurRoute(x, periode, bande).toFixed(1)}`;
        }
        piste_?.setAttribute("d", d);
        ruban?.setAttribute("d", d);
      };
      tracer();

      const distance = () => piste.scrollWidth - window.innerWidth;
      const panneaux = gsap.utils.toArray<HTMLElement>("[data-panneau]", piste);

      const placer = (progression: number) => {
        const decalage = progression * distance();
        // Le véhicule reste à la même place à l'écran ; c'est la route qui
        // défile sous lui. On le cale sur la hauteur de la route à cet
        // endroit, avec une légère inclinaison dans les pentes.
        const xEcran = vehicule.offsetLeft + vehicule.offsetWidth / 2;
        const x = decalage + xEcran;
        const y = hauteurRoute(x, periode, bande);
        const pente = hauteurRoute(x + 8, periode, bande) - y;
        gsap.set(vehicule, {
          y: route.offsetTop + y - vehicule.offsetHeight / 2,
          rotate: Math.atan2(pente, 8) * (180 / Math.PI) * 0.6,
        });
        // Le ruban rouge se dessine jusqu'au véhicule.
        if (ruban) ruban.style.strokeDashoffset = String(1 - x / largeur);
        barre.style.transform = `scaleX(${progression})`;

        // Étape courante : celle dont le panneau est sous le véhicule.
        let courante = 0;
        panneaux.forEach((p, i) => {
          if (p.offsetLeft <= x) courante = i;
        });
        // Le premier panneau est l'ouverture : il précède l'étape 1.
        const etape = Math.max(0, courante - 1);
        setActive((a) => (a === etape ? a : etape));
      };

      const defilement = gsap.to(piste, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.6,
          start: "top top",
          // Sur téléphone, on étire la course : un coup de pouce ne doit pas
          // faire sauter plusieurs étapes d'un coup.
          end: () => `+=${distance() * (window.innerWidth < 768 ? 1.8 : 1.15)}`,
          // Aimant : à l'arrêt du défilement, la frise se cale sur l'étape la
          // plus proche plutôt que de rester entre deux.
          snap: {
            snapTo: (valeur: number) => {
              const points = panneaux.map((p) => Math.min(p.offsetLeft / distance(), 1));
              return points.reduce((a, b) => (Math.abs(b - valeur) < Math.abs(a - valeur) ? b : a));
            },
            duration: { min: 0.25, max: 0.7 },
            delay: 0.08,
            ease: "power2.inOut",
          },
          invalidateOnRefresh: true,
          onRefreshInit: tracer,
          onRefresh: (self) => placer(self.progress),
          onUpdate: (self) => placer(self.progress),
        },
      });

      // Entrée en scène de chaque étape, au fil de la frise.
      panneaux.forEach((panneau) => {
        const elements = panneau.querySelectorAll("[data-entree]");
        gsap.from(elements, {
          y: 70,
          opacity: 0,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panneau,
            containerAnimation: defilement,
            start: "left 85%",
            end: "left 35%",
            scrub: true,
          },
        });
        // Le médaillon photo glisse plus vite que le reste : profondeur.
        const medaillon = panneau.querySelector("[data-medaillon]");
        if (medaillon) {
          gsap.fromTo(
            medaillon,
            { xPercent: 45, rotate: 8 },
            {
              xPercent: -45,
              rotate: -8,
              ease: "none",
              scrollTrigger: {
                trigger: panneau,
                containerAnimation: defilement,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
        // Le grand chiffre-repère, en fond, glisse à contresens.
        const repere = panneau.querySelector("[data-repere]");
        if (repere) {
          gsap.fromTo(
            repere,
            { xPercent: -25 },
            {
              xPercent: 25,
              ease: "none",
              scrollTrigger: {
                trigger: panneau,
                containerAnimation: defilement,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
      });

      return () => {
        delete section.dataset.mode;
      };
    });

    return () => mm.revert();
  }, []);

  const Vehicule = etapes[active]?.vehicule ?? Monitor;

  return (
    <section
      ref={refSection}
      aria-labelledby="titre-voyage"
      className="group/voyage bg-fond relative overflow-hidden data-[mode=horizontal]:h-svh"
    >
      {/* Barre de progression, sous l'en-tête. */}
      <div className="absolute inset-x-0 top-16 z-20 hidden h-1 bg-transparent group-data-[mode=horizontal]/voyage:block md:top-20">
        <div ref={refBarre} className="bg-rouge-vif h-full origin-left scale-x-0" />
      </div>

      <div
        ref={refPiste}
        className="relative flex flex-col group-data-[mode=horizontal]/voyage:h-full group-data-[mode=horizontal]/voyage:w-max group-data-[mode=horizontal]/voyage:flex-row group-data-[mode=horizontal]/voyage:will-change-transform"
      >
        {/* Route : une bande en bas de la frise, sur toute sa longueur. */}
        <div
          ref={refRoute}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[7%] z-10 hidden h-24 group-data-[mode=horizontal]/voyage:block md:h-32"
        >
          <svg focusable="false" preserveAspectRatio="none" className="size-full">
            <path
              fill="none"
              stroke="var(--color-bordure)"
              strokeWidth="5"
              strokeDasharray="2 14"
              strokeLinecap="round"
            />
            <path
              fill="none"
              stroke="var(--color-rouge-vif)"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </svg>
        </div>

        {/* Panneau d'ouverture. */}
        <div
          data-panneau
          className="contenu flex flex-col justify-center py-16 group-data-[mode=horizontal]/voyage:h-full group-data-[mode=horizontal]/voyage:w-[88vw] group-data-[mode=horizontal]/voyage:max-w-none group-data-[mode=horizontal]/voyage:shrink-0 group-data-[mode=horizontal]/voyage:pt-24 group-data-[mode=horizontal]/voyage:pb-40 md:py-24 md:group-data-[mode=horizontal]/voyage:w-[62vw] md:group-data-[mode=horizontal]/voyage:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]"
        >
          <p className="text-rouge mb-3 inline-flex items-center gap-2 text-sm font-extrabold tracking-[0.14em] uppercase">
            <span className="bg-rouge-vif inline-block h-2 w-6 rounded-full" aria-hidden="true" />
            Le voyage d&apos;un don
          </p>
          <h2 id="titre-voyage" className="max-w-xl text-4xl font-bold md:text-6xl">
            De votre bureau à une salle de classe
          </h2>
          <p className="text-doux mt-5 max-w-lg text-lg leading-relaxed">
            Suivez le trajet d&apos;un ordinateur dont vous n&apos;avez plus l&apos;usage. Vous
            n&apos;avez rien à organiser : nous prenons tout en charge.
          </p>
          <p className="text-marine mt-8 hidden items-center gap-3 font-bold group-data-[mode=horizontal]/voyage:inline-flex">
            <span className="indice-defilement bg-marine inline-flex size-9 items-center justify-center rounded-full text-white">
              <ArrowRight className="size-4 rotate-90" aria-hidden="true" />
            </span>
            Faites défiler pour suivre le voyage
          </p>
        </div>

        <ol className="contents">
          {etapes.map((etape, index) => (
            <li
              key={etape.id}
              data-panneau
              className={cn(
                "relative isolate flex items-center py-14 md:py-20",
                "group-data-[mode=horizontal]/voyage:h-full group-data-[mode=horizontal]/voyage:w-screen group-data-[mode=horizontal]/voyage:shrink-0 group-data-[mode=horizontal]/voyage:pt-24 group-data-[mode=horizontal]/voyage:pb-40 md:group-data-[mode=horizontal]/voyage:pt-28 md:group-data-[mode=horizontal]/voyage:pb-48",
              )}
            >
              {etape.mer ? <Mer /> : null}

              {/* Chiffre-repère géant, en filigrane. */}
              <p
                data-repere
                aria-hidden="true"
                className={cn(
                  "font-titre pointer-events-none absolute top-[14%] right-[4%] -z-10 text-[5.5rem] leading-none font-bold whitespace-nowrap opacity-[0.08] select-none md:top-[16%] md:text-[13rem]",
                  textes[etape.ton],
                )}
              >
                {etape.repere.valeur}
              </p>

              <div className="contenu grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
                {/* Visuel : pictogramme animé + médaillon photo. */}
                <div data-entree className="relative mx-auto flex w-fit items-center md:mx-0">
                  <span
                    className={cn(
                      "relative flex size-28 items-center justify-center rounded-full text-white shadow-[0_24px_48px_-20px_rgba(22,35,63,0.55)] md:size-52",
                      fonds[etape.ton],
                    )}
                  >
                    <span
                      className={cn("absolute inset-0 rounded-full", `halo-${etape.ton}`)}
                      aria-hidden="true"
                    />
                    <etape.icone
                      className={cn("relative size-12 md:size-24", `picto-${etape.anim}`)}
                      aria-hidden="true"
                    />
                  </span>
                  {etape.photo ? (
                    <span
                      data-medaillon
                      className="ring-fond relative -ml-6 size-24 overflow-hidden rounded-full shadow-xl ring-8 md:-ml-12 md:size-44"
                    >
                      <Image
                        src={etape.photo.src}
                        alt={etape.photo.alt}
                        fill
                        sizes="(min-width: 768px) 176px, 96px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                </div>

                {/* Texte. */}
                <div className="max-w-xl">
                  <p
                    data-entree
                    className="text-rouge mb-2 text-xs font-extrabold tracking-[0.14em] uppercase md:text-sm"
                  >
                    Étape {index + 1} · {etape.lieu}
                  </p>
                  <h3 data-entree className="text-[1.7rem] leading-tight font-bold md:text-5xl">
                    {etape.titre}
                  </h3>
                  <p data-entree className="text-doux mt-3 leading-relaxed md:mt-4 md:text-lg">
                    {etape.texte}
                  </p>
                  <p data-entree className="mt-4 flex items-baseline gap-3 md:mt-6">
                    <span
                      className={cn("font-titre text-3xl font-bold md:text-4xl", textes[etape.ton])}
                    >
                      {etape.repere.valeur}
                    </span>
                    <span className="text-doux text-sm font-semibold">{etape.repere.libelle}</span>
                  </p>
                  {etape.action ? (
                    <div data-entree className="mt-6 md:mt-8">
                      {etape.action}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Le véhicule : le don lui-même, qui change de forme en chemin. */}
      <div
        ref={refVehicule}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-[12%] z-20 hidden group-data-[mode=horizontal]/voyage:block md:left-[18%]"
      >
        <span
          key={active}
          className={cn(
            "vehicule-arrivee flex size-14 items-center justify-center rounded-full bg-white shadow-[0_12px_30px_-8px_rgba(22,35,63,0.5)] ring-4 md:size-20",
            etapes[active]?.ton === "rouge"
              ? "text-rouge-vif ring-rouge-vif/30"
              : etapes[active]?.ton === "marine"
                ? "text-marine ring-marine/25"
                : "text-bleu-vif ring-bleu-vif/30",
          )}
        >
          <Vehicule className="size-7 md:size-10" />
        </span>
      </div>

      {/* Pastilles de progression. */}
      <ol
        aria-hidden="true"
        className="absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 gap-2 group-data-[mode=horizontal]/voyage:flex"
      >
        {etapes.map((etape, index) => (
          <li
            key={etape.id}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === active ? "bg-rouge-vif w-7" : "bg-bordure w-2",
            )}
          />
        ))}
      </ol>
    </section>
  );
}

/** Bande de mer animée, sous la route, pour la traversée vers le Congo. */
function Mer() {
  return (
    <div
      aria-hidden="true"
      className="mer pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-[30%] group-data-[mode=horizontal]/voyage:block"
    />
  );
}
