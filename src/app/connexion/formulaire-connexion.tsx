"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ChampFormulaire, Input } from "@/components/ui/field";
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

      <ChampFormulaire id="email" libelle="Adresse e-mail" requis erreur={errors.email?.message}>
        {(aria) => (
          <Input
            {...aria}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            {...register("email")}
          />
        )}
      </ChampFormulaire>

      <ChampFormulaire
        id="mot-de-passe"
        libelle="Mot de passe"
        requis
        erreur={errors.motDePasse?.message}
      >
        {(aria) => (
          <Input
            {...aria}
            type="password"
            autoComplete="current-password"
            {...register("motDePasse")}
          />
        )}
      </ChampFormulaire>

      <Button type="submit" taille="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Connexion…" : "Se connecter"}
        <LogIn aria-hidden="true" />
      </Button>
    </form>
  );
}
