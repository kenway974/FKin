"use client";

import * as React from "react";
import Image from "next/image";
import { ImageUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AideChamp, Champ, Input, Label, MessageErreur } from "@/components/ui/field";
import { creerClientNavigateur } from "@/lib/supabase/client";
import { IMAGE_TAILLE_MAX_OCTETS, IMAGE_TYPES_ACCEPTES } from "@/lib/validation/contenu";
import { envPublic } from "@/lib/env-public";
import { genererSlug } from "@/lib/utils";

/**
 * Téléversement d'une image vers Supabase Storage.
 *
 * Le fichier part directement du navigateur vers Storage : il ne transite pas
 * par le serveur Next.js, ce qui évite de faire passer plusieurs mégaoctets
 * dans une Server Action.
 *
 * Le contrôle du type et du poids effectué ici sert le confort de l'utilisateur.
 * La véritable barrière reste la politique Storage définie dans
 * `supabase/schema.sql`, qui n'autorise l'écriture qu'aux administrateurs.
 *
 * L'URL publique résultante est remontée au formulaire parent, qui
 * l'enregistrera en base : le champ reste modifiable à la main si vous préférez
 * héberger vos images ailleurs.
 */
export function TeleversementImage({
  valeur,
  onChange,
  dossier,
  nomBase,
  erreur,
  identifiant = "image-url",
}: {
  valeur: string;
  onChange: (url: string) => void;
  /** Sous-dossier du bucket : « articles » ou « projets ». */
  dossier: string;
  /** Sert à construire un nom de fichier lisible (généralement le titre). */
  nomBase?: string;
  erreur?: string;
  identifiant?: string;
}) {
  const [enCours, setEnCours] = React.useState(false);
  const [erreurLocale, setErreurLocale] = React.useState<string | null>(null);

  async function auChangementFichier(evenement: React.ChangeEvent<HTMLInputElement>) {
    const fichier = evenement.target.files?.[0];
    // Permet de re-sélectionner le même fichier après une erreur.
    evenement.target.value = "";
    if (!fichier) return;

    setErreurLocale(null);

    if (!IMAGE_TYPES_ACCEPTES.includes(fichier.type)) {
      setErreurLocale("Format non accepté. Utilisez une image JPEG, PNG, WebP ou AVIF.");
      return;
    }

    if (fichier.size > IMAGE_TAILLE_MAX_OCTETS) {
      setErreurLocale(
        `Image trop lourde (${Math.round(fichier.size / 1024 / 1024)} Mo). Maximum : 5 Mo. Pensez à la redimensionner : le site est consulté sur des connexions lentes.`,
      );
      return;
    }

    const supabase = creerClientNavigateur();
    if (!supabase) {
      setErreurLocale("Supabase n'est pas configuré.");
      return;
    }

    setEnCours(true);

    // Nom de fichier reconstruit de zéro : le nom d'origine n'est jamais
    // réutilisé tel quel (caractères exotiques, collisions, traversée de chemin).
    const extension =
      fichier.name
        .split(".")
        .pop()
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "jpg";
    const base = genererSlug(nomBase || "image") || "image";
    const chemin = `${dossier}/${base}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from(envPublic.NEXT_PUBLIC_SUPABASE_BUCKET)
      .upload(chemin, fichier, { cacheControl: "31536000", upsert: false });

    if (error) {
      console.error("[storage] Téléversement impossible :", error);
      setErreurLocale(
        "Le téléversement a échoué. Vérifiez que le bucket existe et que votre compte est bien administrateur.",
      );
      setEnCours(false);
      return;
    }

    const { data } = supabase.storage
      .from(envPublic.NEXT_PUBLIC_SUPABASE_BUCKET)
      .getPublicUrl(chemin);
    onChange(data.publicUrl);
    setEnCours(false);
  }

  return (
    <div className="rounded-douce border-bordure bg-sable/50 space-y-3 border p-4">
      <Champ>
        <Label htmlFor={identifiant}>Image</Label>

        {valeur ? (
          <div className="flex flex-wrap items-start gap-4">
            <div className="rounded-douce border-bordure relative aspect-[4/3] w-40 shrink-0 overflow-hidden border bg-white">
              {/*
                `unoptimized` : l'aperçu du back-office n'a pas besoin de passer
                par l'optimiseur d'images, cela évite une transformation
                facturée pour une vignette vue par une seule personne.
              */}
              <Image
                src={valeur}
                alt="Aperçu de l'image sélectionnée"
                fill
                sizes="160px"
                className="object-cover"
                unoptimized
              />
            </div>
            <Button
              type="button"
              variante="danger"
              taille="sm"
              onClick={() => onChange("")}
              disabled={enCours}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Retirer l&apos;image
            </Button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <label className="rounded-douce border-terre text-terre hover:bg-terre-voile inline-flex h-9 cursor-pointer items-center gap-2 border-2 px-3 text-sm font-medium">
            <ImageUp className="size-4" aria-hidden="true" />
            {enCours ? "Téléversement…" : valeur ? "Remplacer l'image" : "Choisir une image"}
            <input
              type="file"
              accept={IMAGE_TYPES_ACCEPTES.join(",")}
              onChange={auChangementFichier}
              disabled={enCours}
              className="sr-only"
            />
          </label>
          {enCours ? (
            <span role="status" className="text-doux text-sm">
              Envoi en cours, ne quittez pas la page…
            </span>
          ) : null}
        </div>

        <Input
          id={identifiant}
          type="url"
          inputMode="url"
          placeholder="https://…"
          value={valeur}
          onChange={(evenement) => onChange(evenement.target.value)}
          aria-describedby={`aide-${identifiant}`}
        />
        <AideChamp id={`aide-${identifiant}`}>
          Téléversez une image, ou collez directement l&apos;adresse d&apos;une image hébergée
          ailleurs. Format conseillé : 1200 × 900 px, moins de 300 ko.
        </AideChamp>

        <MessageErreur>{erreurLocale ?? erreur}</MessageErreur>
      </Champ>
    </div>
  );
}
