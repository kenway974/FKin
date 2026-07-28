import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Alert } from "@/components/ui/alert";
import { FormulaireConnexion } from "./formulaire-connexion";
import { supabaseConfigure } from "@/lib/env";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Connexion",
  // Cette page n'a aucun intérêt dans un index de moteur de recherche.
  robots: { index: false, follow: false },
};

/** Page de connexion au back-office. Volontairement hors du layout public. */
export default function PageConnexion() {
  return (
    <div className="bg-sable motif-tissu flex min-h-dvh flex-col">
      <div className="contenu py-6">
        <Link
          href="/"
          className="text-doux hover:text-terre inline-flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour au site
        </Link>
      </div>

      <main id="contenu-principal" className="flex flex-1 items-start justify-center px-5 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo className="size-14" />
            <h1 className="font-titre mt-3 text-2xl font-bold">Espace d&apos;administration</h1>
            <p className="text-doux mt-1 text-sm">{site.nom}</p>
          </div>

          <div className="rounded-douce border-bordure border bg-white p-6 shadow-sm md:p-8">
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
                  Les variables <code>NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ne sont pas renseignées. Consultez la
                  section « Brancher Supabase » du README.
                </p>
              </Alert>
            )}
          </div>

          <p className="text-doux mt-5 text-center text-xs">
            Accès réservé aux personnes déclarées administratrices. Un compte Supabase valide ne
            suffit pas.
          </p>
        </div>
      </main>
    </div>
  );
}
