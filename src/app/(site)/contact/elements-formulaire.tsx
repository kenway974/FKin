"use client";

import * as React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Camera, Check, LoaderCircle, X } from "lucide-react";
import { Blob } from "@/components/formes";
import { MessageErreur } from "@/components/ui/field";
import { compresserImage } from "@/lib/compression-image";
import { PHOTO_POIDS_MAX, PHOTOS_MAX } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Indicateur de progression                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Les étapes du parcours, reliées par un trait qui se remplit. L'étape en
 * cours est rouge, les étapes franchies bleues et cochées. Sur téléphone,
 * seul le libellé de l'étape en cours est affiché.
 */
export function Progression({ titres, etape }: { titres: string[]; etape: number }) {
  const avancement = etape / (titres.length - 1);
  return (
    <div className="relative">
      <p className="sr-only" aria-live="polite">
        Étape {etape + 1} sur {titres.length} : {titres[etape]}
      </p>
      {/* Trait de fond et trait de progression (transform uniquement). */}
      <div
        aria-hidden="true"
        className="bg-bordure absolute top-5 right-5 left-5 h-1 rounded-full md:top-6 md:right-6 md:left-6"
      >
        <div
          className="bg-bleu-vif h-full origin-left rounded-full transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${avancement})` }}
        />
      </div>
      <ol aria-hidden="true" className="relative flex justify-between">
        {titres.map((titre, index) => {
          const faite = index < etape;
          const courante = index === etape;
          return (
            <li key={titre} className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "font-titre grid size-10 place-items-center rounded-full text-base font-bold transition-[background-color,color,transform] duration-300 md:size-12",
                  courante && "bg-rouge-vif scale-110 text-white",
                  faite && "bg-bleu-vif text-white",
                  !courante && !faite && "bg-nuage-fonce text-doux",
                )}
              >
                {faite ? <Check className="size-5" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold md:text-sm",
                  courante ? "text-encre" : "text-doux hidden sm:inline",
                )}
              >
                {titre}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Choix en pastilles                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Groupe de choix présenté en pilules (boutons radio ou cases à cocher
 * visuellement masqués, donc accessibles au clavier et aux lecteurs d'écran).
 * La pilule choisie se remplit de bleu et affiche une coche.
 */
export function ChoixPastilles({
  legende,
  aide,
  options,
  icones,
  multiple = false,
  enregistrement,
  erreur,
  id,
}: {
  legende: string;
  aide?: string;
  options: Record<string, string>;
  icones?: Record<string, React.ComponentType<{ className?: string }>>;
  multiple?: boolean;
  enregistrement: UseFormRegisterReturn;
  erreur?: string;
  id: string;
}) {
  return (
    <fieldset
      className="space-y-3"
      aria-describedby={
        [aide ? `aide-${id}` : null, erreur ? `erreur-${id}` : null].filter(Boolean).join(" ") ||
        undefined
      }
      aria-invalid={erreur ? true : undefined}
    >
      <legend className="text-encre font-semibold">
        {legende} <span aria-hidden="true">*</span>
      </legend>
      {aide ? (
        <p id={`aide-${id}`} className="text-doux -mt-1 text-sm">
          {aide}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2.5">
        {Object.entries(options).map(([valeur, libelle]) => {
          const Icone = icones?.[valeur];
          return (
            <label key={valeur} className="cursor-pointer">
              <input
                type={multiple ? "checkbox" : "radio"}
                value={valeur}
                className="peer sr-only"
                {...enregistrement}
              />
              <span className="bg-nuage text-encre hover:bg-nuage-fonce peer-checked:bg-bleu peer-checked:hover:bg-bleu-fonce peer-focus-visible:ring-bleu inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-offset-2 transition-colors duration-200 peer-checked:text-white peer-focus-visible:ring-3 md:text-base [&>.coche]:hidden peer-checked:[&>.coche]:block peer-checked:[&>.icone]:hidden">
                {Icone ? <Icone className="icone size-4 shrink-0" /> : null}
                <Check className="coche size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                {libelle}
              </span>
            </label>
          );
        })}
      </div>
      <MessageErreur id={`erreur-${id}`}>{erreur}</MessageErreur>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/*  Photos                                                                    */
/* -------------------------------------------------------------------------- */

export type PhotoJointe = { id: string; fichier: File; apercu: string };

/**
 * Ajout de photos (facultatif) : chaque photo est compressée dans le
 * navigateur dès son choix, puis présentée en vignette arrondie, retirable.
 * Pas de zone de dépôt encadrée : un simple bouton posé sur une forme souple.
 */
export function SelecteurPhotos({
  photos,
  onChange,
  legende,
  aide,
}: {
  photos: PhotoJointe[];
  onChange: (photos: PhotoJointe[]) => void;
  legende: string;
  aide: string;
}) {
  const champ = React.useRef<HTMLInputElement>(null);
  const [enCours, setEnCours] = React.useState(false);
  const [erreur, setErreur] = React.useState<string | null>(null);
  const places = PHOTOS_MAX - photos.length;

  async function ajouter(fichiers: FileList | null) {
    if (!fichiers?.length) return;
    setErreur(null);
    setEnCours(true);
    const nouvelles: PhotoJointe[] = [];
    let refusees = 0;
    for (const fichier of Array.from(fichiers).slice(0, places)) {
      try {
        const compressee = await compresserImage(fichier);
        if (compressee.size > PHOTO_POIDS_MAX) throw new Error("trop lourde");
        nouvelles.push({
          id: crypto.randomUUID(),
          fichier: compressee,
          apercu: URL.createObjectURL(compressee),
        });
      } catch {
        refusees++;
      }
    }
    if (fichiers.length > places) setErreur(`${PHOTOS_MAX} photos au maximum.`);
    else if (refusees) {
      setErreur(
        refusees > 1
          ? `${refusees} fichiers n'ont pas pu être lus comme des photos.`
          : "Un fichier n'a pas pu être lu comme une photo.",
      );
    }
    onChange([...photos, ...nouvelles]);
    setEnCours(false);
    if (champ.current) champ.current.value = "";
  }

  function retirer(id: string) {
    const photo = photos.find((element) => element.id === id);
    if (photo) URL.revokeObjectURL(photo.apercu);
    onChange(photos.filter((element) => element.id !== id));
  }

  return (
    <div className="space-y-3">
      <p className="text-encre font-semibold">
        {legende} <span className="text-doux font-normal">(facultatif)</span>
      </p>
      <p id="aide-photos" className="text-doux -mt-1 text-sm">
        {aide}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:), rien à optimiser */}
            <img
              src={photo.apercu}
              alt={`Photo ${index + 1}`}
              className={cn(
                "size-20 object-cover md:size-24",
                ["forme-blob-1", "forme-blob-2", "forme-blob-3"][index % 3],
              )}
            />
            <button
              type="button"
              onClick={() => retirer(photo.id)}
              className="bg-marine hover:bg-rouge-vif focus-visible:ring-bleu absolute -top-1 -right-1 grid size-7 place-items-center rounded-full text-white transition-colors focus-visible:ring-3 focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Retirer la photo {index + 1}</span>
            </button>
          </div>
        ))}

        {places > 0 ? (
          <button
            type="button"
            onClick={() => champ.current?.click()}
            disabled={enCours}
            aria-describedby="aide-photos"
            className="group focus-visible:ring-bleu flex items-center gap-3 rounded-full text-left ring-offset-4 focus-visible:ring-3 focus-visible:outline-none disabled:opacity-70"
          >
            <Blob
              teinte="bg-bleu-voile group-hover:bg-bleu-vif transition-colors"
              variante={2}
              className="text-bleu size-16 transition-colors group-hover:text-white md:size-20"
            >
              {enCours ? (
                <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />
              ) : (
                <Camera className="size-7" aria-hidden="true" />
              )}
            </Blob>
            <span>
              <span className="text-encre block font-semibold">
                {enCours
                  ? "Préparation…"
                  : photos.length
                    ? "Ajouter une photo"
                    : "Ajouter des photos"}
              </span>
              <span className="text-doux block text-sm">
                {photos.length}/{PHOTOS_MAX}
              </span>
            </span>
          </button>
        ) : null}
      </div>

      <input
        ref={champ}
        type="file"
        accept="image/*"
        multiple
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={(evenement) => ajouter(evenement.target.files)}
      />
      {erreur ? <MessageErreur>{erreur}</MessageErreur> : null}
    </div>
  );
}
