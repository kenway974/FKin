import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * « Le voyage d'un don » : le parcours du matériel raconté comme un trajet.
 *
 * Une route en courbe — le ruban rouge du héros — descend la page et relie
 * les étapes. Chaque tronçon se dessine au défilement (tracé SVG animé par
 * `animation-timeline`, sans JavaScript) ; les navigateurs qui ne gèrent pas
 * encore ces animations affichent la route entière, déjà tracée.
 *
 * Mise en page :
 *   - grand écran : trois colonnes, la route au centre, les étapes alternent
 *     à gauche et à droite, un chiffre-repère occupe le côté opposé ;
 *   - téléphone : la route longe le bord gauche, les étapes à sa droite.
 */

type Ton = "bleu" | "rouge" | "marine";

const fondsPastille: Record<Ton, string> = {
  bleu: "bg-bleu-vif",
  rouge: "bg-rouge-vif",
  marine: "bg-marine",
};

const textesRepere: Record<Ton, string> = {
  bleu: "text-bleu",
  rouge: "text-rouge",
  marine: "text-marine",
};

/** Pastille ronde posée sur la route. */
function Pastille({ icone: Icone, ton }: { icone: LucideIcon; ton: Ton }) {
  return (
    <span
      className={cn(
        "anim-pastille ring-fond relative z-10 flex size-14 items-center justify-center rounded-full text-white shadow-lg ring-8 md:size-20",
        fondsPastille[ton],
      )}
    >
      <Icone className="size-6 md:size-9" aria-hidden="true" />
    </span>
  );
}

/** Une étape du voyage. */
export function Etape({
  numero,
  lieu,
  titre,
  icone,
  ton,
  cote,
  repere,
  action,
  children,
}: {
  numero: number;
  /** Où en est le matériel : « Chez vous », « Sur la route »… */
  lieu: string;
  titre: string;
  icone: LucideIcon;
  ton: Ton;
  /** Côté du texte sur grand écran. */
  cote: "gauche" | "droite";
  /** Chiffre-repère affiché en grand du côté opposé (grand écran). */
  repere?: { valeur: string; libelle: string };
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const texte = (
    <div className="forme-coeur border-bordure parallaxe-vue border bg-white p-6 shadow-[0_18px_40px_-28px_rgba(22,35,63,0.35)] [--parallaxe:1rem] md:p-8">
      <p className="text-rouge mb-2 text-xs font-extrabold tracking-[0.14em] uppercase">
        Étape {numero} · {lieu}
      </p>
      <h3 className="text-2xl font-semibold md:text-[1.7rem]">{titre}</h3>
      <div className="text-doux mt-3 space-y-2 leading-relaxed">{children}</div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );

  const chiffre = repere ? (
    <div
      className={cn(
        "parallaxe-vue hidden [--parallaxe:2.5rem] md:block",
        cote === "gauche" ? "text-left" : "text-right",
      )}
      aria-hidden="true"
    >
      <p className={cn("font-titre text-6xl font-bold lg:text-7xl", textesRepere[ton])}>
        {repere.valeur}
      </p>
      <p className="text-doux mt-1 font-semibold">{repere.libelle}</p>
    </div>
  ) : (
    <div className="hidden md:block" />
  );

  return (
    <li className="grid grid-cols-[3.5rem_1fr] items-center gap-x-4 md:grid-cols-[1fr_6rem_1fr] md:gap-x-8">
      <div className="flex justify-center md:order-2">
        <Pastille icone={icone} ton={ton} />
      </div>
      <div className={cn(cote === "gauche" ? "md:order-1" : "md:order-3")}>{texte}</div>
      <div className={cn(cote === "gauche" ? "md:order-3" : "md:order-1")}>{chiffre}</div>
    </li>
  );
}

/**
 * Tronçon de route entre deux étapes : une courbe en S qui s'écarte d'un
 * côté puis revient au centre. `sens` alterne pour que la route serpente.
 */
export function Troncon({ sens = "droite" }: { sens?: "droite" | "gauche" }) {
  const inverse = sens === "gauche";
  return (
    <li aria-hidden="true" className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[1fr_6rem_1fr]">
      {/* Téléphone : petite oscillation le long du bord gauche. */}
      <svg
        viewBox="0 0 56 120"
        preserveAspectRatio="none"
        className="troncon h-24 w-14 md:hidden"
        focusable="false"
      >
        <Trace
          d={
            inverse ? "M28 0C28 30 8 40 8 60S28 90 28 120" : "M28 0C28 30 48 40 48 60S28 90 28 120"
          }
        />
      </svg>

      {/* Grand écran : large courbe centrée sur la colonne de la route. */}
      <div className="relative hidden h-40 md:col-start-2 md:block">
        <svg
          viewBox="0 0 240 160"
          preserveAspectRatio="none"
          className="troncon absolute top-0 left-1/2 h-full w-60 -translate-x-1/2"
          focusable="false"
        >
          <Trace
            d={
              inverse
                ? "M120 0C120 55 20 45 20 80S120 105 120 160"
                : "M120 0C120 55 220 45 220 80S120 105 120 160"
            }
          />
        </svg>
      </div>
    </li>
  );
}

/** Tracé double : la piste pâle en pointillés, et le ruban rouge qui se dessine. */
function Trace({ d }: { d: string }) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="var(--color-bordure)"
        strokeWidth="4"
        strokeDasharray="2 10"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke="var(--color-rouge-vif)"
        strokeWidth="6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="trace-dessin"
      />
    </>
  );
}

