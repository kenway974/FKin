"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blob } from "@/components/formes";
import { Champ, Input, Label, MessageErreur } from "@/components/ui/field";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { schemaChiffre, type DonneesChiffre } from "@/lib/validation/contenu";
import type { ChiffreCle } from "@/types/database";
import { enregistrerChiffre, supprimerChiffre } from "./actions";

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
        <p className="text-rouge mb-6 flex items-center gap-2 text-sm font-extrabold tracking-[0.14em] uppercase">
          <span className="bg-rouge-vif inline-block h-2 w-6 rounded-full" aria-hidden="true" />
          Ajouter un chiffre
        </p>
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
          {Number.isFinite(valeur)
            ? `${valeur.toLocaleString("fr-FR")}${
                !suffixe ? "" : suffixe.startsWith("+") ? suffixe : `\u202f${suffixe}`
              }`
            : "—"}
        </span>
      </Blob>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-[8rem_7rem_1fr]">
          <Champ>
            <Label htmlFor={`${prefixe}-valeur`}>Nombre *</Label>
            <Input
              id={`${prefixe}-valeur`}
              type="number"
              inputMode="numeric"
              min={0}
              aria-invalid={errors.valeur ? true : undefined}
              {...register("valeur", { valueAsNumber: true })}
            />
            <MessageErreur>{errors.valeur?.message}</MessageErreur>
          </Champ>
          <Champ>
            <Label htmlFor={`${prefixe}-suffixe`}>Unité</Label>
            <Input id={`${prefixe}-suffixe`} placeholder="%, t, +…" {...register("suffixe")} />
            <MessageErreur>{errors.suffixe?.message}</MessageErreur>
          </Champ>
          <Champ>
            <Label htmlFor={`${prefixe}-libelle`}>Ce que compte ce chiffre *</Label>
            <Input
              id={`${prefixe}-libelle`}
              placeholder="Ex. : ordinateurs remis en service"
              aria-invalid={errors.libelle ? true : undefined}
              {...register("libelle")}
            />
            <MessageErreur>{errors.libelle?.message}</MessageErreur>
          </Champ>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
          <Champ>
            <Label htmlFor={`${prefixe}-precision`}>Précision</Label>
            <Input
              id={`${prefixe}-precision`}
              placeholder="Ex. : depuis 2021, en France et au Congo"
              {...register("precision")}
            />
            <MessageErreur>{errors.precision?.message}</MessageErreur>
          </Champ>
          <Champ>
            <Label htmlFor={`${prefixe}-ordre`}>Position</Label>
            <Input
              id={`${prefixe}-ordre`}
              type="number"
              inputMode="numeric"
              min={0}
              {...register("ordre", { valueAsNumber: true })}
            />
          </Champ>
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
