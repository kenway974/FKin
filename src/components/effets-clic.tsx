"use client";

import * as React from "react";

/**
 * Onde de clic : sur les boutons en pilule et les éléments marqués
 * `data-clic`, un cercle clair s'étend depuis le point touché puis
 * s'efface. Un seul écouteur pour tout le site (délégation), aucun rendu
 * React : le cercle est ajouté puis retiré directement du DOM.
 *
 * L'élément cliqué doit être positionné et masquer son débordement
 * (`relative overflow-hidden`), ce que font les pilules de `Button`.
 */
export function EffetsClic() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const auClic = (evenement: PointerEvent) => {
      const cible = (evenement.target as Element | null)?.closest<HTMLElement>(
        ".pilule, [data-clic]",
      );
      if (!cible) return;

      const cadre = cible.getBoundingClientRect();
      const taille = Math.max(cadre.width, cadre.height) * 2.2;
      const onde = document.createElement("span");
      onde.className = "onde-clic";
      onde.setAttribute("aria-hidden", "true");
      onde.style.width = onde.style.height = `${taille}px`;
      onde.style.left = `${evenement.clientX - cadre.left - taille / 2}px`;
      onde.style.top = `${evenement.clientY - cadre.top - taille / 2}px`;
      onde.addEventListener("animationend", () => onde.remove(), { once: true });
      cible.appendChild(onde);
    };

    document.addEventListener("pointerdown", auClic, { passive: true });
    return () => document.removeEventListener("pointerdown", auClic);
  }, []);

  return null;
}
