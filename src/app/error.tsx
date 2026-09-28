"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannierePage } from "@/components/bannieres";

/**
 * Écran d'erreur des pages du site.
 *
 * Aucun détail technique n'est montré au visiteur : la trace complète reste
 * dans les logs du serveur. Seul l'identifiant de l'incident (`digest`) est
 * affiché, ce qui permet de retrouver l'erreur côté hébergeur sans rien
 * divulguer sur l'infrastructure.
 */
export default function Erreur({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Erreur non gérée :", error);
  }, [error]);

  return (
    <BannierePage
      surtitre="Incident"
      titre="Une erreur est survenue"
      chapo="La page n'a pas pu s'afficher correctement. Vous pouvez réessayer : le problème est souvent passager."
      className="mt-0 flex min-h-dvh flex-col justify-center pt-0 md:mt-0 md:pt-0"
    >
      {error.digest ? (
        <p className="text-sm text-white/70">Référence de l&apos;incident : {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
        <Button onClick={reset} variante="clair">
          Réessayer
          <RotateCcw className="size-4" aria-hidden="true" />
        </Button>
        <Button asChild variante="courbe-clair">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </BannierePage>
  );
}
