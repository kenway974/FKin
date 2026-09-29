"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blob } from "@/components/formes";
import { ChampFormulaire, Input } from "@/components/ui/field";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { schemaChiffre, type DonneesChiffre } from "@/lib/validation/contenu";
import type { ChiffreCle } from "@/types/database";
import { formaterChiffre } from "@/lib/utils";
import { enregistrerChiffre, supprimerChiffre } from "./actions";
import { Surtitre } from "@/components/ui/surtitre";

/**
 * Édition des chiffres d'impact : une ligne par chiffre, modifiable sur place,
 * avec l'aperçu du rendu de la page d'accueil à gauche. Une dernière ligne,
 * vide, sert à en ajouter un.
 */
export function EditeurChiffres({ chiffres }: { chiffres: ChiffreCle[] }) {
  return (
    <div className="space-y-2">
      <ul className="divide-bordure divide-y">
        {chiffres.map((chiffre) => (
          <li key={chiffre.id} className="py-8 first:pt-0">
            <LigneChiffre chiffre={chiffre} />
          </li>
        ))}
      </ul>
      <div className="pt-6">
        <Surtitre className="mb-6">Ajouter un chiffre</Surtitre>
        <LigneChiffre ordreParDefaut={chiffres.length} />
      </div>
    </div>
  );
}

function LigneChiffre({
  chiffre,
  ordreParDefaut = 0,
}: {
  chiffre?: ChiffreCle;
  ordreParDefaut?: number;
}) {
  const router = useRouter();
  const [retour, setRetour] = React.useState<{ ok: boolean; message: string } | null>(null);
  const prefixe = chiffre ? `chiffre-${chiffre.id}` : "nouveau-chiffre";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DonneesChiffre>({
    resolver: zodResolver(schemaChiffre),
    defaultValues: {
      valeur: chiffre?.valeur ?? undefined,
      suffixe: chiffre?.suffixe ?? "",
      libelle: chiffre?.libelle ?? "",
      precision: chiffre?.precision ?? "",
      ordre: chiffre?.ordre ?? ordreParDefaut,
    },
  });

  const valeur = watch("valeur");
  const suffixe = watch("suffixe");

  async function auEnvoi(donnees: DonneesChiffre) {
    setRetour(null);
    const reponse = await enregistrerChiffre(chiffre?.id ?? null, donnees);
    if (reponse.statut === "erreur") {
      for (const [champ, messages] of Object.entries(reponse.erreursChamps ?? {})) {
        if (messages?.[0]) setError(champ as keyof DonneesChiffre, { message: messages[0] });
      }
      setRetour({ ok: false, message: reponse.message });
      return;
    }
    setRetour({ ok: true, message: reponse.message });
    reset(
      chiffre
        ? donnees
        : { valeur: undefined, suffixe: "", libelle: "", precision: "", ordre: donnees.ordre + 1 },
    );
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(auEnvoi)}
      noValidate
      className="grid gap-6 md:grid-cols-[8rem_1fr] md:items-start"
    >
      {/* Aperçu du chiffre tel qu'il apparaîtra sur l'accueil. */}
      <Blob anime={false} teinte="bg-bleu-voile" variante={1} className="h-24 w-32 px-3">
        <span className="font-titre text-bleu truncate text-3xl font-bold">
          {Number.isFinite(valeur) ? formaterChiffre(valeur, suffixe ?? "") : "—"}
        </span>
      </Blob>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-[8rem_7rem_1fr]">
          <ChampFormulaire
            id={`${prefixe}-valeur`}
            libelle="Nombre"
            requis
            erreur={errors.valeur?.message}
          >
            {(aria) => (
              <Input
                {...aria}
                type="number"
                inputMode="numeric"
                min={0}
                {...register("valeur", { valueAsNumber: true })}
              />
            )}
          </ChampFormulaire>
          <ChampFormulaire
            id={`${prefixe}-suffixe`}
            libelle="Unité"
            erreur={errors.suffixe?.message}
          >
            {(aria) => <Input {...aria} placeholder="%, t, +…" {...register("suffixe")} />}
          </ChampFormulaire>
          <ChampFormulaire
            id={`${prefixe}-libelle`}
            libelle="Ce que compte ce chiffre"
            requis
            erreur={errors.libelle?.message}
          >
            {(aria) => (
              <Input
                {...aria}
                placeholder="Ex. : ordinateurs remis en service"
                {...register("libelle")}
              />
            )}
          </ChampFormulaire>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
          <ChampFormulaire
            id={`${prefixe}-precision`}
            libelle="Précision"
            erreur={errors.precision?.message}
          >
            {(aria) => (
              <Input
                {...aria}
                placeholder="Ex. : depuis 2021, en France et au Congo"
                {...register("precision")}
              />
            )}
          </ChampFormulaire>
          <ChampFormulaire id={`${prefixe}-ordre`} libelle="Position">
            {(aria) => (
              <Input
                {...aria}
                type="number"
                inputMode="numeric"
                min={0}
                {...register("ordre", { valueAsNumber: true })}
              />
            )}
          </ChampFormulaire>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button type="submit" taille="sm" disabled={isSubmitting || (chiffre && !isDirty)}>
            {isSubmitting ? "Enregistrement…" : chiffre ? "Enregistrer" : "Ajouter"}
            {chiffre ? <Save aria-hidden="true" /> : <Plus aria-hidden="true" />}
          </Button>
          {chiffre ? (
            <BoutonSuppression
              intitule={chiffre.libelle}
              onSupprimer={supprimerChiffre.bind(null, chiffre.id)}
            />
          ) : null}
          {retour ? (
            <p
              role="status"
              className={
                retour.ok ? "text-bleu text-sm font-semibold" : "text-sm font-semibold text-red-800"
              }
            >
              {retour.message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
