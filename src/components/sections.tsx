import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Blob, OndeBord } from "@/components/formes";

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
}: React.ComponentProps<"section"> & { fond?: "clair" | "nuage" | "bleu" }) {
  const fonds = {
    clair: "bg-fond",
    nuage: "bg-nuage motif-tissu",
    bleu: "bg-bleu-voile",
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
  sombre = false,
  id,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
  niveau?: 1 | 2;
  centre?: boolean;
  /** Sur une bande sombre : surtitre et chapô éclaircis. */
  sombre?: boolean;
  id?: string;
}) {
  const Titre = niveau === 1 ? "h1" : "h2";

  return (
    // Apparition à l'arrivée à l'écran (sur ce bloc), parallaxe légère (sur
    // le bloc intérieur) : deux éléments distincts, pour que les deux
    // mouvements ne se contrarient pas.
    <div data-apparition="" className={cn("max-w-3xl", centre && "mx-auto text-center")}>
      <div className="parallaxe-vue [--parallaxe:1.25rem]">
        {surtitre ? (
          <p
            className={cn(
              "mb-3 inline-flex items-center gap-2 text-sm font-extrabold tracking-[0.14em] uppercase",
              sombre ? "text-rouge-clair" : "text-rouge",
              centre && "justify-center",
            )}
          >
            <span
              className="barre-surtitre bg-rouge-vif inline-block h-2 w-6 rounded-full"
              aria-hidden="true"
            />
            {surtitre}
          </p>
        ) : null}
        <Titre
          id={id}
          className={cn(
            "font-bold",
            niveau === 1 ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl",
          )}
        >
          {titre}
        </Titre>
        {chapo ? (
          <p className={cn("mt-4 text-lg leading-relaxed", sombre ? "text-white/80" : "text-doux")}>
            {chapo}
          </p>
        ) : null}
      </div>
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
        "bg-nuage-fonce motif-tissu flex aspect-[4/3] w-full items-center justify-center",
        className,
      )}
      {...(decoratif
        ? { role: "presentation" as const, "aria-hidden": true }
        : { role: "img" as const, "aria-label": legende ?? "Photographie à venir" })}
    >
      <svg viewBox="0 0 64 48" className="text-bleu/40 h-16 w-16" aria-hidden="true">
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
export function EtatVide({
  titre,
  anime = true,
  children,
}: {
  titre: string;
  /** `false` : forme immobile (back-office, où rien ne tourne en boucle). */
  anime?: boolean;
  children?: React.ReactNode;
}) {
  return (
    // Pas de cadre : le message est posé sur une grande forme souple, pâle,
    // qui tourne lentement derrière lui.
    // La forme est presque ronde : en tournant, elle reste dans son cadre et
    // ne déborde jamais sur le titre de la section.
    <div className="relative isolate mx-auto grid min-h-[20rem] max-w-xl place-items-center content-center overflow-x-clip px-10 text-center md:min-h-[24rem]">
      <span
        aria-hidden="true"
        className={cn(
          "forme-blob-2 bg-bleu-voile absolute top-1/2 left-1/2 -z-10 aspect-square w-[min(88%,20rem)] -translate-x-1/2 -translate-y-1/2 md:w-[23rem]",
          anime && "blob-anime",
        )}
      />
      <p className="font-titre text-encre text-xl font-semibold md:text-2xl">{titre}</p>
      {children ? <div className="text-doux mt-2 max-w-sm">{children}</div> : null}
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
    // Pas de cadre : le chiffre est posé sur une petite forme souple animée.
    <div className="flex flex-col items-start">
      <span className="relative isolate inline-grid place-items-center px-5 py-3">
        <span
          aria-hidden="true"
          className="blob-anime forme-blob-1 bg-bleu-voile absolute inset-0 -z-10"
        />
        <span data-compteur="" className="font-titre text-bleu text-4xl font-bold md:text-5xl">
          {valeur}
        </span>
      </span>
      <p className="text-encre mt-1 font-semibold">{libelle}</p>
      {precision ? <p className="text-doux mt-1 text-sm">{precision}</p> : null}
    </div>
  );
}

/**
 * Point clé : pictogramme posé sur une forme souple animée, titre et texte
 * directement sur la page. Remplace les « cartes » encadrées : aucun fond,
 * aucune bordure, la hiérarchie vient de la forme et de la typographie.
 */
export function Point({
  icone: Icone,
  titre,
  ton = "rouge",
  variante = 1,
  sombre = false,
  children,
  className,
}: {
  icone: LucideIcon;
  titre: React.ReactNode;
  ton?: "rouge" | "bleu" | "marine";
  variante?: 1 | 2 | 3;
  /** Sur une bande sombre (marine) : forme pleine, textes clairs. */
  sombre?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const teintes = sombre
    ? {
        rouge: ["bg-rouge-vif", "text-white"],
        bleu: ["bg-bleu-vif", "text-white"],
        marine: ["bg-white/15", "text-white"],
      }
    : {
        rouge: ["bg-rouge-voile", "text-rouge"],
        bleu: ["bg-bleu-voile", "text-bleu"],
        marine: ["bg-nuage-fonce", "text-marine"],
      };
  return (
    <div className={cn("flex flex-col items-start gap-4", className)}>
      <Blob teinte={teintes[ton][0]} variante={variante} className="size-16">
        <Icone className={cn("size-7", teintes[ton][1])} aria-hidden="true" />
      </Blob>
      <h3 className={cn("text-xl font-semibold md:text-2xl", sombre && "text-white")}>{titre}</h3>
      {children ? (
        <div className={cn("space-y-2 leading-relaxed", sombre ? "text-white/80" : "text-doux")}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Bande pleine largeur bordée de vagues animées, comme sur l'accueil.
 * `fond` : nuage (clair bleuté) ou marine (sombre, textes clairs).
 */
export function Bande({
  fond = "nuage",
  className,
  children,
  ...proprietes
}: React.ComponentProps<"section"> & { fond?: "nuage" | "marine" }) {
  return (
    <section
      className={cn(
        "relative isolate overflow-clip py-24 md:py-36",
        fond === "marine" ? "bg-marine text-white" : "bg-nuage",
        className,
      )}
      {...proprietes}
    >
      <OndeBord className="text-fond" position="haut" />
      <OndeBord className="text-fond" position="bas" />
      {fond === "marine" ? (
        <span
          aria-hidden="true"
          className="blob-derive forme-blob-2 bg-bleu-vif/15 absolute top-10 -right-24 -z-10 size-80 md:size-[28rem]"
        />
      ) : null}
      {children}
    </section>
  );
}
