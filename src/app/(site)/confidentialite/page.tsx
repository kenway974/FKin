import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Comment ${site.nom} collecte, utilise et protège les données transmises via le formulaire de contact, et comment exercer vos droits.`,
  alternates: { canonical: "/confidentialite" },
};

/**
 * Politique de confidentialité (RGPD).
 *
 * Décrit le seul traitement de données personnelles du site : les messages
 * envoyés depuis le formulaire de contact. Le site public n'utilise aucun
 * cookie de mesure d'audience ni traceur publicitaire.
 */
export default function PageConfidentialite() {
  return (
    <article className="pb-16">
      <header className="border-bordure bg-sable motif-tissu border-b py-12 md:py-16">
        <div className="contenu max-w-3xl">
          <h1 className="text-3xl leading-tight font-bold md:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="text-doux mt-3 text-sm">Dernière mise à jour : août 2026.</p>
        </div>
      </header>

      <div className="contenu mt-10 max-w-3xl">
        <div className="text-encre/90 space-y-8 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Responsable du traitement</h2>
            <p>
              Les données transmises via ce site sont traitées par <strong>{site.nom}</strong>, dont
              le siège est situé à {site.adresse.ville} ({site.adresse.codePostal}). Pour toute
              question relative à vos données, écrivez à{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-terre underline underline-offset-4"
              >
                {site.email}
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Données collectées</h2>
            <p>
              Seul le formulaire de contact collecte des données personnelles. Lorsque vous
              l&apos;utilisez, nous recueillons : votre nom, votre adresse e-mail, éventuellement le
              nom de votre organisation et votre numéro de téléphone (facultatif), ainsi que le
              contenu de votre message.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Finalité et base légale</h2>
            <p>
              Ces informations servent uniquement à traiter votre demande et à y répondre. Le
              traitement repose sur notre intérêt légitime à donner suite aux sollicitations qui
              nous sont adressées.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Destinataires</h2>
            <p>
              Vos données sont accessibles aux seules personnes habilitées de {site.nom}. Elles ne
              sont ni vendues, ni louées, ni transmises à des tiers à des fins commerciales. Elles
              sont hébergées par notre prestataire technique Supabase, au sein de l&apos;Union
              européenne.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Durée de conservation</h2>
            <p>
              Les messages sont conservés le temps nécessaire au traitement de votre demande, puis
              archivés ou supprimés. À défaut de relation suivie, ils sont supprimés au plus tard
              trois ans après le dernier contact.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Vos droits</h2>
            <p>
              Conformément au Règlement général sur la protection des données (RGPD), vous disposez
              d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, de
              portabilité et d&apos;opposition sur vos données. Pour les exercer, écrivez-nous à{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-terre underline underline-offset-4"
              >
                {site.email}
              </a>
              . Vous pouvez également introduire une réclamation auprès de la CNIL (
              <a
                href="https://www.cnil.fr"
                className="text-terre underline underline-offset-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                cnil.fr
              </a>
              ).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-titre text-encre text-xl font-bold">Cookies</h2>
            <p>
              Le site public n&apos;utilise aucun cookie de mesure d&apos;audience ni traceur
              publicitaire. Des cookies strictement nécessaires sont uniquement employés dans
              l&apos;espace d&apos;administration, pour maintenir la session de connexion des
              personnes autorisées.
            </p>
          </section>

          <section className="space-y-2">
            <p className="text-doux text-sm">
              Voir aussi nos{" "}
              <Link
                href="/mentions-legales"
                className="text-terre underline underline-offset-4"
              >
                mentions légales
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