/**
 * Bifurcation : la route se sépare en deux destinations, puis se rejoint.
 * `gauche` et `droite` sont les deux cartes de destination.
 */
export function Bifurcation({
  gauche,
  droite,
  apres,
}: {
  gauche: React.ReactNode;
  droite: React.ReactNode;
  /** Contenu centré sous les deux destinations (délais, action…). */
  apres?: React.ReactNode;
}) {
  return (
    <li className="relative py-6 md:py-2">
      {/* Téléphone : la route continue, tout droit, le long du bord gauche. */}
      <span
        aria-hidden="true"
        className="border-bordure absolute top-0 bottom-0 left-7 -translate-x-1/2 border-l-4 border-dotted md:hidden"
      />
      {/* Grand écran : la route se divise en Y au-dessus des deux cartes. */}
      <svg
        viewBox="0 0 800 120"
        preserveAspectRatio="none"
        className="troncon hidden h-28 w-full md:block"
        aria-hidden="true"
        focusable="false"
      >
        <Trace d="M400 0C400 60 200 50 200 120" />
        <Trace d="M400 0C400 60 600 50 600 120" />
      </svg>
      <div className="relative grid gap-5 pl-[4.5rem] md:grid-cols-2 md:gap-8 md:pl-0">
        {gauche}
        {droite}
      </div>
      {apres ? <div className="mt-8 pl-[4.5rem] md:pl-0">{apres}</div> : null}
      {/* Et la route se rejoint au centre. */}
      <svg
        viewBox="0 0 800 120"
        preserveAspectRatio="none"
        className="troncon mt-6 hidden h-28 w-full md:block"
        aria-hidden="true"
        focusable="false"
      >
        <Trace d="M200 0C200 70 400 60 400 120" />
        <Trace d="M600 0C600 70 400 60 400 120" />
      </svg>
    </li>
  );
}

/** Carte d'une destination, dans la bifurcation. */
export function Destination({
  pays,
  titre,
  delai,
  icone: Icone,
  ton,
  children,
}: {
  pays: string;
  titre: string;
  delai: string;
  icone: LucideIcon;
  ton: "bleu" | "rouge";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "parallaxe-vue relative isolate overflow-hidden p-7 text-white md:p-9",
        ton === "bleu"
          ? "forme-coeur from-bleu-vif to-bleu-fonce bg-linear-to-br [--parallaxe:1rem] md:[--parallaxe:0.75rem]"
          : "forme-coeur-inverse from-rouge-vif to-rouge-fonce bg-linear-to-br [--parallaxe:1rem] md:[--parallaxe:2.25rem]",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-white/15">
          <Icone className="size-6" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">{delai}</span>
      </div>
      <p className="mt-6 text-sm font-extrabold tracking-[0.14em] text-white/80 uppercase">
        {pays}
      </p>
      <h3 className="mt-1 text-2xl font-semibold md:text-3xl">{titre}</h3>
      <div className="mt-3 leading-relaxed text-white/90">{children}</div>
    </div>
  );
}
