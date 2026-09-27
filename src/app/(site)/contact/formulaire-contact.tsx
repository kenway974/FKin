"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, GraduationCap, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { AideChamp, Champ, Input, Label, MessageErreur, Textarea } from "@/components/ui/field";
import { schemaContact, type DonneesContact } from "@/lib/validation/contact";
import { envoyerMessageContact } from "./actions";
import type { ResultatContact } from "@/lib/actions-types";
import { cn } from "@/lib/utils";

/**
 * Formulaire de contact.
 *
 * Le schéma zod est partagé avec la Server Action : la validation affichée à
 * l'écran et celle réellement appliquée côté serveur ne peuvent pas diverger.
 *
 * Le paramètre d'URL `?profil=entreprise|beneficiaire` pré-sélectionne le type
 * d'émetteur, ce qui permet aux boutons d'appel à l'action des autres pages
 * d'amener le visiteur directement sur le bon parcours.
 */
export function FormulaireContact() {
  const parametres = useSearchParams();
  const profilInitial = parametres.get("profil");

  const [resultat, setResultat] = React.useState<ResultatContact | null>(null);
  const referenceResultat = React.useRef<HTMLDivElement>(null);

  // Horodatage d'affichage : sert de piège temporel côté serveur.
  const [charge] = React.useState(() => Date.now());

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DonneesContact>({
    resolver: zodResolver(schemaContact),
    defaultValues: {
      nom: "",
      email: "",
      organisation: "",
      telephone: "",
      typeEmetteur:
        profilInitial === "entreprise" || profilInitial === "beneficiaire"
          ? profilInitial
          : undefined,
      sujet: "",
      message: "",
      siteWeb: "",
    },
  });

  async function auEnvoi(donnees: DonneesContact) {
    const reponse = await envoyerMessageContact({ ...donnees, charge });
    setResultat(reponse);

    if (reponse.statut === "succes") {
      reset({ charge: Date.now() });
    } else if (reponse.erreursChamps) {
      // Remonte les erreurs renvoyées par le serveur dans les champs concernés.
      for (const [champ, messages] of Object.entries(reponse.erreursChamps)) {
        if (messages?.[0]) {
          setError(champ as keyof DonneesContact, { type: "server", message: messages[0] });
        }
      }
    }

    // Déplace le focus sur le bandeau de réponse pour que les utilisateurs de
    // lecteur d'écran et de clavier prennent connaissance du résultat.
    referenceResultat.current?.focus();
  }

  const profils = [
    {
      valeur: "entreprise" as const,
      libelle: "Une entreprise donatrice",
      precision: "En France, je donne du matériel.",
      icone: Building2,
    },
    {
      valeur: "beneficiaire" as const,
      libelle: "Une structure bénéficiaire",
      precision: "Au Congo, je cherche à être équipée.",
      icone: GraduationCap,
    },
  ];

  return (
    <form onSubmit={handleSubmit(auEnvoi)} noValidate className="space-y-6">
      <div ref={referenceResultat} tabIndex={-1} className="outline-none">
        {resultat ? (
          <Alert
            ton={resultat.statut === "succes" ? "succes" : "erreur"}
            titre={resultat.statut === "succes" ? "Message envoyé" : "Envoi impossible"}
          >
            <p>{resultat.message}</p>
          </Alert>
        ) : null}
      </div>

      {/* ------------------------------------------------ Type d'émetteur */}
      <fieldset className="space-y-3">
        <legend className="text-encre text-sm font-semibold">
          Je suis <span aria-hidden="true">*</span>
          <span className="sr-only">(champ obligatoire)</span>
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          {profils.map((profil) => (
            <label
              key={profil.valeur}
              className={cn(
                "rounded-douce border-bordure flex cursor-pointer gap-3 border-2 bg-white p-4",
                "has-[:checked]:border-terre has-[:checked]:bg-terre-voile",
                "has-[:focus-visible]:outline-vert has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2",
              )}
            >
              <input
                type="radio"
                value={profil.valeur}
                {...register("typeEmetteur")}
                aria-describedby={errors.typeEmetteur ? "erreur-profil" : undefined}
                className="mt-1 size-4 shrink-0 accent-[#9c4a1f]"
              />
              <span>
                <span className="text-encre flex items-center gap-2 font-semibold">
                  <profil.icone className="text-terre size-4" aria-hidden="true" />
                  {profil.libelle}
                </span>
                <span className="text-doux mt-0.5 block text-sm">{profil.precision}</span>
              </span>
            </label>
          ))}
        </div>

        <MessageErreur id="erreur-profil">{errors.typeEmetteur?.message}</MessageErreur>
      </fieldset>

      {/* ------------------------------------------------------ Identité */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Champ>
          <Label htmlFor="nom">
            Nom et prénom <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="nom"
            autoComplete="name"
            aria-required="true"
            aria-invalid={errors.nom ? true : undefined}
            aria-describedby={errors.nom ? "erreur-nom" : undefined}
            {...register("nom")}
          />
          <MessageErreur id="erreur-nom">{errors.nom?.message}</MessageErreur>
        </Champ>

        <Champ>
          <Label htmlFor="email">
            Adresse e-mail <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "erreur-email" : undefined}
            {...register("email")}
          />
          <MessageErreur id="erreur-email">{errors.email?.message}</MessageErreur>
        </Champ>

        <Champ>
          <Label htmlFor="organisation">Organisation</Label>
          <Input
            id="organisation"
            autoComplete="organization"
            aria-describedby="aide-organisation"
            {...register("organisation")}
          />
          <AideChamp id="aide-organisation">Entreprise, école, mairie ou association.</AideChamp>
        </Champ>

        <Champ>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-describedby="aide-telephone"
            {...register("telephone")}
          />
          <AideChamp id="aide-telephone">Facultatif, utile pour organiser un enlèvement.</AideChamp>
        </Champ>
      </div>

      {/* -------------------------------------------------------- Message */}
      <Champ>
        <Label htmlFor="sujet">
          Objet <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="sujet"
          aria-required="true"
          aria-invalid={errors.sujet ? true : undefined}
          aria-describedby={errors.sujet ? "erreur-sujet" : undefined}
          placeholder="Ex. : 25 postes de travail à enlever avant fin mars"
          {...register("sujet")}
        />
        <MessageErreur id="erreur-sujet">{errors.sujet?.message}</MessageErreur>
      </Champ>

      <Champ>
        <Label htmlFor="message">
          Votre message <span aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="message"
          rows={7}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "erreur-message" : "aide-message"}
          {...register("message")}
        />
        {errors.message ? (
          <MessageErreur id="erreur-message">{errors.message.message}</MessageErreur>
        ) : (
          <AideChamp id="aide-message">
            Décrivez le matériel et son volume, ou vos besoins. Plus c&apos;est précis, plus notre
            réponse est rapide.
          </AideChamp>
        )}
      </Champ>

      {/*
        Honeypot : masqué visuellement et retiré du parcours au clavier comme de
        l'arbre d'accessibilité. Seul un robot remplissant tous les champs le
        renseignera, ce qui suffit à écarter l'essentiel du spam automatisé.
      */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="site-web">Ne pas remplir ce champ</label>
        <input
          id="site-web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("siteWeb")}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" taille="lg" disabled={isSubmitting}>
          <Send className="size-4" aria-hidden="true" />
          {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
        </Button>
        <p className="text-doux text-sm">
          Les champs marqués d&apos;un astérisque sont obligatoires.
        </p>
      </div>

      <p className="text-doux text-xs leading-relaxed">
        Vos informations servent uniquement à traiter votre demande. Ni revendues, ni transmises à
        des tiers. Suppression possible à tout moment.
      </p>
    </form>
  );
}
