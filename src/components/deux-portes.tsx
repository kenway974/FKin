import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OndeBord } from "@/components/formes";
import { site } from "@/lib/site";

/**
 * Les deux portes d'entrée du site, en fin de page : les deux publics se
 * partagent l'écran d'un bord à l'autre — rouge pour les donateurs, bleu
 * pour les bénéficiaires — séparés par une couture en vague qui ondule.
 * Posé en bas de chaque page publique, c'est la dernière chose vue avant le
 * pied de page.
 */
export function DeuxPortes() {
  return (
    <>
      <section
        aria-label="Nous contacter"
        className="relative isolate mt-10 overflow-clip text-white"
      >
        <OndeBord className="text-fond" position="haut" />
        <OndeBord className="text-fond" position="bas" />
        <div className="grid md:grid-cols-2">
          <div className="bg-rouge-vif relative isolate overflow-clip px-6 pt-24 pb-20 md:px-12 md:pt-36 md:pb-36 lg:pl-[max(3rem,calc((100vw-72rem)/2+2rem))]">
            <span
              aria-hidden="true"
              className="blob-derive forme-blob-1 absolute -right-20 -bottom-24 -z-10 size-72 bg-white/10 md:size-96"
            />
            <div
              data-apparition-cascade="gauche"
              className="parallaxe-vue max-w-md [--parallaxe:1rem]"
            >
              <p className="text-sm font-extrabold tracking-[0.14em] text-white/85 uppercase">
                Donateurs
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-5xl">
                Du matériel qui dort chez vous ?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/90">
                Entreprises, collectivités : décrivez-nous le lot, nous répondons sous 72 heures et
                venons le chercher gratuitement.
              </p>
              <Button asChild taille="lg" variante="clair" className="mt-8">
                <Link href="/contact?profil=entreprise">
                  Proposer un don
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-bleu-vif relative isolate px-6 pt-24 pb-20 md:px-12 md:pt-36 md:pb-36 md:pl-20 lg:pr-[max(3rem,calc((100vw-72rem)/2+2rem))]">
            {/* Couture : sur téléphone, une vague rouge en haut du bloc bleu ;
                sur grand écran, une vague verticale qui ondule le long du bord. */}
            <OndeBord className="text-rouge-vif md:hidden" position="haut" />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 hidden w-16 -translate-x-1/2 overflow-clip md:block"
            >
              <svg
                viewBox="0 0 60 1200"
                preserveAspectRatio="none"
                className="onde-verticale absolute inset-x-0 top-0 w-full"
                focusable="false"
              >
                <path
                  d="M30 0C52 100 52 200 30 300S8 500 30 600S52 800 30 900S8 1100 30 1200H60V0Z"
                  fill="var(--color-bleu-vif)"
                />
              </svg>
            </div>
            <span
              aria-hidden="true"
              className="blob-derive forme-blob-2 absolute -right-24 -bottom-20 -z-10 size-72 bg-white/10 [animation-delay:-12s] md:size-96"
            />
            <div
              data-apparition-cascade="droite"
              className="parallaxe-vue max-w-md [--parallaxe:1rem] md:[--parallaxe:2.25rem]"
            >
              <p className="text-sm font-extrabold tracking-[0.14em] text-white/85 uppercase">
                Bénéficiaires
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-5xl">Besoin d&apos;équipement ?</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/90">
                Écoles, mairies, associations, en France ou au Congo : présentez votre structure et
                vos besoins.
              </p>
              <Button asChild taille="lg" variante="clair" className="mt-8">
                <Link href="/contact?profil=beneficiaire">
                  Demander un équipement
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <p className="contenu text-doux mt-4 text-center text-sm">
        Ou écrivez-nous directement à{" "}
        <a href={`mailto:${site.email}`} className="text-encre font-bold underline">
          {site.email}
        </a>
      </p>
    </>
  );
}
