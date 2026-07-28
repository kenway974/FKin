"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <div className="max-w-lg text-center">
        <h1 className="font-titre text-3xl font-bold">Une erreur est survenue</h1>
        <p className="text-doux mt-3">
          La page n&apos;a pas pu s&apos;afficher correctement. Vous pouvez réessayer : le problème
          est souvent passager.
        </p>
        {error.digest ? (
          <p className="text-doux mt-2 text-xs">Référence de l&apos;incident : {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Réessayer</Button>
          <Button asChild variante="contour">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
