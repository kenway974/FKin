import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Surtitre de la marque : petite barre rouge arrondie et libellé en
 * capitales espacées. Au-dessus des titres de section, des en-têtes du
 * back-office et des sous-parties de formulaire.
 */
export function Surtitre({
  as: Balise = "p",
  sombre = false,
  className,
  children,
  ...proprietes
}: React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "h2" | "h3";
  /** Sur fond sombre : rouge éclairci. */
  sombre?: boolean;
}) {
  return (
    <Balise
      className={cn(
        "flex items-center gap-2 text-sm font-extrabold tracking-[0.14em] uppercase",
        sombre ? "text-rouge-clair" : "text-rouge",
        className,
      )}
      {...proprietes}
    >
      {/* `barre-surtitre` : la barre se déploie quand son bloc apparaît. */}
      <span
        className="barre-surtitre bg-rouge-vif inline-block h-2 w-6 shrink-0 rounded-full"
        aria-hidden="true"
      />
      {children}
    </Balise>
  );
}
