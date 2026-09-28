"use client";

import * as React from "react";
import Image from "next/image";
import { Vague } from "@/components/formes";

/**
 * Écran d'ouverture du site : le logo au centre d'un écran blanc, la France
 * (bleu-blanc-rouge) et la RD Congo (aux couleurs de son drapeau) qui
 * tournent autour de lui puis se rejoignent en son centre ; le rideau blanc
 * remonte alors, bord en vague, et découvre la page.
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

      <div className="intro-scene">
        {/* Orbite : les deux cartes tournent autour du logo, puis le
            rejoignent au centre. Chaque carte tourne en sens inverse de
            l'orbite pour rester droite. */}
        <div className="intro-orbite">
          <div className="intro-bras">
            <div className="intro-rayon">
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
          <div className="intro-bras rotate-180">
            <div className="intro-rayon">
              <div className="-rotate-180">
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
          </div>
        </div>

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

/**
 * Exécuté avant le premier affichage : décide si l'ouverture doit se jouer
 * (première page de la visite, animations autorisées) et le note.
 */
export const SCRIPT_INTRO = `(function(){var h=document.documentElement;try{if(sessionStorage.getItem("intro-vue")||matchMedia("(prefers-reduced-motion: reduce)").matches){h.classList.add("intro-vue");return}sessionStorage.setItem("intro-vue","1")}catch(e){}h.classList.add("intro-en-cours")})();`;
