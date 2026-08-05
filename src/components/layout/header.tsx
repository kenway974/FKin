"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigation, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

/**
 * En-tête du site.
 *
 * Le menu mobile est un simple état React qui affiche/masque un panneau : pas
 * de librairie de drawer, pas d'animation coûteuse. C'est le seul JavaScript
 * chargé sur les pages publiques, ce qui garde le site rapide sur les
 * connexions lentes visées par le projet.
 */
export function Header() {
  const [ouvert, setOuvert] = React.useState(false);
  const chemin = usePathname();

  // Referme le menu à chaque changement de page.
  React.useEffect(() => {
    setOuvert(false);
  }, [chemin]);

  const estActif = (href: string) => (href === "/" ? chemin === "/" : chemin.startsWith(href));

  return (
    <header className="border-bordure bg-fond/95 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="contenu flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${site.nom} — retour à l'accueil`}
        >
          <Logo className="h-9 shrink-0 md:h-10" priority />
          <span className="font-titre text-encre text-lg leading-tight font-bold md:text-xl">
            {site.nom}
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navigation.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  aria-current={estActif(lien.href) ? "page" : undefined}
                  className={cn(
                    "lien-souligne rounded-douce px-3 py-2 text-[0.95rem] font-medium transition-colors",
                    estActif(lien.href)
                      ? "bg-terre-voile text-terre-fonce"
                      : "text-encre hover:bg-sable",
                  )}
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOuvert((v) => !v)}
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          className="rounded-douce text-encre -mr-2 inline-flex size-11 items-center justify-center md:hidden"
        >
          {ouvert ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
          <span className="sr-only">{ouvert ? "Fermer le menu" : "Ouvrir le menu"}</span>
        </button>
      </div>

      {ouvert ? (
        <nav
          id="menu-mobile"
          aria-label="Navigation principale (mobile)"
          className="border-bordure bg-fond border-t md:hidden"
        >
          <ul className="contenu flex flex-col py-2">
            {navigation.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  aria-current={estActif(lien.href) ? "page" : undefined}
                  className={cn(
                    "rounded-douce block px-3 py-3 text-base font-medium",
                    estActif(lien.href) ? "bg-terre-voile text-terre-fonce" : "text-encre",
                  )}
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
