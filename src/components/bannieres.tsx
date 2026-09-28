import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { OndeBord, TRACE_COEUR } from "@/components/formes";

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
    // Plein écran : toute la largeur, toute la hauteur visible. `svh` plutôt
    // que `vh` : sur mobile, la hauteur ne saute pas quand la barre d'adresse
    // se replie.
    //
    // Le héros remonte sous l'en-tête (marge négative de sa hauteur) : sur
    // l'accueil, l'en-tête est translucide et se fond dans le marine.
    <section
      data-banniere-sombre=""
      className="bg-marine relative isolate -mt-16 flex min-h-svh flex-col overflow-hidden pt-16 md:-mt-20 md:pt-20 lg:block"
    >
      <div
        className="from-marine-fonce via-marine to-marine-clair absolute inset-0 -z-20 bg-linear-to-br"
        aria-hidden="true"
      />

      {/* À partir de 1280 px, le texte est ancré à gauche (6 % du bord) plutôt
          que centré : sur les écrans larges, une colonne centrée glisserait
          vers la droite, jusque sous le ruban. */}
      <div className="contenu relative z-10 pt-6 pb-10 text-white min-[380px]:pt-8 min-[380px]:pb-12 sm:pt-14 sm:pb-16 lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center lg:py-16 xl:mx-0 xl:max-w-none xl:pl-[6vw]">
        {/* Le texte descend un peu moins vite que la page : premier plan de
            lecture, il reste en vue un instant de plus. */}
        <div className="parallaxe [--parallaxe:3rem] lg:max-w-[min(38rem,44vw)]">{children}</div>
      </div>

      {/* Scène : vague + sujet, dimensionnés ensemble. */}
      <div className="relative min-h-72 w-full flex-1 lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:aspect-[12/7] lg:h-[82%] lg:w-auto xl:h-full">
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
  // Chaque format est découpé en deux calques superposés, dans le même
  // repère : la vague (fond + halo), puis le ruban (rouge + liseré blanc).
  // Leur entrée au chargement n'est qu'un glissement (`transform`, classes
  // .vague-heros et .ruban-heros) : aucun recalcul de dessin, donc aucune
  // saccade, même pendant que la page finit de charger.
  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      {/* Portrait (téléphone, tablette) : la vague déborde juste au-dessus de la
          scène pour que le ruban passe derrière les têtes. */}
      <div className="absolute inset-x-0 bottom-0 h-[calc(100%+2rem)] lg:hidden">
        <svg
          viewBox="0 0 400 520"
          preserveAspectRatio="none"
          className="vague-heros absolute inset-0 size-full"
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
        </svg>
        <svg
          viewBox="0 0 400 520"
          preserveAspectRatio="none"
          className="ruban-heros absolute inset-0 size-full"
          focusable="false"
        >
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
      </div>

      {/* Paysage (ordinateur) : format fixe 12:7, identique à la scène. */}
      <div className="absolute inset-0 hidden lg:block">
        <svg
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
          className="vague-heros absolute inset-0 size-full"
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
        </svg>
        <svg
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
          className="ruban-heros absolute inset-0 size-full"
          focusable="false"
        >
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
    </div>
  );
}

/**
 * Bannière d'en-tête des pages intérieures, dans la langue du héros de
 * l'accueil : fond marine, vague colorée et ruban (rouge + liseré blanc) qui
 * entrent en glissant sur la droite, formes souples qui dérivent en fond, bas
 * découpé en vague animée. Comme sur l'accueil, la bannière passe sous
 * l'en-tête, qui reste translucide tant qu'elle est à l'écran
 * (`data-banniere-sombre`).
 *
 * `ton` choisit la couleur de la vague (bleu ou rouge) ; `photo`, si une
 * image est déposée, remplace le décor.
 */
