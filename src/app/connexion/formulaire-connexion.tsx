"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Champ, Input, Label, MessageErreur } from "@/components/ui/field";
import { creerClientNavigateur } from "@/lib/supabase/client";

const schemaConnexion = z.object({
  email: z.email("Adresse e-mail invalide."),
  motDePasse: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

type DonneesConnexion = z.infer<typeof schemaConnexion>;

/**
 * Formulaire de connexion.
 *
 * L'authentification passe par le client navigateur de Supabase : c'est lui qui
 * pose les cookies de session, ensuite lus et rafraîchis par le middleware.
 * Aucun mot de passe ne transite par nos propres routes.
 *
 * Le paramètre `?suite=` conserve la page demandée avant la redirection, afin
 * de renvoyer l'administrateur exactement là où il voulait aller.
 */
export function FormulaireConnexion() {
  const router = useRouter();
  const parametres = useSearchParams();
  const [erreurGlobale, setErreurGlobale] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DonneesConnexion>({
    resolver: zodResolver(schemaConnexion),
    defaultValues: { email: "", motDePasse: "" },
  });

  async function auEnvoi(donnees: DonneesConnexion) {
    setErreurGlobale(null);

    const supabase = creerClientNavigateur();
    if (!supabase) {
      setErreurGlobale("La connexion à Supabase n'est pas configurée.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: donnees.email,
      password: donnees.motDePasse,
    });

    if (error) {
      // Message volontairement générique : il ne révèle pas si l'adresse
      // existe, ce qui empêche d'énumérer les comptes.
      setErreurGlobale("Adresse e-mail ou mot de passe incorrect.");
      return;
    }

    // Une destination doit rester interne au site : on refuse toute URL absolue
    // pour empêcher une redirection ouverte via `?suite=https://…`.
    const suite = parametres.get("suite");
    const destination =
      suite && suite.startsWith("/") && !suite.startsWith("//") ? suite : "/admin";

    router.replace(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(auEnvoi)} noValidate className="space-y-5">
      {erreurGlobale ? (
        <Alert ton="erreur" titre="Connexion refusée">
          <p>{erreurGlobale}</p>
        </Alert>
      ) : null}

      <Champ>
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "erreur-email" : undefined}
          {...register("email")}
        />
        <MessageErreur id="erreur-email">{errors.email?.message}</MessageErreur>
      </Champ>

      <Champ>
        <Label htmlFor="mot-de-passe">Mot de passe</Label>
        <Input
          id="mot-de-passe"
          type="password"
          autoComplete="current-password"
          aria-required="true"
          aria-invalid={errors.motDePasse ? true : undefined}
          aria-describedby={errors.motDePasse ? "erreur-mot-de-passe" : undefined}
          {...register("motDePasse")}
        />
        <MessageErreur id="erreur-mot-de-passe">{errors.motDePasse?.message}</MessageErreur>
      </Champ>

      <Button type="submit" taille="lg" className="w-full" disabled={isSubmitting}>
        <LogIn className="size-4" aria-hidden="true" />
        {isSubmitting ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
