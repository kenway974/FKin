import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Coeur, TRACE_COEUR, Vague } from "@/components/formes";

/**
 * Bannières et rubans, aux formes et aux couleurs du logo.
 */

/**
 * Bannière principale de la page d'accueil.
 *
 * Un plein écran marine, traversé par une vague bleue bordée d'un ruban rouge
 * et d'un liseré blanc — les trois pages du cœur du logo. Le sujet détouré
 * (`sujet`, en général une vidéo sans fond) se tient debout sur la vague, les
 * jambes coupées par le bas de l'écran.
 *
 * Proportions : la vague et le sujet forment une seule « scène », dont la
 * taille découle de la **hauteur** de l'écran. Sur grand écran, la scène a le
 * format fixe de son dessin (12:7), collée en bas à droite ; le sujet y est
 * toujours cadré de la même façon (tête à 14 % du haut, jambes coupées par
 * le bas de l'écran), centré au même endroit de la vague. Le rapport
 * entre la vague, les enfants et le titre reste donc le même d'un portable
 * 13 pouces à un écran 27 pouces. Sur téléphone et tablette, la scène passe
 * sous le texte et occupe le bas de l'écran.
 *
 * Le texte est réduit à l'essentiel : un titre et deux actions. Tout le
 * reste du discours est porté par les sections suivantes.
 */
export function BanniereAccueil({
  sujet,
  children,
}: {
  sujet: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    // Plein écran : toute la largeur, toute la hauteur visible sous l'en-tête
    // (4 rem sur mobile, 5 rem au-delà). `svh` plutôt que `vh` : sur mobile,
    // la hauteur ne saute pas quand la barre d'adresse se replie.
    <section className="bg-marine relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden md:min-h-[calc(100svh-5rem)] lg:block">
      <div
        className="from-marine-fonce via-marine to-marine-clair absolute inset-0 -z-20 bg-linear-to-br"
        aria-hidden="true"
      />

      <div className="contenu relative z-10 pt-8 pb-12 text-white sm:pt-14 sm:pb-16 lg:flex lg:min-h-[inherit] lg:items-center lg:py-16">
        {/* Le texte descend un peu moins vite que la page : premier plan de
            lecture, il reste en vue un instant de plus. */}
        <div className="parallaxe [--parallaxe:3rem] lg:max-w-[min(38rem,44vw)]">{children}</div>
      </div>

      {/* Scène : vague + sujet, dimensionnés ensemble. */}
      <div className="relative min-h-72 w-full flex-1 lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:aspect-[12/7] lg:h-[86%] lg:w-auto xl:h-full">
        {/* Trois plans, trois vitesses : la vague traîne derrière, le sujet
            remonte vers le lecteur. */}
        <div className="parallaxe absolute inset-0 [--parallaxe:4.5rem]">
          <VagueScene />
        </div>
        {/* Le sujet est plus grand que la scène : ses jambes sont coupées
            par le bas de l'écran, comme un cadrage photo. Il remonte au
            défilement sans jamais laisser de vide sous lui. */}
        <div className="absolute top-[6%] left-1/2 h-[118%] -translate-x-1/2 lg:top-[14%] lg:left-[76%] lg:h-[110%]">
          <div className="parallaxe h-full [--parallaxe:-3rem]">{sujet}</div>
        </div>
      </div>
    </section>
  );
}

/**
 * Décor de la scène : deux compositions, une par format, pour que la vague
 * passe toujours **sous les pieds** du sujet. Chacune est dessinée dans le
 * repère de la scène, si bien qu'elle grandit exactement comme le sujet.
 */
function VagueScene() {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      {/* Portrait (téléphone, tablette) : la vague déborde juste au-dessus de la
          scène pour que le ruban passe derrière les têtes. */}
      <svg
        viewBox="0 0 400 520"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[calc(100%+2rem)] w-full lg:hidden"
        focusable="false"
      >
        <defs>
          <linearGradient id="vague-bleue-p" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#42b0e3" />
            <stop offset="1" stopColor="#0474a8" />
          </linearGradient>
          <radialGradient id="halo-p" cx="0.5" cy="0.62" r="0.45">
            <stop offset="0" stopColor="#8fd3f4" stopOpacity="0.55" />
            <stop offset="1" stopColor="#8fd3f4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M0 520V118C120 52 260 92 400 22V520Z" fill="url(#vague-bleue-p)" />
        <rect width="400" height="520" fill="url(#halo-p)" />
        <path
          d="M-20 110C110 38 255 80 420 8"
          fill="none"
          stroke="#ef433f"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M-20 90C110 18 255 60 420 -12"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.85"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* Paysage (ordinateur) : format fixe 12:7, identique à la scène. */}
      <svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        className="absolute inset-0 hidden size-full lg:block"
        focusable="false"
      >
        <defs>
          <linearGradient id="vague-bleue-l" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#42b0e3" />
            <stop offset="0.55" stopColor="#0495d4" />
            <stop offset="1" stopColor="#055a82" />
          </linearGradient>
          <radialGradient id="halo-l" cx="0.76" cy="0.6" r="0.3">
            <stop offset="0" stopColor="#8fd3f4" stopOpacity="0.5" />
            <stop offset="1" stopColor="#8fd3f4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M540 700C575 505 690 365 885 290S1155 160 1200 30V700Z"
          fill="url(#vague-bleue-l)"
        />
        <path d="M540 700C575 505 690 365 885 290S1155 160 1200 30V700Z" fill="url(#halo-l)" />
        <path
          d="M500 740C540 505 665 345 865 268S1135 140 1215 0"
          fill="none"
          stroke="#ef433f"
          strokeWidth="34"
          strokeLinecap="round"
        />
        <path
          d="M462 740C505 490 630 322 838 242S1105 108 1190 -30"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.85"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Bannière d'en-tête des pages intérieures : plus compacte, en aplat de
 * couleur, terminée par une vague qui ouvre sur le contenu de la page.
 */
