"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { navigation, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Vague } from "@/components/formes";

/**
 * En-tête du site.
 *
 * Le menu mobile est un simple état React qui affiche/masque un panneau : pas
 * de librairie de drawer, pas d'animation coûteuse.
 *
 * Tant qu'une bannière sombre (héros de l'accueil, bannière des pages) est à
 * l'écran, l'en-tête est translucide et se fond dans son marine (textes en
 * blanc) ; il reprend son fond clair dès qu'on l'a dépassée. Un seul
 * écouteur de défilement, passif, qui ne met l'état à jour que lorsque la
 * bascule change réellement.
 */
export function Header() {
  const [ouvert, setOuvert] = React.useState(false);
  const chemin = usePathname();

  // Referme le menu à chaque changement de page.
  React.useEffect(() => {
    setOuvert(false);
  }, [chemin]);

  // Translucide tant qu'une bannière sombre (héros de l'accueil ou bannière
  // de page, marquées `data-banniere-sombre`) est sous l'en-tête. L'état
  // initial suit les pages qui en ont une, pour éviter un saut à l'affichage.
  const [surHeros, setSurHeros] = React.useState(true);

  React.useEffect(() => {
    const banniere = document.querySelector<HTMLElement>("[data-banniere-sombre]");
    if (!banniere) {
      setSurHeros(false);
      return;
    }
    // On bascule un peu avant la fin de la bannière. Sa hauteur est mesurée
    // une fois (puis à chaque redimensionnement), jamais pendant le
    // défilement : la lire à chaque image forcerait un recalcul de la mise en
    // page et saccaderait le défilement.
    let limite = 0;
    const mesurer = () => {
      limite = banniere.offsetHeight - 120;
      verifier();
    };
    const verifier = () => setSurHeros(window.scrollY < limite);
    mesurer();
    window.addEventListener("scroll", verifier, { passive: true });
    window.addEventListener("resize", mesurer);
    return () => {
      window.removeEventListener("scroll", verifier);
      window.removeEventListener("resize", mesurer);
    };
  }, [chemin]);

  // Menu mobile ouvert : fond clair, pour que le panneau se détache.
  const transparent = surHeros && !ouvert;

  const estActif = (href: string) => (href === "/" ? chemin === "/" : chemin.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        // Pas de flou sur la bannière : recalculé à chaque image au-dessus de
        // la vague animée, il saccadait le défilement ; le marine suffit.
        transparent ? "bg-marine/25 text-white" : "bg-fond/90 text-encre backdrop-blur-md",
      )}
    >
      <div className="contenu flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          className="logo-battant flex items-center gap-2.5"
          aria-label={`${site.nom} — retour à l'accueil`}
        >
          {/* Le logo est posé tel quel, sans pastille ni contour. */}
          <Logo className="h-9 shrink-0 md:h-10" priority />
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
                  // `key` : la bulle de la page en cours rejoue son éclosion à
                  // chaque changement de page.
                  key={estActif(lien.href) ? `actif-${chemin}` : lien.href}
                  data-clic=""
                  className={cn(
                    "lien-nav inline-block overflow-hidden rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-[color,background-color,scale] active:scale-95",
                    estActif(lien.href) && "bulle-active",
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
            data-clic=""
            className={cn(
              "relative -mr-1 inline-flex size-11 items-center justify-center overflow-hidden rounded-full transition-[color,background-color,scale] active:scale-90 xl:hidden",
              transparent ? "bg-white/15 text-white" : "bg-nuage text-marine",
            )}
          >
            {/* `key` : l'icône pivote à chaque bascule. */}
            <span key={ouvert ? "fermer" : "ouvrir"} className="icone-menu inline-flex">
              {ouvert ? (
                <X className="size-6" aria-hidden="true" />
              ) : (
                <Menu className="size-6" aria-hidden="true" />
              )}
            </span>
            <span className="sr-only">{ouvert ? "Fermer le menu" : "Ouvrir le menu"}</span>
          </button>
        </div>
      </div>

      {ouvert ? (
        // Panneau pleine largeur, sans cadre, terminé par une vague.
        <nav
          id="menu-mobile"
          aria-label="Navigation principale (mobile)"
          className="menu-ouverture bg-marine relative xl:hidden"
        >
          <ul className="contenu flex flex-col py-4">
            {navigation.map((lien, index) => (
              <li
                key={lien.href}
                className="menu-lien"
                style={{ animationDelay: `${60 + index * 50}ms` }}
              >
                <Link
                  href={lien.href}
                  aria-current={estActif(lien.href) ? "page" : undefined}
                  className={cn(
                    "block py-3 text-xl font-semibold",
                    estActif(lien.href)
                      ? "trait-courbe inline-block text-white [--couleur-trait:var(--color-rouge-clair)]"
                      : "text-white/80 hover:text-white",
                  )}
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
            <li
              className="menu-lien pt-4 pb-1 sm:hidden"
              style={{ animationDelay: `${60 + navigation.length * 50}ms` }}
            >
              <Button asChild variante="clair" className="w-full justify-between">
                <Link href="/contact?profil=entreprise">
                  Proposer un don
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </li>
          </ul>
          <Vague className="text-marine absolute inset-x-0 top-full" />
        </nav>
      ) : null}
    </header>
  );
}
