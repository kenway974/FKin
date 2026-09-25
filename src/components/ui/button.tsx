import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Bouton — primitive shadcn/ui redessinée aux formes de la marque.
 *
 * Deux familles, volontairement éloignées du duo « bouton plein / bouton à
 * contour » :
 *
 * - les **pilules** (`principal`, `secondaire`, `clair`) : une gélule pleine
 *   dont l'icône, quand il y en a une, est posée dans une pastille ronde
 *   collée au bord droit — comme une bille dans une goutte. Au survol, la
 *   flèche pivote vers le haut ;
 * - les **traits** (`courbe`, `courbe-clair`) : du texte seul, souligné d'une
 *   vague dessinée qui se tend au survol. C'est l'action secondaire.
 *
 * `asChild` permet de rendre un `<Link>` avec l'apparence d'un bouton sans
 * imbriquer un `<button>` dans un `<a>` (ce qui serait invalide et casserait
 * la navigation au clavier).
 */
const pilule =
  "rounded-full font-semibold whitespace-nowrap shadow-[0_10px_24px_-12px_rgba(22,35,63,0.55)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 active:translate-y-0 [&>svg]:shrink-0 [&>svg]:rounded-full [&>svg]:transition-transform [&>svg]:duration-300 hover:[&>svg]:-rotate-45";

const trait =
  "trait-courbe h-auto px-0 font-semibold [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:transition-transform hover:[&>svg]:translate-x-1";

const variantesBouton = cva(
  "inline-flex items-center justify-center gap-3 transition-colors disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variante: {
        principal: cn(
          pilule,
          "bg-rouge text-white hover:bg-rouge-fonce [&>svg]:bg-white [&>svg]:text-rouge",
        ),
        secondaire: cn(
          pilule,
          "bg-bleu text-white hover:bg-bleu-fonce [&>svg]:bg-white [&>svg]:text-bleu",
        ),
        clair: cn(
          pilule,
          "bg-white text-marine hover:bg-nuage [&>svg]:bg-rouge [&>svg]:text-white",
        ),
        courbe: cn(
          trait,
          "text-encre hover:text-rouge-fonce [--couleur-trait:var(--color-rouge-vif)]",
        ),
        "courbe-clair": cn(trait, "text-white [--couleur-trait:var(--color-rouge-clair)]"),
        discret: "rounded-full font-medium text-encre hover:bg-nuage [&_svg]:size-4",
        lien: "font-semibold text-bleu underline decoration-2 underline-offset-4 hover:text-bleu-fonce [&_svg]:size-4",
        danger:
          "rounded-full border-2 border-rouge-fonce font-semibold text-rouge-fonce hover:bg-rouge-voile [&_svg]:size-4",
      },
      taille: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-7 text-base",
      },
    },
    compoundVariants: [
      // Pilules : quand une icône est présente, le bord de son côté se resserre
      // pour que la pastille vienne presque toucher le contour de la gélule.
      {
        variante: ["principal", "secondaire", "clair"],
        taille: "sm",
        className:
          "has-[>svg:last-child]:pr-1 has-[>svg:first-child]:pl-1 [&>svg]:size-8 [&>svg]:p-2",
      },
      {
        variante: ["principal", "secondaire", "clair"],
        taille: "md",
        className:
          "has-[>svg:last-child]:pr-1.5 has-[>svg:first-child]:pl-1.5 [&>svg]:size-9 [&>svg]:p-2.5",
      },
      {
        variante: ["principal", "secondaire", "clair"],
        taille: "lg",
        className:
          "has-[>svg:last-child]:pr-1.5 has-[>svg:first-child]:pl-1.5 [&>svg]:size-11 [&>svg]:p-3",
      },
      // Les traits n'ont ni hauteur fixe ni marge interne : ils s'alignent sur
      // le texte qui les entoure, quelle que soit la taille demandée.
      {
        variante: ["courbe", "courbe-clair"],
        className: "h-auto px-0",
      },
    ],
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
