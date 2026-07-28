"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  AideChamp,
  Champ,
  Input,
  Label,
  MessageErreur,
  Select,
  Textarea,
} from "@/components/ui/field";
import { TeleversementImage } from "@/components/admin/televersement-image";
import { schemaProjet, type DonneesProjet } from "@/lib/validation/contenu";
import { genererSlug } from "@/lib/utils";
import { creerProjet, modifierProjet } from "./actions";
import type { ResultatAction } from "@/lib/actions-types";
import type { Projet } from "@/types/database";

/** Formulaire de création et de modification d'un projet de la galerie. */
export function FormulaireProjet({ projet }: { projet?: Projet }) {
  const router = useRouter();
  const modeEdition = Boolean(projet);
  const [resultat, setResultat] = React.useState<ResultatAction | null>(null);
  const referenceResultat = React.useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DonneesProjet>({
    resolver: zodResolver(schemaProjet),
    defaultValues: {
      titre: projet?.titre ?? "",
      slug: projet?.slug ?? "",
      description: projet?.description ?? "",
      lieu: projet?.lieu ?? "",
      dateProjet: projet?.date_projet?.slice(0, 10) ?? "",
      typeMateriel: projet?.type_materiel ?? "",
      resultat: projet?.resultat ?? "",
      imageUrl: projet?.image_url ?? "",
      imageAlt: projet?.image_alt ?? "",
      publie: projet?.publie ?? true,
      ordre: projet?.ordre ?? 0,
    },
  });

  const titre = watch("titre");
  const imageUrl = watch("imageUrl") ?? "";

  async function auEnvoi(donnees: DonneesProjet) {
    const reponse = modeEdition
      ? await modifierProjet(projet!.id, donnees)
      : await creerProjet(donnees);

    setResultat(reponse);
    referenceResultat.current?.focus();

    if (reponse.statut === "erreur" && reponse.erreursChamps) {
      for (const [champ, messages] of Object.entries(reponse.erreursChamps)) {
        if (messages?.[0]) {
          setError(champ as keyof DonneesProjet, { type: "server", message: messages[0] });
        }
      }
      return;
    }

    if (reponse.statut === "succes") {
      if (!modeEdition && reponse.id) {
        router.replace(`/admin/projets/${reponse.id}`);
      }
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(auEnvoi)} noValidate className="space-y-6">
      <div ref={referenceResultat} tabIndex={-1} className="outline-none">
        {resultat ? (
          <Alert ton={resultat.statut === "succes" ? "succes" : "erreur"}>
            <p>{resultat.message}</p>
          </Alert>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="rounded-douce border-bordure space-y-5 border bg-white p-5 md:p-6">
          <Champ>
            <Label htmlFor="titre">
              Titre du projet <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="titre"
              placeholder="Ex. : Salle informatique du lycée Bonsomi"
              aria-required="true"
              aria-invalid={errors.titre ? true : undefined}
              {...register("titre")}
            />
            <MessageErreur>{errors.titre?.message}</MessageErreur>
          </Champ>

          <Champ>
            <Label htmlFor="slug">
              Identifiant (slug) <span aria-hidden="true">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                aria-required="true"
                aria-invalid={errors.slug ? true : undefined}
                aria-describedby="aide-slug-projet"
                {...register("slug")}
              />
              <Button
                type="button"
                variante="contour"
                onClick={() =>
                  setValue("slug", genererSlug(titre), { shouldValidate: true, shouldDirty: true })
                }
              >
                <Wand2 className="size-4" aria-hidden="true" />
                Depuis le titre
              </Button>
            </div>
            <AideChamp id="aide-slug-projet">
              Identifiant interne, unique. Il n&apos;apparaît pas dans les URL du site mais évite
              les doublons.
            </AideChamp>
            <MessageErreur>{errors.slug?.message}</MessageErreur>
          </Champ>

          <div className="grid gap-5 sm:grid-cols-2">
            <Champ>
              <Label htmlFor="lieu">
                Lieu <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="lieu"
                placeholder="Ex. : Kinshasa, commune de Limete"
                aria-required="true"
                aria-invalid={errors.lieu ? true : undefined}
                {...register("lieu")}
              />
              <MessageErreur>{errors.lieu?.message}</MessageErreur>
            </Champ>

            <Champ>
              <Label htmlFor="date-projet">Date du projet</Label>
              <Input id="date-projet" type="date" {...register("dateProjet")} />
              <AideChamp>Date de la livraison ou de la mise en service.</AideChamp>
              <MessageErreur>{errors.dateProjet?.message}</MessageErreur>
            </Champ>
          </div>

          <Champ>
            <Label htmlFor="type-materiel">
              Type de matériel <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="type-materiel"
              placeholder="Ex. : 24 ordinateurs de bureau, 3 onduleurs, 2 imprimantes"
              aria-required="true"
              aria-invalid={errors.typeMateriel ? true : undefined}
              {...register("typeMateriel")}
            />
            <MessageErreur>{errors.typeMateriel?.message}</MessageErreur>
          </Champ>

          <Champ>
            <Label htmlFor="description">
              Description <span aria-hidden="true">*</span>
            </Label>
            <Textarea
              id="description"
              rows={6}
              aria-required="true"
              aria-invalid={errors.description ? true : undefined}
              aria-describedby="aide-description"
              {...register("description")}
            />
            <AideChamp id="aide-description">
              Le contexte : quelle structure, quel besoin, comment le projet a été monté.
            </AideChamp>
            <MessageErreur>{errors.description?.message}</MessageErreur>
          </Champ>

          <Champ>
            <Label htmlFor="resultat">
              Résultat obtenu <span aria-hidden="true">*</span>
            </Label>
            <Textarea
              id="resultat"
              rows={3}
              aria-required="true"
              aria-invalid={errors.resultat ? true : undefined}
              aria-describedby="aide-resultat"
              {...register("resultat")}
            />
            <AideChamp id="aide-resultat">
              La phrase la plus importante de la fiche : ce que le matériel permet concrètement
              aujourd&apos;hui. Ex. : « 180 élèves suivent désormais deux heures d&apos;informatique
              par semaine ».
            </AideChamp>
            <MessageErreur>{errors.resultat?.message}</MessageErreur>
          </Champ>
        </div>

        <div className="space-y-5">
          <div className="rounded-douce border-bordure space-y-5 border bg-white p-5">
            <h2 className="font-titre text-lg font-bold">Affichage</h2>

            <Champ>
              <Label htmlFor="publie">Visibilité</Label>
              <Select
                id="publie"
                aria-describedby="aide-publie"
                {...register("publie", {
                  // Un `<select>` ne renvoie que des chaînes : on rétablit le booléen.
                  setValueAs: (valeur) => valeur === true || valeur === "true",
                })}
              >
                <option value="true">Visible dans la galerie</option>
                <option value="false">Masqué</option>
              </Select>
              <AideChamp id="aide-publie">
                Un projet masqué reste enregistré mais n&apos;apparaît pas sur le site public.
              </AideChamp>
            </Champ>

            <Champ>
              <Label htmlFor="ordre">Ordre d&apos;affichage</Label>
              <Input
                id="ordre"
                type="number"
                min={0}
                max={999}
                {...register("ordre", { valueAsNumber: true })}
              />
              <AideChamp>
                Les plus petits nombres apparaissent en premier. À valeur égale, le projet le plus
                récent passe devant.
              </AideChamp>
              <MessageErreur>{errors.ordre?.message}</MessageErreur>
            </Champ>
          </div>

          <div className="rounded-douce border-bordure border bg-white p-5">
            <h2 className="font-titre mb-4 text-lg font-bold">Photographie</h2>

            <TeleversementImage
              identifiant="image-projet"
              dossier="projets"
              nomBase={titre}
              valeur={imageUrl}
              onChange={(url) =>
                setValue("imageUrl", url, { shouldDirty: true, shouldValidate: true })
              }
              erreur={errors.imageUrl?.message}
            />

            <Champ className="mt-4">
              <Label htmlFor="image-alt-projet">Description de la photo</Label>
              <Input
                id="image-alt-projet"
                aria-describedby="aide-alt-projet"
                {...register("imageAlt")}
              />
              <AideChamp id="aide-alt-projet">
                Décrit la photo pour les personnes qui ne la voient pas. Ex. : « Une salle de classe
                équipée de douze postes, des élèves y travaillent ».
              </AideChamp>
              <MessageErreur>{errors.imageAlt?.message}</MessageErreur>
            </Champ>
          </div>
        </div>
      </div>

      <div className="border-bordure bg-sable/95 sticky bottom-0 flex flex-wrap items-center gap-3 border-t py-4 backdrop-blur-sm">
        <Button type="submit" taille="lg" disabled={isSubmitting}>
          <Save className="size-4" aria-hidden="true" />
          {isSubmitting
            ? "Enregistrement…"
            : modeEdition
              ? "Enregistrer les modifications"
              : "Créer le projet"}
        </Button>
        <Button asChild variante="discret">
          <Link href="/admin/projets">Retour à la liste</Link>
        </Button>
        {isDirty && !isSubmitting ? (
          <span className="text-doux text-sm">Modifications non enregistrées.</span>
        ) : null}
      </div>
    </form>
  );
}
