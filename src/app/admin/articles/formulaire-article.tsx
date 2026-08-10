"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
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
import { schemaArticle, type DonneesArticle } from "@/lib/validation/contenu";
import { genererSlug } from "@/lib/utils";
import { creerArticle, modifierArticle } from "./actions";
import type { ResultatAction } from "@/lib/actions-types";
import type { Article } from "@/types/database";

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
    if (slugAuto) {
      setValue("slug", genererSlug(titre ?? ""), { shouldValidate: true });
    }
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

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* ------------------------------------------------------- Contenu */}
        <div className="rounded-douce border-bordure space-y-5 border bg-white p-5 md:p-6">
          <Champ>
            <Label htmlFor="titre">
              Titre <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="titre"
              aria-required="true"
              aria-invalid={errors.titre ? true : undefined}
              {...register("titre")}
            />
            <MessageErreur>{errors.titre?.message}</MessageErreur>
          </Champ>

          <Champ>
            <Label htmlFor="slug">
              Adresse de la page (slug) <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="slug"
              aria-required="true"
              aria-invalid={errors.slug ? true : undefined}
              aria-describedby="aide-slug"
              {...register("slug", { onChange: () => setSlugAuto(false) })}
            />
            <AideChamp id="aide-slug">
              Généré automatiquement à partir du titre (modifiable). L&apos;article sera accessible
              à l&apos;adresse /actualites/<strong>{watch("slug") || "votre-slug"}</strong>. Évitez
              de le modifier une fois l&apos;article publié : les liens existants cesseraient de
              fonctionner.
            </AideChamp>
            <MessageErreur>{errors.slug?.message}</MessageErreur>
          </Champ>

          <Champ>
            <Label htmlFor="extrait">Chapô</Label>
            <Textarea
              id="extrait"
              rows={3}
              aria-describedby="aide-extrait"
              {...register("extrait")}
            />
            <AideChamp id="aide-extrait">
              Deux ou trois phrases affichées en tête d&apos;article et dans les aperçus. Sert
              également de description pour les moteurs de recherche (300 caractères maximum).
            </AideChamp>
            <MessageErreur>{errors.extrait?.message}</MessageErreur>
          </Champ>

          <Champ>
            <Label htmlFor="contenu">
              Contenu <span aria-hidden="true">*</span>
            </Label>
            <Textarea
              id="contenu"
              rows={18}
              aria-required="true"
              aria-invalid={errors.contenu ? true : undefined}
              aria-describedby="aide-contenu"
              {...register("contenu")}
            />
            <AideChamp id="aide-contenu">
              Texte simple. Laissez une ligne vide entre deux paragraphes : chaque bloc sera affiché
              comme un paragraphe distinct. La mise en forme HTML n&apos;est pas interprétée, pour
              des raisons de sécurité.
            </AideChamp>
            <MessageErreur>{errors.contenu?.message}</MessageErreur>
          </Champ>
        </div>

        {/* ----------------------------------------------------- Publication */}
        <div className="space-y-5">
          <div className="rounded-douce border-bordure space-y-5 border bg-white p-5">
            <h2 className="font-titre text-lg font-bold">Publication</h2>

            <Champ>
              <Label htmlFor="statut">Statut</Label>
              <Select id="statut" aria-describedby="aide-statut" {...register("statut")}>
                <option value="brouillon">Brouillon (non visible)</option>
                <option value="publie">Publié (visible sur le site)</option>
              </Select>
              <AideChamp id="aide-statut">
                Un brouillon reste invisible pour les visiteurs, même en connaissant son adresse.
              </AideChamp>
            </Champ>

            <Champ>
              <Label htmlFor="date-publication">Date de publication</Label>
              <Input id="date-publication" type="date" {...register("datePublication")} />
              <AideChamp>Laissez vide pour utiliser la date du jour à la publication.</AideChamp>
              <MessageErreur>{errors.datePublication?.message}</MessageErreur>
            </Champ>

            <Champ>
              <Label htmlFor="auteur">Signature</Label>
              <Input id="auteur" placeholder="Ex. : L'équipe de collecte" {...register("auteur")} />
            </Champ>
          </div>

          <div className="rounded-douce border-bordure border bg-white p-5">
            <h2 className="font-titre mb-4 text-lg font-bold">Image de couverture</h2>

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

            <Champ className="mt-4">
              <Label htmlFor="image-alt">Description de l&apos;image</Label>
              <Input id="image-alt" aria-describedby="aide-alt" {...register("imageAlt")} />
              <AideChamp id="aide-alt">
                Décrit l&apos;image pour les personnes utilisant un lecteur d&apos;écran, et
                s&apos;affiche si l&apos;image ne se charge pas. Ex. : « Des élèves devant les
                postes de la nouvelle salle informatique ».
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
              : "Créer l'article"}
        </Button>
        <Button asChild variante="discret">
          <Link href="/admin/articles">Retour à la liste</Link>
        </Button>
        {isDirty && !isSubmitting ? (
          <span className="text-doux text-sm">Modifications non enregistrées.</span>
        ) : null}
      </div>
    </form>
  );
}
