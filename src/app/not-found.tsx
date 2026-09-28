import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannierePage } from "@/components/bannieres";
import { Logo } from "@/components/layout/logo";
import { navigation, site } from "@/lib/site";

/**
 * Page 404 globale, dans la langue du héros : plein écran marine, vague et
 * ruban, puis les pistes pour reprendre la visite. Hors du layout public
 * (pas d'en-tête) : le logo, en haut, ramène à l'accueil.
 */
export default function PageIntrouvable() {
  return (
    <BannierePage
      surtitre="Erreur 404"
      titre="Cette page n'existe pas"
      chapo="Le lien est peut-être ancien, ou la page a été renommée. Voici par où reprendre."
      className="mt-0 flex min-h-dvh flex-col justify-center pt-0 md:mt-0 md:pt-0"
      avant={
        <Link href="/" className="font-titre inline-flex items-center gap-3 text-lg font-bold">
          <Logo className="h-10" priority />
          {site.nom}
        </Link>
      }
    >
      <nav aria-label="Navigation de secours">
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {navigation.map((lien) => (
            <li key={lien.href}>
              <Button asChild variante="courbe-clair">
                <Link href={lien.href}>{lien.libelle}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <Button asChild variante="clair" className="mt-8">
        <Link href="/">
          Retour à l&apos;accueil
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </BannierePage>
  );
}
