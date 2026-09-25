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
 * pieds sur le bas de l'écran.
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
    <section className="bg-marine relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden md:min-h-[calc(100svh-5rem)]">
      <FondVague />

      <div className="contenu relative flex flex-1 flex-col justify-between md:grid md:grid-cols-[1.1fr_1fr] md:items-stretch">
        <div className="relative z-10 pt-10 pb-6 text-white md:self-center md:py-16">
          {children}
        </div>

        {/* Sujet : sa hauteur suit celle de l'écran, pieds posés sur le bas. */}
        <div className="relative flex items-end justify-center md:justify-end">{sujet}</div>
      </div>
    </section>
  );
}

/**
 * Décor de la bannière d'accueil : deux compositions, une par format, pour
 * que la vague passe toujours **sous les pieds** du sujet — sur la droite en
 * paysage, en bas de la carte en portrait.
 */
function FondVague() {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <div className="from-marine-fonce via-marine to-marine-clair absolute inset-0 bg-linear-to-br" />

      {/* Portrait (téléphone) */}
      <svg
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[62%] w-full md:hidden"
        focusable="false"
      >
        <defs>
          <linearGradient id="vague-bleue-p" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#42b0e3" />
            <stop offset="1" stopColor="#0474a8" />
          </linearGradient>
        </defs>
        <path d="M0 800V300C110 210 250 250 400 150V800Z" fill="url(#vague-bleue-p)" />
        <path
          d="M-20 285C100 195 250 238 420 132"
          fill="none"
          stroke="#ef433f"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M-20 262C100 172 250 215 420 109"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.85"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      {/* Paysage (tablette, ordinateur) */}
      <svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMaxYMax slice"
        className="absolute inset-0 hidden size-full md:block"
        focusable="false"
      >
        <defs>
          <linearGradient id="vague-bleue-l" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#42b0e3" />
            <stop offset="0.55" stopColor="#0495d4" />
            <stop offset="1" stopColor="#055a82" />
          </linearGradient>
        </defs>
        <path
          d="M560 700C590 520 690 380 880 300S1150 170 1200 40V700Z"
          fill="url(#vague-bleue-l)"
        />
        <path
          d="M520 740C555 520 665 360 860 278S1130 150 1215 10"
          fill="none"
          stroke="#ef433f"
          strokeWidth="40"
          strokeLinecap="round"
        />
        <path
          d="M478 740C515 505 628 338 832 252S1100 118 1190 -20"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.85"
          strokeWidth="9"
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
        <div className="max-w-3xl">
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
