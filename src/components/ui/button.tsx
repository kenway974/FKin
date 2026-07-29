import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Bouton — primitive shadcn/ui adaptée à la palette du site.
 *
 * `asChild` permet de rendre un `<Link>` avec l'apparence d'un bouton sans
 * imbriquer un `<button>` dans un `<a>` (ce qui serait invalide et casserait
 * la navigation au clavier).
 */
const variantesBouton = cva(
  "inline-flex items-center justify-center gap-2 rounded-douce font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variante: {
        principal: "bg-terre text-white hover:bg-terre-fonce",
        secondaire: "bg-vert text-white hover:bg-vert-fonce",
        contour: "border-2 border-terre text-terre hover:bg-terre-voile",
        discret: "text-encre hover:bg-sable",
        lien: "text-terre underline underline-offset-4 hover:text-terre-fonce",
        // Variantes destinées aux fonds sombres (bannières, section verte).
        // Elles existent en tant que variantes plutôt qu'en surcharge de
        // `className` : tailwind-merge ne sait pas arbitrer un conflit entre
        // deux couleurs personnalisées du thème, si bien qu'une surcharge du
        // type `bg-white` sur `bg-terre` ne gagnait pas de façon fiable.
        clair: "bg-white text-encre hover:bg-white/90",
        "contour-clair": "border-2 border-white text-white backdrop-blur-sm hover:bg-white/15",
        danger: "border-2 border-red-700 text-red-800 hover:bg-red-50",
      },
      taille: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: {
      variante: "principal",
      taille: "md",
    },
  },
);

export type ProprietesBouton = React.ComponentProps<"button"> &
  VariantProps<typeof variantesBouton> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variante,
  taille,
  asChild = false,
  ...proprietes
}: ProprietesBouton) {
  const Composant = asChild ? Slot : "button";
  return (
    <Composant className={cn(variantesBouton({ variante, taille }), className)} {...proprietes} />
  );
}

export { variantesBouton };
