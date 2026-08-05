import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Pictogramme de la marque Respusse : la flèche de recyclage verte, l'ordinateur
 * portable et le sourire en bleu marine. Fourni en PNG détouré (fond
 * transparent), il se pose donc aussi bien sur le fond clair de l'en-tête que
 * sur le sable du pied de page.
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
      width={508}
      height={490}
      priority={priority}
      className={cn("w-auto", className)}
    />
  );
}
