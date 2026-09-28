"use client";

import * as React from "react";
import Image from "next/image";
import { Laptop, Monitor, Printer, Smartphone, Tablet } from "lucide-react";
import { Vague } from "@/components/formes";
import { cn } from "@/lib/utils";

/**
 * Écran d'ouverture du site : le logo au centre d'un écran blanc, la France
 * (bleu-blanc-rouge) et la RD Congo (aux couleurs de son drapeau) qui
 * tournent autour de lui puis se rejoignent en son centre ; le rideau blanc
 * remonte alors, bord en vague, et découvre la page. Des paillettes
 * scintillent et de petits ordinateurs traversent l'écran ; une gerbe de
 * paillettes jaillit quand les deux cartes se rejoignent.
 *
 * - Une fois par visite : un petit script, exécuté avant le premier
 *   affichage (voir `SCRIPT_INTRO`), le note dans le `sessionStorage` ; les
 *   pages suivantes s'ouvrent donc instantanément.
 * - Pendant l'ouverture, les animations d'entrée de la page sont suspendues
 *   (classe `intro-en-cours` sur `<html>`) : elles démarrent quand le rideau
 *   se lève, au lieu de se jouer, invisibles, derrière lui.
 * - Un clic ou une touche écourte l'animation.
 * - Rien ne s'affiche si le visiteur a demandé à réduire les animations.
 * - Sans JavaScript, l'animation, entièrement en CSS, se joue puis s'efface
 *   d'elle-même.
 *
 * Tout est animé en `transform` uniquement, pour rester fluide sur mobile.
 */
