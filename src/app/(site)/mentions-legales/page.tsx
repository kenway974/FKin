import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { BannierePage } from "@/components/bannieres";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${site.nom} : éditeur, directeur de la publication et hébergement.`,
  alternates: { canonical: "/mentions-legales" },
};

/**
 * Mentions légales.
 *
 * Certaines informations ne peuvent être connues que de la structure elle-même
 * (forme juridique, numéro d'immatriculation, directeur de la publication) :
 * elles sont signalées par « [à compléter] » et doivent être renseignées avant
 * la mise en ligne définitive.
 */
export default function PageMentionsLegales() {
  return (
    <article className="pb-16">
      <BannierePage
        surtitre="Informations légales"
        titre="Mentions légales"
        chapo="Dernière mise à jour : août 2026."
      />

      <div className="contenu mt-12 max-w-3xl">
        <div className="text-encre/90 space-y-8 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Éditeur du site</h2>
            <p>
              Le présent site est édité par <strong>{site.nom}</strong>, association régie par la
              loi du 1<sup>er</sup> juillet 1901, dont le siège est situé à {site.adresse.ville} (
              {site.adresse.codePostal}), France.
            </p>
            <p>
              Adresse e-mail :{" "}
              <a href={`mailto:${site.email}`} className="text-rouge underline underline-offset-4">
                {site.email}
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Directeur de la publication</h2>
            <p>
              Le directeur de la publication est Fabrice Malph, représentant légal de
              l&apos;association.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Hébergement</h2>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut,
              CA 91789, États-Unis —{" "}
              <a
                href="https://vercel.com"
                className="text-rouge underline underline-offset-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                vercel.com
              </a>
              .
            </p>
            <p>
              Les contenus et les messages reçus via le formulaire de contact sont stockés par{" "}
              <strong>Supabase</strong>, sur une infrastructure située dans l&apos;Union européenne
              (région de Paris).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, illustrations, logo) est
              protégé par le droit d&apos;auteur. Toute reproduction ou représentation, totale ou
              partielle, sans autorisation préalable, est interdite.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Données personnelles</h2>
            <p>
              Le traitement des données transmises via le formulaire de contact est détaillé dans
              notre{" "}
              <Link href="/confidentialite" className="text-rouge underline underline-offset-4">
                politique de confidentialité
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
