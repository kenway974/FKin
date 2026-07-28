import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { exigerAdmin } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";
import { NavigationAdmin } from "@/components/admin/navigation-admin";
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
    <div className="bg-sable min-h-dvh">
      <header className="border-bordure border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo className="size-8" />
            <span className="font-titre font-bold">
              {site.nom}
              <span className="bg-terre-voile text-terre-fonce ml-2 rounded-full px-2 py-0.5 text-xs font-semibold">
                Administration
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-doux hidden text-sm sm:inline">
              {admin.nomAffichage || admin.email}
            </span>

            <Link
              href="/"
              className="rounded-douce text-doux hover:bg-sable hover:text-terre inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Voir le site
            </Link>

            {/* Formulaire POST : la déconnexion n'est pas déclenchable par un simple lien. */}
            <form action="/deconnexion" method="post">
              <button
                type="submit"
                className="rounded-douce border-bordure hover:border-terre hover:text-terre inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-sm font-medium"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Se déconnecter
              </button>
            </form>
          </div>
        </div>

        <NavigationAdmin />
      </header>

      <main id="contenu-principal" className="mx-auto max-w-7xl px-5 py-8">
        {children}
      </main>
    </div>
  );
}
