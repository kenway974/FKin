import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Briques de mise en page réutilisées par les pages publiques.
 * Les regrouper ici garantit un rythme vertical et une typographie homogènes
 * d'une page à l'autre.
 */

/** Section de page, avec fond optionnel. */
export function Section({
  fond = "clair",
  className,
  ...proprietes
}: React.ComponentProps<"section"> & { fond?: "clair" | "sable" | "vert" }) {
  const fonds = {
    clair: "bg-fond",
    sable: "bg-sable motif-tissu",
    vert: "bg-vert-voile",
  } as const;

  return <section className={cn("py-14 md:py-20", fonds[fond], className)} {...proprietes} />;
}

/** Titre de section avec surtitre et chapô optionnels. */
export function TitreSection({
  surtitre,
  titre,
  chapo,
  niveau = 2,
  centre = false,
  id,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
  niveau?: 1 | 2;
  centre?: boolean;
  id?: string;
}) {
  const Titre = niveau === 1 ? "h1" : "h2";

  return (
    <div className={cn("max-w-3xl", centre && "mx-auto text-center")}>
      {surtitre ? (
        <p className="text-terre mb-2 text-sm font-bold tracking-[0.14em] uppercase">{surtitre}</p>
      ) : null}
      <Titre
        id={id}
        className={cn("font-bold", niveau === 1 ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl")}
      >
        {titre}
      </Titre>
      {chapo ? <p className="text-doux mt-4 text-lg leading-relaxed">{chapo}</p> : null}
    </div>
  );
}

/**
 * Visuel de remplacement affiché tant qu'aucune photo n'a été téléversée.
 *
 * Dessiné en SVG plutôt que chargé comme image : zéro octet réseau, et le site
 * n'affiche jamais de vignette cassée avant que le propriétaire n'ait ajouté
 * ses propres photos.
 */
export function VisuelParDefaut({
  className,
  legende,
  decoratif = false,
}: {
  className?: string;
  legende?: string;
  /** Vrai quand le visuel n'apporte aucune information : il est alors ignoré
   *  par les technologies d'assistance plutôt que d'annoncer un vide. */
  decoratif?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-sable-fonce motif-tissu flex aspect-[4/3] w-full items-center justify-center",
        className,
      )}
      {...(decoratif
        ? { role: "presentation" as const, "aria-hidden": true }
        : { role: "img" as const, "aria-label": legende ?? "Photographie à venir" })}
    >
      <svg viewBox="0 0 64 48" className="text-terre/45 h-16 w-16" aria-hidden="true">
        <rect
          x="4"
          y="8"
          width="56"
          height="36"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
        <path d="M8 40l14-14 10 10 8-7 16 11z" fill="currentColor" opacity="0.7" />
      </svg>
    </div>
  );
}

/** État vide : affiché quand une liste alimentée par la base ne renvoie rien. */
export function EtatVide({ titre, children }: { titre: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-douce border-bordure bg-sable/60 border border-dashed p-8 text-center">
      <p className="font-titre text-encre text-lg font-semibold">{titre}</p>
      {children ? <div className="text-doux mt-2 text-sm">{children}</div> : null}
    </div>
  );
}

/** Chiffre-clé mis en avant (preuve d'impact sur la page d'accueil). */
export function ChiffreCle({
  valeur,
  libelle,
  precision,
}: {
  valeur: string;
  libelle: string;
  precision?: string;
}) {
  return (
    <div className="rounded-douce border-bordure border bg-white p-6">
      <p className="font-titre text-terre text-3xl font-bold md:text-4xl">{valeur}</p>
      <p className="text-encre mt-1 font-semibold">{libelle}</p>
      {precision ? <p className="text-doux mt-1 text-sm">{precision}</p> : null}
    </div>
  );
}
