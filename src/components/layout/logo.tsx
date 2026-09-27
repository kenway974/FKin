import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Pictogramme de la marque Respusse : un livre ouvert dont les pages forment un
 * cœur bleu-blanc-rouge, sur une base bleu marine. Fourni en PNG détouré (fond
 * transparent, cœur en négatif), il se pose donc aussi bien sur le fond clair de
 * l'en-tête que sur le sable du pied de page.
 *
 * Le mot « Respusse » est rendu à côté, en texte, par les composants qui
 * utilisent ce pictogramme : on garde ainsi un intitulé sélectionnable et
 * accessible plutôt qu'une image de texte.
 */
export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/marque/respusse-icone.png"
      alt=""
      width={576}
      height={421}
      priority={priority}
      className={cn("w-auto", className)}
    />
  );
}