export function BannierePage({
  surtitre,
  titre,
  chapo,
  ton = "marine",
  photo,
  avant,
  className,
  children,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
  ton?: "rouge" | "bleu" | "marine";
  photo?: string | null;
  /** Contenu placé au-dessus du titre (lien de retour, par exemple). */
  avant?: React.ReactNode;
  /** Classes ajoutées à la bannière (hauteur plein écran, par exemple). */
  className?: string;
  /** Contenu placé sous le titre (date, auteur…). */
  children?: React.ReactNode;
}) {
  const vague = ton === "rouge" ? ["#fc6844", "#b0221f"] : ["#42b0e3", "#055a82"];
  const idDegrade = `vague-page-${ton}`;

  return (
    <section
      data-banniere-sombre=""
      className={cn(
        "bg-marine relative isolate -mt-16 overflow-hidden pt-16 md:-mt-20 md:pt-20",
        className,
      )}
    >
      <div
        className="from-marine-fonce via-marine to-marine-clair absolute inset-0 -z-20 bg-linear-to-br"
        aria-hidden="true"
      />

      {photo ? (
        <>
          <Image src={photo} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="voile-banniere absolute inset-0 -z-10" aria-hidden="true" />
        </>
      ) : (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <span className="blob-derive forme-blob-2 bg-bleu-vif/15 absolute -top-16 -left-24 size-72 md:size-96" />
          {/* Vague et ruban, comme dans le héros : sur la droite sur grand
              écran ; sur mobile et tablette, en bas, sous le texte, pour ne
              jamais le traverser. */}
          <div className="parallaxe absolute right-0 bottom-0 h-40 w-full [--parallaxe:3rem] md:h-48 xl:top-0 xl:h-auto xl:w-[55%]">
            <svg
              viewBox="0 0 800 500"
              preserveAspectRatio="none"
              className="vague-heros absolute inset-0 size-full"
              focusable="false"
            >
              <defs>
                <linearGradient id={idDegrade} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={vague[0]} />
                  <stop offset="1" stopColor={vague[1]} />
                </linearGradient>
              </defs>
              <path
                d="M240 500C290 360 420 280 600 230S780 130 800 60V500Z"
                fill={`url(#${idDegrade})`}
              />
            </svg>
            <svg
              viewBox="0 0 800 500"
              preserveAspectRatio="none"
              className="ruban-heros absolute inset-0 size-full"
              focusable="false"
            >
              <path
                d="M200 540C260 360 400 262 590 212S775 108 815 30"
                fill="none"
                stroke="#ef433f"
                strokeWidth="26"
                strokeLinecap="round"
              />
              <path
                d="M168 540C232 346 376 238 570 188S752 82 792 6"
                fill="none"
                stroke="#fff"
                strokeOpacity="0.85"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}

      <div
        className={cn(
          "contenu relative pt-14 text-white md:pt-24",
          photo ? "pb-28 md:pb-36" : "pb-44 md:pb-52 xl:pb-36",
        )}
      >
        <div className="parallaxe max-w-3xl [--parallaxe:2rem] xl:max-w-[min(48rem,50vw)]">
          {avant ? <div className="anim-entree mb-6">{avant}</div> : null}
          {surtitre ? (
            <p className="anim-entree mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 py-1.5 pr-4 pl-2 text-sm font-bold ring-1 ring-white/20">
              <span className="bg-rouge-vif inline-block size-3 rounded-full" aria-hidden="true" />
              {surtitre}
            </p>
          ) : null}
          <h1 className="anim-entree anim-retard-1 text-[clamp(2.3rem,8vw,4.5rem)] leading-[1.03] font-bold tracking-[-0.02em] text-balance">
            {titre}
          </h1>
          {chapo ? (
            <p className="anim-entree anim-retard-2 mt-5 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
              {chapo}
            </p>
          ) : null}
          {children ? (
            <div className="anim-entree anim-retard-2 mt-5 text-white/85">{children}</div>
          ) : null}
        </div>
      </div>

      <OndeBord className="text-fond" position="bas" />
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
