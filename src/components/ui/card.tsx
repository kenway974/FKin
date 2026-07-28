import * as React from "react";
import { cn } from "@/lib/utils";

/** Carte de contenu — conteneur neutre réutilisé sur tout le site. */
export function Card({ className, ...proprietes }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-douce border-bordure overflow-hidden border bg-white shadow-[0_1px_2px_rgba(43,33,26,0.04)]",
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
}: React.ComponentProps<"span"> & { ton?: "neutre" | "terre" | "vert" | "ocre" }) {
  const tons = {
    neutre: "bg-sable text-doux",
    terre: "bg-terre-voile text-terre-fonce",
    vert: "bg-vert-voile text-vert-fonce",
    ocre: "bg-ocre-voile text-[#7a4a08]",
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
