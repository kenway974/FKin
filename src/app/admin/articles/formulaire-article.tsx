"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ChampFormulaire, Input, Select, Textarea } from "@/components/ui/field";
import { TeleversementImage } from "@/components/admin/televersement-image";
import { schemaArticle, type DonneesArticle } from "@/lib/validation/contenu";
import { genererSlug } from "@/lib/utils";
import { creerArticle, modifierArticle } from "./actions";
import type { ResultatAction } from "@/lib/actions-types";
import type { Article } from "@/types/database";
import { Surtitre } from "@/components/ui/surtitre";

/**
 * Formulaire de création et de modification d'un article.
 *
 * Un seul composant pour les deux usages : le mode est déduit de la présence
 * d'un article existant. Cela évite de maintenir deux formulaires qui
 * finiraient par diverger.
 */
export function FormulaireArticle({ article }: { article?: Article }) {
  const router = useRouter();
  const modeEdition = Boolean(article);
  const [resultat, setResultat] = React.useState<ResultatAction | null>(null);
  const referenceResultat = React.useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DonneesArticle>({
    resolver: zodResolver(schemaArticle),
    defaultValues: {
      titre: article?.titre ?? "",
      slug: article?.slug ?? "",
      extrait: article?.extrait ?? "",
      contenu: article?.contenu ?? "",
      imageCouverture: article?.image_couverture ?? "",
      imageAlt: article?.image_alt ?? "",
      statut: article?.statut ?? "brouillon",
      datePublication: article?.date_publication?.slice(0, 10) ?? "",
      auteur: article?.auteur ?? "",
    },
  });

  const titre = watch("titre");
  const imageCouverture = watch("imageCouverture") ?? "";

  // Le slug se génère automatiquement à partir du titre tant que l'utilisateur
  // ne l'a pas modifié à la main. En édition, on n'y touche jamais : changer le
  // slug d'un article publié casserait les liens existants.
  const [slugAuto, setSlugAuto] = React.useState(!modeEdition);
  React.useEffect(() => {
    if (!slugAuto) return;
    const genere = genererSlug(titre ?? "");
    // La validation n'est déclenchée que s'il y a un slug à valider : sinon un
    // formulaire vierge afficherait l'erreur « le slug doit contenir au moins
    // 3 caractères » avant même que le titre ait été saisi.
    setValue("slug", genere, { shouldValidate: genere.length > 0 });
  }, [titre, slugAuto, setValue]);

  async function auEnvoi(donnees: DonneesArticle) {
    const reponse = modeEdition
      ? await modifierArticle(article!.id, donnees)
      : await creerArticle(donnees);

    setResultat(reponse);
    referenceResultat.current?.focus();

    if (reponse.statut === "erreur" && reponse.erreursChamps) {
      for (const [champ, messages] of Object.entries(reponse.erreursChamps)) {
        if (messages?.[0]) {
          setError(champ as keyof DonneesArticle, { type: "server", message: messages[0] });
        }
      }
      return;
    }

    if (reponse.statut === "succes") {
      // Après création, on bascule sur la fiche d'édition : l'utilisateur
      // retrouve son article au lieu d'un formulaire vide.
      if (!modeEdition && reponse.id) {
        router.replace(`/admin/articles/${reponse.id}`);
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
        {/* ------------------------------------------------------- Contenu */}
        <div className="space-y-7">
          <ChampFormulaire id="titre" libelle="Titre" requis erreur={errors.titre?.message}>
            {(aria) => <Input {...aria} {...register("titre")} />}
          </ChampFormulaire>

          <ChampFormulaire
            id="slug"
            libelle="Adresse de la page (slug)"
            requis
            erreur={errors.slug?.message}
            aide={
              <>
                Généré automatiquement à partir du titre (modifiable). L&apos;article sera
                accessible à l&apos;adresse /actualites/
                <strong>{watch("slug") || "votre-slug"}</strong>. Évitez de le modifier une fois
                l&apos;article publié : les liens existants cesseraient de fonctionner.
              </>
            }
          >
            {(aria) => (
              <Input {...aria} {...register("slug", { onChange: () => setSlugAuto(false) })} />
            )}
          </ChampFormulaire>

          <ChampFormulaire
            id="extrait"
            libelle="Chapô"
            erreur={errors.extrait?.message}
            aide={
              <>
                Deux ou trois phrases affichées en tête d&apos;article et dans les aperçus. Sert
                également de description pour les moteurs de recherche (300 caractères maximum).
              </>
            }
          >
            {(aria) => <Textarea {...aria} rows={3} {...register("extrait")} />}
          </ChampFormulaire>

          <ChampFormulaire
            id="contenu"
            libelle="Contenu"
            requis
            erreur={errors.contenu?.message}
            aide={
              <>
                Texte simple. Laissez une ligne vide entre deux paragraphes : chaque bloc sera
                affiché comme un paragraphe distinct. La mise en forme HTML n&apos;est pas
                interprétée, pour des raisons de sécurité.
              </>
            }
          >
            {(aria) => <Textarea {...aria} rows={18} {...register("contenu")} />}
          </ChampFormulaire>
        </div>

        {/* ----------------------------------------------------- Publication */}
        <div className="space-y-12">
          <div className="space-y-5">
            <Surtitre as="h2">Publication</Surtitre>

            <ChampFormulaire
              id="statut"
              libelle="Statut"
              aide="Un brouillon reste invisible pour les visiteurs, même en connaissant son adresse."
            >
              {(aria) => (
                <Select {...aria} aria-describedby="aide-statut" {...register("statut")}>
                  <option value="brouillon">Brouillon (non visible)</option>
                  <option value="publie">Publié (visible sur le site)</option>
                </Select>
              )}
            </ChampFormulaire>

            <ChampFormulaire
              id="date-publication"
              libelle="Date de publication"
              erreur={errors.datePublication?.message}
              aide="Laissez vide pour utiliser la date du jour à la publication."
            >
              {(aria) => <Input {...aria} type="date" {...register("datePublication")} />}
            </ChampFormulaire>

            <ChampFormulaire id="auteur" libelle="Signature">
              {(aria) => (
                <Input {...aria} placeholder="Ex. : L'équipe de collecte" {...register("auteur")} />
              )}
            </ChampFormulaire>
          </div>

          <div>
            <Surtitre as="h2" className="mb-4">
              Image de couverture
            </Surtitre>

            <TeleversementImage
              identifiant="image-couverture"
              dossier="articles"
              nomBase={titre}
              valeur={imageCouverture}
              onChange={(url) =>
                setValue("imageCouverture", url, { shouldDirty: true, shouldValidate: true })
              }
              erreur={errors.imageCouverture?.message}
            />

            <ChampFormulaire
              id="image-alt"
              libelle="Description de l'image"
              className="mt-4"
              erreur={errors.imageAlt?.message}
              aide={
                <>
                  Décrit l&apos;image pour les personnes utilisant un lecteur d&apos;écran, et
                  s&apos;affiche si l&apos;image ne se charge pas. Ex. : « Des élèves devant les
                  postes de la nouvelle salle informatique ».
                </>
              }
            >
              {(aria) => <Input {...aria} aria-describedby="aide-alt" {...register("imageAlt")} />}
            </ChampFormulaire>
          </div>
        </div>
      </div>

      <div className="bg-fond/95 sticky bottom-0 flex flex-wrap items-center gap-x-6 gap-y-3 py-4 shadow-[0_-18px_24px_-22px_rgba(22,35,63,0.4)]">
        <Button type="submit" taille="lg" disabled={isSubmitting}>
          {isSubmitting
            ? "Enregistrement…"
            : modeEdition
              ? "Enregistrer les modifications"
              : "Créer l'article"}
          <Save aria-hidden="true" />
        </Button>
        <Button asChild variante="courbe">
          <Link href="/admin/articles">Retour à la liste</Link>
        </Button>
        {isDirty && !isSubmitting ? (
          <span className="text-doux text-sm">Modifications non enregistrées.</span>
        ) : null}
      </div>
    </form>
  );
}
