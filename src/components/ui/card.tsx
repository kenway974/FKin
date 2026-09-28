import * as React from "react";
import { cn } from "@/lib/utils";

/** Titre des vignettes (articles, projets). */
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
