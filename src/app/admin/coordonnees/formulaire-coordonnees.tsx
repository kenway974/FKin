"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChampFormulaire, Input } from "@/components/ui/field";
import { Surtitre } from "@/components/ui/surtitre";
import { schemaCoordonnees, type DonneesCoordonnees } from "@/lib/validation/contenu";
import { enregistrerCoordonnees } from "./actions";

/** Formulaire unique des coordonnées du site. */
export function FormulaireCoordonnees({ valeurs }: { valeurs: DonneesCoordonnees }) {
  const router = useRouter();
  const [retour, setRetour] = React.useState<{ ok: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DonneesCoordonnees>({
    resolver: zodResolver(schemaCoordonnees),
    defaultValues: valeurs,
  });

  async function auEnvoi(donnees: DonneesCoordonnees) {
    setRetour(null);
    const reponse = await enregistrerCoordonnees(donnees);
    if (reponse.statut === "erreur") {
      for (const [champ, messages] of Object.entries(reponse.erreursChamps ?? {})) {
        if (messages?.[0]) setError(champ as keyof DonneesCoordonnees, { message: messages[0] });
      }
      setRetour({ ok: false, message: reponse.message });
      return;
    }
    setRetour({ ok: true, message: reponse.message });
    reset(donnees);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(auEnvoi)} noValidate className="max-w-3xl space-y-12">
      <div className="space-y-5">
        <Surtitre as="h2">Nous joindre</Surtitre>
        <ChampFormulaire
          id="email"
          libelle="E-mail"
          requis
          erreur={errors.email?.message}
          aide="C'est aussi l'adresse qui reçoit les messages du formulaire de contact."
        >
          {(aria) => <Input {...aria} type="email" autoComplete="email" {...register("email")} />}
        </ChampFormulaire>
        <div className="grid gap-5 sm:grid-cols-2">
          <ChampFormulaire
            id="telephone"
            libelle="Téléphone"
            erreur={errors.telephone?.message}
            aide="Laissez vide pour ne pas afficher de téléphone."
          >
            {(aria) => (
              <Input
                {...aria}
                type="tel"
                placeholder="+33 6 12 34 56 78"
                {...register("telephone")}
              />
            )}
          </ChampFormulaire>
          <ChampFormulaire
            id="whatsapp"
            libelle="WhatsApp"
            erreur={errors.whatsapp?.message}
            aide="Format international, par exemple +33 6 12 34 56 78."
          >
            {(aria) => (
              <Input
                {...aria}
                type="tel"
                placeholder="+243 81 234 5678"
                {...register("whatsapp")}
              />
            )}
          </ChampFormulaire>
        </div>
      </div>

      <div className="space-y-5">
        <Surtitre as="h2">Adresse en France</Surtitre>
        <ChampFormulaire id="rue" libelle="Rue" erreur={errors.rue?.message}>
          {(aria) => <Input {...aria} autoComplete="street-address" {...register("rue")} />}
        </ChampFormulaire>
        <div className="grid gap-5 sm:grid-cols-[9rem_1fr]">
          <ChampFormulaire
            id="codePostal"
            libelle="Code postal"
            requis
            erreur={errors.codePostal?.message}
          >
            {(aria) => <Input {...aria} inputMode="numeric" {...register("codePostal")} />}
          </ChampFormulaire>
          <ChampFormulaire id="ville" libelle="Ville" requis erreur={errors.ville?.message}>
            {(aria) => <Input {...aria} {...register("ville")} />}
          </ChampFormulaire>
        </div>
      </div>

      <div className="space-y-5">
        <Surtitre as="h2">Adresse à Kinshasa</Surtitre>
        <ChampFormulaire
          id="adresseRdc"
          libelle="Adresse postale"
          erreur={errors.adresseRdc?.message}
          aide="Adresse postale de l'association à Kinshasa, affichée dans le pied de page. Laissez vide pour la masquer."
        >
          {(aria) => <Input {...aria} {...register("adresseRdc")} />}
        </ChampFormulaire>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
          <Save aria-hidden="true" />
        </Button>
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
    </form>
  );
}
