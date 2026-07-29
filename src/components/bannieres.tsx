import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MotifAngle, SceneBanniere } from "@/components/illustrations";

/**
 * Bannières et rubans.
 *
 * Chaque bannière accepte une photographie et retombe sur une illustration
 * quand il n'y en a pas. Le voile dégradé est appliqué dans les deux cas :
 * le texte blanc reste ainsi lisible quelle que soit la photo déposée, y
 * compris une photo claire ou très contrastée.
 */

/** Bannière principale de la page d'accueil. */
export function BanniereAccueil({
  photo,
  photoAlt,
  children,
}: {
  photo?: string | null;
  photoAlt?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Fond : photographie si disponible, illustration sinon. */}
      <div className="absolute inset-0 -z-20">
        {photo ? (
          <Image
            src={photo}
            alt={photoAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="degrade-terre relative h-full w-full">
            {/* La scène occupe la moitié basse : le texte reste sur un fond
                uni et lisible, l'illustration se lit comme un paysage. */}
            <SceneBanniere className="absolute inset-x-0 bottom-0 max-h-[72%]" />
          </div>
        )}
      </div>

      {/* Voile de lisibilité, orienté selon le fond : par le bas sur une
          photographie, latéralement sur l'illustration pour ne pas noyer la
          scène — le texte occupe la moitié gauche dans les deux cas. */}
      <div
        className={cn("absolute inset-0 -z-10", photo ? "voile-banniere" : "voile-lateral")}
        aria-hidden="true"
      />

      <div className="contenu relative py-20 md:py-24 lg:py-28">
        <div className="max-w-3xl text-white">{children}</div>
      </div>

      {/* Filet tricolore de bas de bannière, repris du logo. */}
      <div className="filet-tricolore absolute inset-x-0 bottom-0" aria-hidden="true" />
    </section>
  );
}

/**
 * Bannière d'en-tête des pages intérieures : plus compacte, colorée, avec un
 * motif d'angle qui évite l'aplat monotone.
 */
export function BannierePage({
  surtitre,
  titre,
  chapo,
  ton = "terre",
  photo,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
  ton?: "terre" | "vert" | "indigo";
  photo?: string | null;
}) {
  const tons = {
    terre: "from-terre-fonce via-terre to-brique",
    vert: "from-vert-fonce via-vert to-indigo",
    indigo: "from-indigo via-indigo to-terre-fonce",
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
        <MotifAngle className="-top-16 -right-16 -z-10 size-72 text-white/25 md:size-96" />
      )}

      <div className="contenu relative py-14 text-white md:py-20">
        <div className="max-w-3xl">
          {surtitre ? (
            <p className="anim-entree mb-3 inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold tracking-wide uppercase backdrop-blur-sm">
              {surtitre}
            </p>
          ) : null}
          <h1 className="anim-entree anim-retard-1 text-4xl font-bold md:text-5xl">{titre}</h1>
          {chapo ? (
            <p className="anim-entree anim-retard-2 mt-4 text-lg leading-relaxed text-white/90">
              {chapo}
            </p>
          ) : null}
        </div>
      </div>

      <div className="filet-tricolore absolute inset-x-0 bottom-0" aria-hidden="true" />
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
    <div
      className="ruban-piste bg-encre relative flex overflow-hidden py-3 text-white"
      aria-hidden="true"
    >
      <div className="ruban-defilant flex shrink-0 items-center gap-8 pr-8 whitespace-nowrap">
        {piste.map((mention, index) => (
          <span key={index} className="flex items-center gap-8 text-sm font-medium tracking-wide">
            {mention}
            <span className="bg-ocre inline-block size-1.5 shrink-0 rounded-full" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Petit bandeau coloré, pour attirer l'œil au milieu d'une page. */
export function BandeauAccent({
  ton = "ocre",
  className,
  children,
}: {
  ton?: "ocre" | "vert" | "indigo";
  className?: string;
  children: React.ReactNode;
}) {
  const tons = {
    ocre: "bg-soleil-voile border-ocre/35 text-encre",
    vert: "bg-vert-voile border-vert/30 text-vert-fonce",
    indigo: "bg-indigo-voile border-indigo/25 text-indigo",
  } as const;

  return (
    <div
      className={cn(
        "rounded-douce relative overflow-hidden border-l-4 p-5 md:p-6",
        tons[ton],
        className,
      )}
    >
      <MotifAngle className="-top-10 -right-10 size-40 text-current opacity-15" />
      <div className="relative">{children}</div>
    </div>
  );
}
