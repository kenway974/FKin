import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { navigation, site } from "@/lib/site";
import { Logo } from "@/components/layout/logo";

/** Pied de page : rappel de la mission, navigation secondaire et contact. */
export function Footer() {
  return (
    <footer className="border-bordure bg-sable mt-20 border-t">
      <div className="contenu grid gap-10 py-12 md:grid-cols-3 md:py-16">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Logo className="h-9" />
            <span className="font-titre text-lg font-bold">{site.nom}</span>
          </div>
          <p className="text-doux max-w-sm text-sm">{site.description}</p>
        </div>

        <nav aria-labelledby="titre-nav-pied">
          <h2 id="titre-nav-pied" className="font-titre text-base font-semibold">
            Le site
          </h2>
          <ul className="mt-3 space-y-2">
            {navigation.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  className="text-doux hover:text-terre text-sm underline-offset-4 hover:underline"
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-titre text-base font-semibold">Nous joindre</h2>
          <ul className="text-doux mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Mail className="text-terre mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${site.email}`}
                className="hover:text-terre underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="text-terre mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Collecte en Île-de-France
                <br />
                Distribution à Kinshasa et au Congo
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-bordure/70 border-t">
        <div className="contenu text-doux flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nom}. Tous droits réservés.
          </p>
          <Link href="/connexion" className="hover:text-terre underline-offset-4 hover:underline">
            Espace administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