export function Intro() {
  const reference = React.useRef<HTMLDivElement>(null);
  const [terminee, setTerminee] = React.useState(false);

  React.useEffect(() => {
    const racine = document.documentElement;
    const rideau = reference.current;
    if (!rideau || racine.classList.contains("intro-vue")) {
      setTerminee(true);
      return;
    }

    const lever = () => racine.classList.remove("intro-en-cours");
    const finir = () => {
      lever();
      setTerminee(true);
    };
    const passer = () => rideau.classList.add("intro-passee");

    const auDebut = (evenement: AnimationEvent) => {
      if (evenement.target === rideau) lever();
    };
    const aLaFin = (evenement: AnimationEvent) => {
      if (evenement.target === rideau) finir();
    };

    rideau.addEventListener("animationstart", auDebut);
    rideau.addEventListener("animationend", aLaFin);
    window.addEventListener("keydown", passer, { once: true });
    // Filet de sécurité : la page ne reste jamais masquée.
    const secours = window.setTimeout(finir, 5000);

    return () => {
      rideau.removeEventListener("animationstart", auDebut);
      rideau.removeEventListener("animationend", aLaFin);
      window.removeEventListener("keydown", passer);
      window.clearTimeout(secours);
    };
  }, []);

  if (terminee) return null;

  return (
    <div
      ref={reference}
      className="intro"
      aria-hidden="true"
      onClick={(evenement) => evenement.currentTarget.classList.add("intro-passee")}
    >
      <div className="absolute inset-0 bg-white" />
      <Vague className="absolute inset-x-0 top-full text-white" />

      {/* Décor : paillettes qui scintillent et petits ordinateurs qui
          traversent l'écran. */}
      {PAILLETTES.map((paillette, index) => (
        <Paillette
          key={index}
          className={cn("intro-paillette", paillette.couleur, paillette.taille)}
          style={{ left: paillette.x, top: paillette.y, "--delai": paillette.delai } as Style}
        />
      ))}
      {VOLS.map(({ Icone, ...vol }, index) => (
        <span
          key={index}
          className={cn("intro-vol", vol.couleur)}
          style={
            {
              left: vol.x,
              top: vol.y,
              "--dx": vol.dx,
              "--dy": vol.dy,
              "--tour": vol.tour,
              "--delai": vol.delai,
            } as Style
          }
        >
          <Icone className="size-9 md:size-14" strokeWidth={1.6} />
        </span>
      ))}

      <div className="intro-scene">
        {/* Orbite : les deux cartes tournent autour du logo ; l'orbite
            s'arrête à l'horizontale (RD Congo à droite, France à gauche) et
            les cartes glissent en miroir jusqu'au logo. Chaque carte tourne
            en sens inverse de l'orbite pour rester droite. */}
        <div className="intro-orbite">
          <div className="intro-bras">
            <div className="intro-rayon">
              <div className="intro-contre">
                <Image
                  src="/intro/rdc.svg"
                  alt=""
                  width={100}
                  height={100}
                  priority
                  unoptimized
                  className="intro-carte h-auto"
                />
              </div>
            </div>
          </div>
          <div className="intro-bras rotate-180">
            <div className="intro-rayon">
              <div className="-rotate-180">
                <div className="intro-contre">
                  <Image
                    src="/intro/france.svg"
                    alt=""
                    width={100}
                    height={100}
                    priority
                    unoptimized
                    className="intro-carte h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gerbe de paillettes au moment où les cartes se rejoignent. */}
        {ECLATS.map((eclat, index) => (
          <Paillette
            key={index}
            className={cn("intro-eclat", eclat.couleur)}
            style={{ "--angle": eclat.angle, "--portee": eclat.portee } as Style}
          />
        ))}

        <div className="intro-battement">
          <div className="intro-logo">
            <Image
              src="/marque/respusse-icone.png"
              alt=""
              width={576}
              height={421}
              priority
              sizes="176px"
              className="h-auto w-28 md:w-44"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type Style = React.CSSProperties & Record<`--${string}`, string>;

/** Paillette à quatre branches. */
function Paillette({ className, style }: { className?: string; style?: Style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M12 0c1 7 4 11 12 12-8 1-11 5-12 12-1-7-4-11-12-12 8-1 11-5 12-12Z" />
    </svg>
  );
}

/** Paillettes du décor : position, couleur, taille, moment d'apparition. */
const PAILLETTES = [
  { x: "14%", y: "18%", couleur: "text-bleu-vif", taille: "size-5 md:size-8", delai: "0.1s" },
  { x: "82%", y: "14%", couleur: "text-rouge-vif", taille: "size-4 md:size-7", delai: "0.5s" },
  { x: "70%", y: "30%", couleur: "text-marine", taille: "size-3 md:size-6", delai: "0.9s" },
  { x: "22%", y: "72%", couleur: "text-rouge-vif", taille: "size-5 md:size-8", delai: "0.3s" },
  { x: "88%", y: "64%", couleur: "text-bleu-vif", taille: "size-4 md:size-7", delai: "0.7s" },
  { x: "8%", y: "46%", couleur: "text-marine", taille: "size-3 md:size-6", delai: "1.1s" },
  { x: "58%", y: "86%", couleur: "text-bleu-vif", taille: "size-4 md:size-6", delai: "0.2s" },
  { x: "36%", y: "10%", couleur: "text-rouge-vif", taille: "size-3 md:size-6", delai: "0.8s" },
  { x: "40%", y: "80%", couleur: "text-marine", taille: "size-4 md:size-7", delai: "1.3s" },
  { x: "92%", y: "40%", couleur: "text-rouge-vif", taille: "size-3 md:size-5", delai: "0.4s" },
];

/** Petits ordinateurs qui traversent l'écran : départ, trajet, rotation. */
const VOLS = [
  {
    Icone: Laptop,
    x: "6%",
    y: "20%",
    dx: "28vw",
    dy: "-12vh",
    tour: "-14deg",
    delai: "0.1s",
    couleur: "text-bleu",
  },
  {
    Icone: Monitor,
    x: "84%",
    y: "76%",
    dx: "-26vw",
    dy: "-14vh",
    tour: "12deg",
    delai: "0.35s",
    couleur: "text-rouge",
  },
  {
    Icone: Tablet,
    x: "78%",
    y: "18%",
    dx: "-22vw",
    dy: "16vh",
    tour: "18deg",
    delai: "0.6s",
    couleur: "text-marine",
  },
  {
    Icone: Laptop,
    x: "12%",
    y: "78%",
    dx: "24vw",
    dy: "-16vh",
    tour: "10deg",
    delai: "0.5s",
    couleur: "text-rouge",
  },
  {
    Icone: Smartphone,
    x: "46%",
    y: "8%",
    dx: "18vw",
    dy: "10vh",
    tour: "-20deg",
    delai: "0.8s",
    couleur: "text-bleu",
  },
  {
    Icone: Printer,
    x: "50%",
    y: "88%",
    dx: "-20vw",
    dy: "-8vh",
    tour: "8deg",
    delai: "0.2s",
    couleur: "text-marine",
  },
];

/** Gerbe finale : douze paillettes projetées en étoile, en symétrie. */
const ECLATS = Array.from({ length: 12 }, (_, index) => ({
  angle: `${index * 30}deg`,
  portee: index % 2 ? "min(7rem, 22vw)" : "min(12rem, 36vw)",
  couleur: ["text-bleu-vif", "text-rouge-vif", "text-marine"][index % 3],
}));

/**
 * Exécuté avant le premier affichage : décide si l'ouverture doit se jouer
 * (première page de la visite, animations autorisées) et le note.
 */
export const SCRIPT_INTRO = `(function(){var h=document.documentElement;try{if(sessionStorage.getItem("intro-vue")||matchMedia("(prefers-reduced-motion: reduce)").matches){h.classList.add("intro-vue");return}sessionStorage.setItem("intro-vue","1")}catch(e){}h.classList.add("intro-en-cours")})();`;
