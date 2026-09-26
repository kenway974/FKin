import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Formes décoratives tirées du logo Respusse.
 *
 * Le logo est un livre ouvert dont les pages dessinent un cœur : tout le
 * vocabulaire graphique du site en découle. Ces composants sont purement
 * décoratifs (masqués aux technologies d'assistance) et colorés par
 * `currentColor`, ce qui permet de les teinter avec une simple classe
 * `text-*` depuis la page qui les pose.
 */

/** Tracé du cœur, repris des pages du livre. */
export const TRACE_COEUR =
  "M50 88C22 68 3 50 3 28 3 13 15 3 29 3c9 0 17 5 21 13 4-8 12-13 21-13 14 0 26 10 26 25 0 22-19 40-47 60Z";

/**
 * Cœur plein, en filigrane derrière un bloc. Il glisse légèrement au
 * défilement (parallaxe), ce qui donne de la profondeur aux sections.
 */
export function Coeur({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 92"
      className={cn("parallaxe-vue pointer-events-none absolute [--parallaxe:3.5rem]", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d={TRACE_COEUR} fill="currentColor" />
    </svg>
  );
}

/**
 * Séparation en vague entre deux sections.
 *
 * À placer en tête (ou en pied, avec `retourne`) d'une section : la vague
 * prend la couleur de la section **voisine**, si bien que les deux fonds
 * semblent s'emboîter comme deux pages d'un livre.
 */
export function Vague({ className, retourne = false }: { className?: string; retourne?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none block h-10 w-full md:h-16",
        retourne && "rotate-180",
        className,
      )}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 0h1440v34c-120 30-260 52-420 44S740 30 560 26 240 60 0 50Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Bord de vague animé, pour le haut ou le bas d'une bande pleine largeur.
 *
 * La vague dessine la couleur de la section **voisine** (`className` :
 * `text-*`), si bien que la bande semble découpée en vague. Le tracé est
 * deux fois plus large que l'écran et se répète à l'identique sur chaque
 * moitié : en le faisant glisser d'une moitié (transform seul, calculé par la
 * carte graphique), la houle défile sans fin et sans raccord visible. Deux
 * épaisseurs à des vitesses différentes donnent de la profondeur.
 */
export function OndeBord({
  className,
  position = "haut",
}: {
  className?: string;
  position?: "haut" | "bas";
}) {
  // Deux périodes identiques de 1440 unités : la seconde prolonge la première.
  const trace = "M0 34C240 4 480 4 720 34S1200 64 1440 34S1920 4 2160 34S2640 64 2880 34V0H0Z";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 h-12 overflow-hidden md:h-20",
        position === "haut" ? "-top-px" : "-bottom-px rotate-180",
        className,
      )}
    >
      <svg
        viewBox="0 0 2880 70"
        preserveAspectRatio="none"
        className="onde onde-lente absolute inset-y-0 left-0 h-full opacity-35"
        focusable="false"
      >
        <path d={trace} fill="currentColor" transform="translate(0 10)" />
      </svg>
      <svg
        viewBox="0 0 2880 70"
        preserveAspectRatio="none"
        className="onde absolute inset-y-0 left-0 h-full"
        focusable="false"
      >
        <path d={trace} fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * Forme souple, tirée des courbes du cœur : une tache irrégulière qui tourne
 * et respire lentement. Sert de fond à un pictogramme, à un chiffre, ou de
 * décor flottant dans une bande de couleur.
 */
export function Blob({
  className,
  teinte = "bg-white/10",
  variante = 1,
  children,
}: {
  className?: string;
  /** Couleur de la forme (classe `bg-*`), indépendante de celle du contenu. */
  teinte?: string;
  /** Trois silhouettes différentes, pour ne jamais répéter la même. */
  variante?: 1 | 2 | 3;
  children?: ReactNode;
}) {
  return (
    <span className={cn("relative isolate inline-grid place-items-center", className)}>
      <span
        aria-hidden="true"
        className={cn("blob-anime absolute inset-0 -z-10", teinte, `forme-blob-${variante}`)}
      />
      {children}
    </span>
  );
}
