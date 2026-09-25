import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Carte de contenu — conteneur neutre réutilisé sur tout le site. Sa forme
 * reprend la silhouette du cœur du logo : trois grands arrondis, un coin serré.
 */
export function Card({ className, ...proprietes }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "forme-coeur border-bordure overflow-hidden border bg-white shadow-[0_18px_40px_-28px_rgba(22,35,63,0.35)]",
        className,
      )}
      {...proprietes}
    />
  );
}

export function CardBody({ className, ...proprietes }: React.ComponentProps<"div">) {
  return <div className={cn("p-5 md:p-6", className)} {...proprietes} />;
}

export function CardTitre({ className, ...proprietes }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-encre text-xl font-semibold", className)} {...proprietes} />;
}

/** Étiquette courte : lieu, type de matériel, statut… */
export function Badge({
  className,
  ton = "neutre",
  ...proprietes
}: React.ComponentProps<"span"> & { ton?: "neutre" | "rouge" | "bleu" | "marine" }) {
  const tons = {
    neutre: "bg-nuage text-doux",
    rouge: "bg-rouge-voile text-rouge-fonce",
    bleu: "bg-bleu-voile text-bleu-fonce",
    marine: "bg-marine text-white",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tons[ton],
        className,
      )}
      {...proprietes}
    />
  );
}
