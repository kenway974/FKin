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
 * de librairie de drawer, pas d'animation coûteuse.
 *
 * Sur l'accueil, tant que le héros est à l'écran, l'en-tête est translucide
 * et se fond dans le marine du héros (textes en blanc) ; il reprend son fond
 * clair dès qu'on l'a dépassé. Un seul écouteur de défilement, passif, qui ne
 * met l'état à jour que lorsque la bascule change réellement.
 */
export function Header() {
  const [ouvert, setOuvert] = React.useState(false);
  const chemin = usePathname();

  // Referme le menu à chaque changement de page.
  React.useEffect(() => {
    setOuvert(false);
  }, [chemin]);

  const accueil = chemin === "/";
  const [surHeros, setSurHeros] = React.useState(accueil);

  React.useEffect(() => {
    if (!accueil) {
      setSurHeros(false);
      return;
    }
    // Le héros occupe tout l'écran : on bascule un peu avant sa fin.
    const verifier = () => setSurHeros(window.scrollY < window.innerHeight - 160);
    verifier();
    window.addEventListener("scroll", verifier, { passive: true });
    window.addEventListener("resize", verifier);
    return () => {
      window.removeEventListener("scroll", verifier);
      window.removeEventListener("resize", verifier);
    };
  }, [accueil]);

  // Menu mobile ouvert : fond clair, pour que le panneau se détache.
  const transparent = surHeros && !ouvert;

  const estActif = (href: string) => (href === "/" ? chemin === "/" : chemin.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 backdrop-blur-md transition-colors duration-300",
        transparent ? "bg-marine/25 text-white" : "bg-fond/90 text-encre",
      )}
    >
      <div className="contenu flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${site.nom} — retour à l'accueil`}
        >
          {/* Sur le marine, le pied du livre se confondrait avec le fond : le
              pictogramme est alors posé sur une pastille blanche. */}
          <span
            className={cn(
              "inline-flex rounded-full transition-[background-color,padding] duration-300",
              transparent && "bg-white p-1.5",
            )}
          >
            <Logo className={cn("shrink-0", transparent ? "h-7 md:h-8" : "h-9 md:h-10")} priority />
          </span>
          <span
            className={cn(
              "font-titre text-xl leading-tight font-semibold md:text-2xl",
              transparent ? "text-white" : "text-marine",
            )}
          >
            {site.nom}
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navigation.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  aria-current={estActif(lien.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors",
                    estActif(lien.href)
                      ? transparent
                        ? "bg-white/15 text-white"
                        : "bg-bleu-voile text-bleu-fonce"
                      : transparent
                        ? "text-white/85 hover:text-white"
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
            className={cn(
              "-mr-1 inline-flex size-11 items-center justify-center rounded-full transition-colors xl:hidden",
              transparent ? "bg-white/15 text-white" : "bg-nuage text-marine",
            )}
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
          className="contenu pb-4 xl:hidden"
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
