import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { exigerAdmin } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";
import { NavigationAdmin } from "@/components/admin/navigation-admin";
import { Button } from "@/components/ui/button";
import { Vague } from "@/components/formes";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  robots: { index: false, follow: false },
};

/**
 * Aucune page du back-office ne doit être pré-rendue ni mise en cache : son
 * contenu dépend de la session. La lecture des cookies suffirait normalement à
 * rendre ces routes dynamiques, mais cette déclaration explicite garantit le
 * comportement même si un build est lancé sans variables Supabase.
 */
export const dynamic = "force-dynamic";

/**
 * Layout du back-office.
 *
 * `exigerAdmin()` s'exécute côté serveur avant tout rendu : même si quelqu'un
 * contournait le middleware, aucune page enfant ne serait produite sans une
 * session valide ET une ligne correspondante dans la table `admins`.
 *
 * Cette vérification impose un rendu dynamique pour tout `/admin/*`, ce qui est
 * précisément le comportement attendu pour des pages privées.
 */
export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const admin = await exigerAdmin();

  return (
    <div className="bg-fond min-h-dvh">
      {/* En-tête marine terminé par une vague, comme le site public ; rien n'y
          tourne en boucle : c'est un outil de travail quotidien. */}
      <header className="bg-marine relative z-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-5 pt-4 pb-3">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="h-9" />
            <span className="font-titre text-lg font-bold">{site.nom}</span>
            <span className="bg-rouge-vif rounded-full px-2.5 py-0.5 text-xs font-bold">
              Administration
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-white/70 md:inline">
              {admin.nomAffichage || admin.email}
            </span>

            <Button asChild variante="courbe-clair" taille="sm">
              <Link href="/">
                <ExternalLink aria-hidden="true" />
                Voir le site
              </Link>
            </Button>

            {/* Formulaire POST : la déconnexion n'est pas déclenchable par un simple lien. */}
            <form action="/deconnexion" method="post">
              <button
                type="submit"
                className="hover:bg-rouge-vif inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold transition-colors"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Se déconnecter
              </button>
            </form>
          </div>
        </div>

        <NavigationAdmin />
        <Vague className="text-marine absolute inset-x-0 top-full" />
      </header>

      <main id="contenu-principal" className="mx-auto max-w-7xl px-5 pt-16 pb-12 md:pt-24">
        {children}
      </main>
    </div>
  );
}
