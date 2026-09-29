"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ChampFormulaire, Input, MessageErreur, Select, Textarea } from "@/components/ui/field";
import { SelecteurPosition } from "@/components/admin/selecteur-position";
import { TeleversementImage } from "@/components/admin/televersement-image";
import { schemaProjet, type DonneesProjet } from "@/lib/validation/contenu";
import { genererSlug } from "@/lib/utils";
import { creerProjet, modifierProjet } from "./actions";
import type { ResultatAction } from "@/lib/actions-types";
import type { Projet } from "@/types/database";
import { Surtitre } from "@/components/ui/surtitre";

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
      latitude: projet?.latitude ?? null,
      longitude: projet?.longitude ?? null,
    },
  });

  const titre = watch("titre");
  const imageUrl = watch("imageUrl") ?? "";
  const latitude = watch("latitude") ?? null;
  const longitude = watch("longitude") ?? null;

  // Le slug se génère automatiquement à partir du titre tant que l'utilisateur
  // ne l'a pas modifié à la main. En édition, on ne l'écrase pas.
  const [slugAuto, setSlugAuto] = React.useState(!modeEdition);
  React.useEffect(() => {
    if (!slugAuto) return;
    const genere = genererSlug(titre ?? "");
    // La validation n'est déclenchée que s'il y a un slug à valider : sinon un
    // formulaire vierge afficherait l'erreur « le slug doit contenir au moins
    // 3 caractères » avant même que le titre ait été saisi.
    setValue("slug", genere, { shouldValidate: genere.length > 0 });
  }, [titre, slugAuto, setValue]);

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

      <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-16">
        <div className="space-y-7">
          <ChampFormulaire
            id="titre"
            libelle="Titre du projet"
            requis
            erreur={errors.titre?.message}
          >
            {(aria) => (
              <Input
                {...aria}
                placeholder="Ex. : Salle informatique du lycée Bonsomi"
                {...register("titre")}
              />
            )}
          </ChampFormulaire>

          <ChampFormulaire
            id="slug"
            libelle="Identifiant (slug)"
            requis
            erreur={errors.slug?.message}
            aide={
              <>
                Généré automatiquement à partir du titre (modifiable). Identifiant interne unique —
                il n&apos;apparaît pas dans les URL du site mais évite les doublons.
              </>
            }
          >
            {(aria) => (
              <Input {...aria} {...register("slug", { onChange: () => setSlugAuto(false) })} />
            )}
          </ChampFormulaire>

          <div className="grid gap-5 sm:grid-cols-2">
            <ChampFormulaire id="lieu" libelle="Lieu" requis erreur={errors.lieu?.message}>
              {(aria) => (
                <Input
                  {...aria}
                  placeholder="Ex. : Kinshasa, commune de Limete"
                  {...register("lieu")}
                />
              )}
            </ChampFormulaire>

            <ChampFormulaire
              id="date-projet"
              libelle="Date du projet"
              erreur={errors.dateProjet?.message}
              aide="Date de la livraison ou de la mise en service."
            >
              {(aria) => <Input {...aria} type="date" {...register("dateProjet")} />}
            </ChampFormulaire>
          </div>

          <ChampFormulaire
            id="type-materiel"
            libelle="Type de matériel"
            requis
            erreur={errors.typeMateriel?.message}
          >
            {(aria) => (
              <Input
                {...aria}
                placeholder="Ex. : 24 ordinateurs de bureau, 3 onduleurs, 2 imprimantes"
                {...register("typeMateriel")}
              />
            )}
          </ChampFormulaire>

          <ChampFormulaire
            id="description"
            libelle="Description"
            requis
            erreur={errors.description?.message}
            aide="Le contexte : quelle structure, quel besoin, comment le projet a été monté."
          >
            {(aria) => <Textarea {...aria} rows={6} {...register("description")} />}
          </ChampFormulaire>

          <ChampFormulaire
            id="resultat"
            libelle="Résultat obtenu"
            requis
            erreur={errors.resultat?.message}
            aide={
              <>
                La phrase la plus importante de la fiche : ce que le matériel permet concrètement
                aujourd&apos;hui. Ex. : « 180 élèves suivent désormais deux heures
                d&apos;informatique par semaine ».
              </>
            }
          >
            {(aria) => <Textarea {...aria} rows={3} {...register("resultat")} />}
          </ChampFormulaire>
        </div>

        <div className="space-y-12">
          <div className="space-y-5">
            <Surtitre as="h2">Affichage</Surtitre>

            <ChampFormulaire
              id="publie"
              libelle="Visibilité"
              aide={
                <>Un projet masqué reste enregistré mais n&apos;apparaît pas sur le site public.</>
              }
            >
              {(aria) => (
                <Select
                  {...aria}
                  {...register("publie", {
                    // Un `<select>` ne renvoie que des chaînes : on rétablit le booléen.
                    setValueAs: (valeur) => valeur === true || valeur === "true",
                  })}
                >
                  <option value="true">Visible dans la galerie</option>
                  <option value="false">Masqué</option>
                </Select>
              )}
            </ChampFormulaire>

            <ChampFormulaire
              id="ordre"
              libelle="Ordre d'affichage"
              erreur={errors.ordre?.message}
              aide={
                <>
                  Les plus petits nombres apparaissent en premier. À valeur égale, le projet le plus
                  récent passe devant.
                </>
              }
            >
              {(aria) => (
                <Input
                  {...aria}
                  type="number"
                  min={0}
                  max={999}
                  {...register("ordre", { valueAsNumber: true })}
                />
              )}
            </ChampFormulaire>
          </div>

          <div>
            <Surtitre as="h2" className="mb-4">
              Photographie
            </Surtitre>

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

            <ChampFormulaire
              id="image-alt-projet"
              libelle="Description de la photo"
              className="mt-4"
              erreur={errors.imageAlt?.message}
              aide={
                <>
                  Décrit la photo pour les personnes qui ne la voient pas. Ex. : « Une salle de
                  classe équipée de douze postes, des élèves y travaillent ».
                </>
              }
            >
              {(aria) => <Input {...aria} {...register("imageAlt")} />}
            </ChampFormulaire>
          </div>

          <div>
            <Surtitre as="h2" className="mb-4">
              Sur la carte
            </Surtitre>
            <SelecteurPosition
              latitude={latitude}
              longitude={longitude}
              onChange={(nouvelleLatitude, nouvelleLongitude) => {
                setValue("latitude", nouvelleLatitude, { shouldDirty: true, shouldValidate: true });
                setValue("longitude", nouvelleLongitude, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
            <MessageErreur>{errors.latitude?.message ?? errors.longitude?.message}</MessageErreur>
          </div>
        </div>
      </div>

      <div className="bg-fond/95 sticky bottom-0 flex flex-wrap items-center gap-x-6 gap-y-3 py-4 shadow-[0_-18px_24px_-22px_rgba(22,35,63,0.4)]">
        <Button type="submit" taille="lg" disabled={isSubmitting}>
          {isSubmitting
            ? "Enregistrement…"
            : modeEdition
              ? "Enregistrer les modifications"
              : "Créer le projet"}
          <Save aria-hidden="true" />
        </Button>
        <Button asChild variante="courbe">
          <Link href="/admin/projets">Retour à la liste</Link>
        </Button>
        {isDirty && !isSubmitting ? (
          <span className="text-doux text-sm">Modifications non enregistrées.</span>
        ) : null}
      </div>
    </form>
  );
}
