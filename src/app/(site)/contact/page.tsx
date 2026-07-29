import { Suspense } from "react";
import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { Card, CardBody, CardTitre } from "@/components/ui/card";
import { Section } from "@/components/sections";
import { BannierePage } from "@/components/bannieres";
import { trouverPhotoBanniere } from "@/lib/visuels";
import { FormulaireContact } from "./formulaire-contact";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Entreprise d'Île-de-France souhaitant donner du matériel, ou structure au Congo cherchant à être équipée : écrivez-nous, nous répondons sous 72 heures ouvrées.",
  alternates: { canonical: "/contact" },
};

export default function PageContact() {
  return (
    <>
      <BannierePage
        surtitre="Contact"
        titre="Écrivez-nous"
        chapo="Que vous ayez du matériel à donner ou un besoin à exprimer, un seul formulaire. Précisez simplement qui vous êtes : votre demande sera orientée vers la bonne personne."
        ton="vert"
        photo={trouverPhotoBanniere("contact")}
      />

      <Section>
        <div className="contenu grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
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

          <aside className="space-y-4" aria-label="Informations pratiques">
            <Card>
              <CardBody className="space-y-3">
                <CardTitre className="text-lg">Délai de réponse</CardTitre>
                <p className="text-doux flex gap-2.5 text-sm">
                  <Clock className="text-terre mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  Nous répondons sous 72 heures ouvrées, y compris pour dire que nous ne pouvons pas
                  donner suite. Vous ne resterez pas sans nouvelles.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-3">
                <CardTitre className="text-lg">Nous joindre autrement</CardTitre>
                <p className="text-doux flex gap-2.5 text-sm">
                  <Mail className="text-terre mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${site.email}`}
                    className="hover:text-terre underline underline-offset-4"
                  >
                    {site.email}
                  </a>
                </p>
                <p className="text-doux flex gap-2.5 text-sm">
                  <MapPin className="text-terre mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  Collecte sur toute l&apos;Île-de-France. Distribution à Kinshasa et dans les
                  provinces desservies par nos partenaires.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-2">
                <CardTitre className="text-lg">Pour aller plus vite</CardTitre>
                <ul className="text-doux space-y-2 text-sm">
                  {[
                    "Entreprises : indiquez la nature du matériel, la quantité approximative et la date de libération du local.",
                    "Bénéficiaires : indiquez le nom de la structure, ses effectifs et l'état du local d'accueil.",
                  ].map((conseil) => (
                    <li key={conseil} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="bg-ocre mt-2 size-1.5 shrink-0 rounded-full"
                      />
                      <span>{conseil}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
