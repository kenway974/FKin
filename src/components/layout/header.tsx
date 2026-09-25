"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { navigation, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

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
    <header className="bg-fond/90 sticky top-0 z-40 backdrop-blur-md">
      <div className="contenu flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${site.nom} — retour à l'accueil`}
        >
          <Logo className="h-9 shrink-0 md:h-10" priority />
          <span className="font-titre text-marine text-xl leading-tight font-semibold md:text-2xl">
            {site.nom}
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  aria-current={estActif(lien.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors",
                    estActif(lien.href)
                      ? "bg-bleu-voile text-bleu-fonce"
                      : "text-encre hover:text-rouge",
                  )}
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild taille="sm" className="hidden sm:inline-flex">
            <Link href="/contact?profil=entreprise">
              Proposer un don
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            className="bg-nuage text-marine -mr-1 inline-flex size-11 items-center justify-center rounded-full lg:hidden"
          >
            {ouvert ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
            <span className="sr-only">{ouvert ? "Fermer le menu" : "Ouvrir le menu"}</span>
          </button>
        </div>
      </div>

      {ouvert ? (
        <nav
          id="menu-mobile"
          aria-label="Navigation principale (mobile)"
          className="contenu pb-4 lg:hidden"
        >
          <ul className="forme-coeur bg-marine flex flex-col p-3 shadow-xl">
            {navigation.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  aria-current={estActif(lien.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-full px-4 py-3 text-base font-semibold",
                    estActif(lien.href) ? "bg-white/12 text-white" : "text-white/85",
                  )}
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
            <li className="px-1 pt-2 pb-1 sm:hidden">
              <Button asChild variante="clair" className="w-full justify-between">
                <Link href="/contact?profil=entreprise">
                  Proposer un don
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
