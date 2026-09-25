import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { navigation, site } from "@/lib/site";
import { Logo } from "@/components/layout/logo";
import { Coeur, Vague } from "@/components/formes";

/** Pied de page : rappel de la mission, navigation secondaire et contact. */
export function Footer() {
  return (
    <footer className="relative isolate mt-10 text-white">
      <Vague className="text-marine" retourne />
      <div className="bg-marine relative overflow-hidden">
        <Coeur className="text-rouge-vif -right-16 -bottom-20 -z-10 w-72 opacity-15 md:w-96" />
        <div className="contenu grid gap-10 py-12 md:grid-cols-3 md:py-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex rounded-full bg-white p-2">
                <Logo className="h-8" />
              </span>
              <span className="font-titre text-2xl font-semibold">{site.nom}</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">{site.description}</p>
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
                    className="hover:text-rouge-clair text-sm text-white/80 underline-offset-4 hover:underline"
                  >
                    {lien.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-titre text-base font-semibold">Nous joindre</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <Mail className="text-rouge-clair mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-rouge-clair underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="text-rouge-clair mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {site.adresse.ville} ({site.adresse.codePostal})
                  <br />
                  Collecte partout en France · Distribution à Kinshasa et au Congo
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="contenu flex flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {site.nom}. Tous droits réservés.
            </p>
            <nav aria-label="Liens légaux" className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/mentions-legales"
                className="hover:text-rouge-clair underline-offset-4 hover:underline"
              >
                Mentions légales
              </Link>
              <Link
                href="/confidentialite"
                className="hover:text-rouge-clair underline-offset-4 hover:underline"
              >
                Confidentialité
              </Link>
              <Link
                href="/connexion"
                className="hover:text-rouge-clair underline-offset-4 hover:underline"
              >
                Espace administration
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
