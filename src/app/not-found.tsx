import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/site";

/** Page 404 globale. */
export default function PageIntrouvable() {
  return (
    <div className="bg-sable motif-tissu flex min-h-dvh items-center justify-center px-5 py-20">
      <div className="contenu max-w-lg text-center">
        <p className="font-titre text-terre/40 text-6xl font-bold">404</p>
        <h1 className="font-titre mt-3 text-3xl font-bold">Cette page n&apos;existe pas</h1>
        <p className="text-doux mt-3">
          Le lien est peut-être ancien, ou la page a été renommée. Voici par où reprendre.
        </p>

        <nav aria-label="Navigation de secours" className="mt-6">
          <ul className="flex flex-wrap justify-center gap-2">
            {navigation.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  className="border-bordure hover:border-terre hover:text-terre inline-block rounded-full border bg-white px-3.5 py-1.5 text-sm font-medium"
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Button asChild className="mt-8">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
