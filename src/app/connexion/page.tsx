import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannierePage } from "@/components/bannieres";
import { Alert } from "@/components/ui/alert";
import { FormulaireConnexion } from "./formulaire-connexion";
import { supabaseConfigure } from "@/lib/env";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Connexion",
  // Cette page n'a aucun intérêt dans un index de moteur de recherche.
  robots: { index: false, follow: false },
};

/**
 * Page de connexion au back-office. Volontairement hors du layout public,
 * mais dans la langue du site : bannière marine avec vague et ruban, puis le
 * formulaire posé directement sur la page, sans cadre.
 */
export default function PageConnexion() {
  return (
    <div className="flex min-h-dvh flex-col">
      <BannierePage
        surtitre="Espace réservé"
        titre="Espace d'administration"
        chapo={`Gestion des actualités, des réalisations et des messages de ${site.nom}.`}
        className="mt-0 pt-0 md:mt-0 md:pt-0"
        avant={
          <Button asChild variante="courbe-clair">
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Retour au site
            </Link>
          </Button>
        }
      />

      <main id="contenu-principal" className="contenu w-full flex-1 pt-10 pb-16">
        <div className="max-w-md">
          {supabaseConfigure ? (
            <Suspense
              fallback={
                <p role="status" className="text-doux">
                  Chargement…
                </p>
              }
            >
              <FormulaireConnexion />
            </Suspense>
          ) : (
            <Alert ton="erreur" titre="Authentification non configurée">
              <p>
                Les variables <code className="break-all">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
                <code className="break-all">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ne sont pas
                renseignées. Consultez la section « Brancher Supabase » du README.
              </p>
            </Alert>
          )}

          <p className="text-doux mt-8 text-xs">
            Accès réservé aux personnes déclarées administratrices. Un compte Supabase valide ne
            suffit pas.
          </p>
        </div>
      </main>
    </div>
  );
}