export function BannierePage({
  surtitre,
  titre,
  chapo,
  ton = "marine",
  photo,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
  ton?: "rouge" | "bleu" | "marine";
  photo?: string | null;
}) {
  const tons = {
    rouge: "from-rouge-fonce via-rouge to-rouge-vif",
    bleu: "from-bleu-fonce via-bleu to-bleu-vif",
    marine: "from-marine-fonce via-marine to-marine-clair",
  } as const;

  return (
    <section className="relative isolate overflow-hidden">
      <div className={cn("absolute inset-0 -z-20 bg-linear-to-br", tons[ton])} aria-hidden="true" />

      {photo ? (
        <>
          <Image src={photo} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="voile-banniere absolute inset-0 -z-10" aria-hidden="true" />
        </>
      ) : (
        <Coeur className="right-16 bottom-20 -z-10 hidden w-56 -rotate-12 text-white/10 md:block lg:right-28 lg:w-72" />
      )}

      <div className="contenu relative pt-14 pb-20 text-white md:pt-20 md:pb-28">
        <div className="parallaxe max-w-3xl [--parallaxe:2rem]">
          {surtitre ? (
            <p className="anim-entree mb-4 inline-flex items-center gap-2 text-sm font-bold tracking-[0.14em] uppercase">
              <span
                className="bg-rouge-clair inline-block size-2.5 rounded-full"
                aria-hidden="true"
              />
              {surtitre}
            </p>
          ) : null}
          <h1 className="anim-entree anim-retard-1 text-4xl font-bold md:text-6xl">{titre}</h1>
          {chapo ? (
            <p className="anim-entree anim-retard-2 mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
              {chapo}
            </p>
          ) : null}
        </div>
      </div>

      <Vague className="text-fond absolute inset-x-0 -bottom-px" retourne />
    </section>
  );
}

/**
 * Ruban défilant de faits marquants.
 *
 * Le contenu est dupliqué pour que la boucle soit continue ; l'ensemble est
 * `aria-hidden` car ces mentions figurent déjà, en clair, dans les sections
 * de la page. Le défilement se met en pause au survol, et l'animation est
 * neutralisée si le visiteur a demandé à réduire les animations.
 */
export function RubanDefilant({ mentions }: { mentions: readonly string[] }) {
  const piste = [...mentions, ...mentions];

  return (
    <div aria-hidden="true">
      <div className="ruban-piste bg-rouge relative flex overflow-hidden py-3.5 text-white">
        <div className="ruban-defilant flex shrink-0 items-center gap-8 pr-8 whitespace-nowrap">
          {piste.map((mention, index) => (
            <span key={index} className="flex items-center gap-8 text-sm font-bold tracking-wide">
              {mention}
              <svg viewBox="0 0 100 92" className="size-3.5 shrink-0 text-white/70">
                <path d={TRACE_COEUR} fill="currentColor" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Petit bandeau coloré, pour attirer l'œil au milieu d'une page. */
export function BandeauAccent({
  ton = "bleu",
  className,
  children,
}: {
  ton?: "rouge" | "bleu" | "marine";
  className?: string;
  children: React.ReactNode;
}) {
  const tons = {
    rouge: "bg-rouge-voile text-encre [--puce:var(--color-rouge-vif)]",
    bleu: "bg-bleu-voile text-encre [--puce:var(--color-bleu-vif)]",
    marine: "bg-marine text-white [--puce:var(--color-rouge-clair)]",
  } as const;

  return (
    <div
      className={cn(
        "forme-coeur relative overflow-hidden p-6 pl-16 md:p-7 md:pl-20",
        tons[ton],
        className,
      )}
    >
      <svg
        viewBox="0 0 100 92"
        className="absolute top-6 left-6 size-7 md:top-7 md:left-7 md:size-8"
        aria-hidden="true"
      >
        <path d={TRACE_COEUR} fill="var(--puce)" />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
