"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Apparitions au défilement, pour tout le site.
 *
 * Trois marqueurs, posés directement dans le HTML des pages :
 *   - `data-apparition` (valeurs : vide, `gauche`, `droite`, `zoom`) : l'élément
 *     entre en scène quand il arrive à l'écran ;
 *   - `data-apparition-cascade` : ses enfants directs entrent l'un après
 *     l'autre, avec un léger décalage ;
 *   - `data-compteur` : un nombre qui compte jusqu'à sa valeur (« 72 h »,
 *     « 100 % »…) à son arrivée à l'écran.
 *
 * Un IntersectionObserver (et non les animations CSS liées au défilement,
 * que Safari ne gère pas encore) : même rendu sur iPhone, Android et
 * ordinateur, et aucun calcul pendant le défilement lui-même.
 *
 * Sans JavaScript, ou si le visiteur a demandé à réduire les animations, rien
 * n'est masqué : tout le contenu reste affiché d'emblée. Les éléments déjà à
 * l'écran au chargement sont affichés tout de suite, sans clignotement.
 */
/**
 * Tout ce que le CSS masque avant son entrée en scène : les éléments marqués
 * `data-apparition`, mais aussi les listes `.anim-defilement` (articles,
 * projets). Si l'un de ces sélecteurs manquait ici, l'élément resterait
 * invisible pour toujours une fois `.js-apparitions` posé.
 */
const CIBLES_A_REVELER = ":is([data-apparition], .anim-defilement):not([data-visible])";

export function Apparitions() {
  const chemin = usePathname();

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Les enfants d'une cascade reçoivent chacun leur retard.
    // La valeur de `data-apparition-cascade` (gauche, droite…) donne la
    // direction d'entrée des enfants.
    document.querySelectorAll<HTMLElement>("[data-apparition-cascade]").forEach((parent) => {
      const direction = parent.getAttribute("data-apparition-cascade") ?? "";
      Array.from(parent.children).forEach((enfant, index) => {
        const el = enfant as HTMLElement;
        if (!el.hasAttribute("data-apparition")) el.setAttribute("data-apparition", direction);
        el.style.setProperty("--delai", `${Math.min(index * 0.09, 0.6)}s`);
      });
    });

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(CIBLES_A_REVELER),
    );

    // Ce qui est déjà à l'écran s'affiche immédiatement.
    const hauteur = window.innerHeight;
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top < hauteur * 0.9) el.setAttribute("data-visible", "");
    });
    document.documentElement.classList.add("js-apparitions");

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          const el = entree.target as HTMLElement;
          el.setAttribute("data-visible", "");
          el.querySelectorAll<HTMLElement>("[data-compteur]").forEach(compter);
          if (el.hasAttribute("data-compteur")) compter(el);
          observateur.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    elements.forEach((el) => {
      if (!el.hasAttribute("data-visible")) observateur.observe(el);
    });

    // Compteurs hors de tout bloc animé : observés pour eux-mêmes.
    const compteurs = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          compter(entree.target as HTMLElement);
          compteurs.unobserve(entree.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document
      .querySelectorAll<HTMLElement>("[data-compteur]")
      .forEach((el) => compteurs.observe(el));

    // Filet de sécurité : un défilement rapide (un grand coup de doigt) peut
    // faire sauter un élément sans qu'il ait jamais croisé l'écran aux yeux
    // de l'observateur. Tout ce qui est passé au-dessus du bas de l'écran est
    // donc révélé d'office. Vérification au plus toutes les 150 ms, et le
    // suivi s'arrête dès qu'il ne reste plus rien à révéler.
    let enAttente = false;
    const rattraper = () => {
      enAttente = false;
      const restants = document.querySelectorAll<HTMLElement>(
        CIBLES_A_REVELER,
      );
      if (!restants.length) {
        window.removeEventListener("scroll", programmer);
        return;
      }
      restants.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.setAttribute("data-visible", "");
          el.querySelectorAll<HTMLElement>("[data-compteur]").forEach(compter);
          observateur.unobserve(el);
        }
      });
    };
    const programmer = () => {
      if (enAttente) return;
      enAttente = true;
      window.setTimeout(rattraper, 150);
    };
    window.addEventListener("scroll", programmer, { passive: true });

    return () => {
      observateur.disconnect();
      compteurs.disconnect();
      window.removeEventListener("scroll", programmer);
    };
  }, [chemin]);

  return null;
}

/**
 * Fait compter le premier nombre d'un texte de 0 à sa valeur (« 72 h » :
 * 0 h, 1 h… 72 h ; « 1 200 » garde ses espaces), en ralentissant sur la fin.
 * Une seule fois par élément.
 */
function compter(el: HTMLElement) {
  if (el.dataset.compte) return;
  el.dataset.compte = "1";
  const texte = el.textContent ?? "";
  // Un nombre peut contenir des séparateurs de milliers (« 1 200 »).
  const trouve = texte.match(/\d(?:[\d\s\u00a0\u202f]*\d)?/);
  if (!trouve || trouve.index === undefined) return;
  const cible = Number(trouve[0].replace(/\D/g, ""));
  if (!cible) return;
  const avant = texte.slice(0, trouve.index);
  const apres = texte.slice(trouve.index + trouve[0].length);
  const format = (n: number) => (cible >= 1000 ? n.toLocaleString("fr-FR") : String(n));
  const duree = 1100;
  const debut = performance.now();
  const pas = (maintenant: number) => {
    const t = Math.min((maintenant - debut) / duree, 1);
    const adouci = 1 - Math.pow(1 - t, 3);
    el.textContent = `${avant}${format(Math.round(cible * adouci))}${apres}`;
    if (t < 1) requestAnimationFrame(pas);
  };
  requestAnimationFrame(pas);
}
