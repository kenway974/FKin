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
