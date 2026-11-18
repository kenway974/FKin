import { urlSite } from "@/lib/env";
import { filAriane, type EtapeFil } from "@/lib/fil-ariane";
import { jsonLdSur } from "@/lib/utils";

/**
 * Fil d'Ariane de la page, en données structurées uniquement (rien n'est
 * affiché) : il indique aux moteurs où se situe la page dans le site.
 */
export function FilArianeJsonLd({ etapes }: { etapes: EtapeFil[] }) {
  return (
    <script
      type="application/ld+json"
      // Titres saisis dans le back-office : `jsonLdSur` échappe les `<`.
      dangerouslySetInnerHTML={{ __html: jsonLdSur(filAriane(urlSite, etapes)) }}
    />
  );
}
