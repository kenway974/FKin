import { Suspense } from "react";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Bande, Point, Section, TitreSection } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Faq } from "@/components/faq";
import { FAQ } from "@/lib/faq";
import { BannierePage } from "@/components/bannieres";
import { trouverPhotoBanniere } from "@/lib/visuels";
import { FormulaireContact } from "./formulaire-contact";
import { site } from "@/lib/site";
import { LienWhatsApp } from "@/components/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Entreprise en France souhaitant donner du matériel, ou structure en France ou au Congo cherchant à être équipée : écrivez-nous, nous répondons sous 72 heures ouvrées.",
  alternates: { canonical: "/contact" },
};

export default function PageContact() {
  return (
    <>
      <BannierePage
        surtitre="Contact"
        titre="Écrivez-nous"
        chapo="Matériel à donner ou besoin à exprimer : un seul formulaire. Précisez qui vous êtes, on oriente votre demande."
        ton="bleu"
        photo={trouverPhotoBanniere("contact")}
      />

      <Section>
        <div
          data-apparition-cascade=""
          className="contenu grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start"
        >
          <div>
            {/*
              `useSearchParams` impose une frontière Suspense : sans elle, toute
              la page basculerait en rendu dynamique et perdrait le bénéfice du
              cache statique.
            */}
            <Suspense
              fallback={
                <p className="text-doux" role="status">
                  Chargement du formulaire…
                </p>
              }
            >
              <FormulaireContact />
            </Suspense>
          </div>

          {/* Informations pratiques : pas de cartes, des points posés sur la
              page, chacun porté par sa forme souple. */}
          <aside className="space-y-12 lg:pt-8" aria-label="Informations pratiques">
            <Point icone={Clock} titre="Délai de réponse" ton="rouge" variante={1}>
              <p>
                Réponse sous 72 heures ouvrées, même pour un refus. Vous ne resterez pas sans
                nouvelles.
              </p>
            </Point>

            <Point icone={Mail} titre="Nous joindre autrement" ton="bleu" variante={2}>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-encre hover:text-rouge decoration-rouge-vif font-semibold underline decoration-2 underline-offset-4"
                >
                  {site.email}
                </a>
              </p>
              <p>
                <LienWhatsApp className="text-encre hover:text-rouge" />
              </p>
              <p className="flex gap-2">
                <MapPin className="text-rouge mt-1 size-4 shrink-0" aria-hidden="true" />
                Collecte partout en France. Distribution en France, et au Congo à Kinshasa et dans
                les provinces desservies par nos partenaires.
              </p>
            </Point>

            <Point icone={Zap} titre="Pour aller plus vite" ton="marine" variante={3}>
              <ul className="space-y-2">
                {[
                  "Entreprises : nature du matériel, quantité approximative, date de libération du local.",
                  "Bénéficiaires : nom de la structure, effectifs, état du local d'accueil.",
                ].map((conseil) => (
                  <li key={conseil} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="bg-bleu-vif mt-2.5 size-1.5 shrink-0 rounded-full"
                    />
                    <span>{conseil}</span>
                  </li>
                ))}
              </ul>
            </Point>
          </aside>
        </div>
      </Section>

      {/* Les questions qui freinent le plus souvent un premier message. */}
      <Bande fond="nuage" aria-labelledby="titre-faq-contact">
        <div className="contenu max-w-4xl space-y-10">
          <TitreSection
            id="titre-faq-contact"
            surtitre="Avant d'écrire"
            titre="Vos questions, nos réponses"
          />
          <Faq nom="faq-contact" questions={FAQ.filter((question) => question.essentielle)} />
          <Button asChild variante="courbe">
            <Link href="/comment-ca-marche#titre-faq">
              Toutes les questions fréquentes
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Bande>
    </>
  );
}
