"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Images, LayoutDashboard, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const onglets = [
  { href: "/admin", libelle: "Tableau de bord", icone: LayoutDashboard, exact: true },
  { href: "/admin/articles", libelle: "Articles", icone: FileText, exact: false },
  { href: "/admin/projets", libelle: "Projets", icone: Images, exact: false },
  { href: "/admin/messages", libelle: "Messages", icone: Mail, exact: false },
] as const;

/** Barre d'onglets du back-office. Le seul composant client de cette section. */
export function NavigationAdmin() {
  const chemin = usePathname();

  return (
    <nav aria-label="Sections de l'administration" className="border-bordure border-t">
      <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3">
        {onglets.map((onglet) => {
          const actif = onglet.exact ? chemin === onglet.href : chemin.startsWith(onglet.href);
          return (
            <li key={onglet.href}>
              <Link
                href={onglet.href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap",
                  actif
                    ? "border-terre text-terre"
                    : "text-doux hover:text-encre border-transparent",
                )}
              >
                <onglet.icone className="size-4" aria-hidden="true" />
                {onglet.libelle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
