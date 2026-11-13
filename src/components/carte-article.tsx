import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CardTitre } from "@/components/ui/card";
import { VisuelParDefaut } from "@/components/sections";
import { cn, extraireResume, formaterDate } from "@/lib/utils";
import { texteBrut } from "@/lib/mise-en-forme";
import { libelleCategorie } from "@/lib/articles-filtre";
import type { Article } from "@/types/database";

/**
 * Carte d'aperçu d'un article, utilisée sur l'accueil et la liste des
 * actualités.
 *
 * `compacte` : sur téléphone, petite vignette à gauche et texte à droite, pour
 * qu'une liste de plusieurs articles se parcoure sans défiler sans fin. Dès
 * la tablette, la carte reprend sa présentation habituelle.
 */
export function CarteArticle({
  article,
  priorite = false,
  compacte = false,
}: {
  article: Article;
  priorite?: boolean;
  compacte?: boolean;
}) {
  const resume = article.extrait?.trim() || extraireResume(texteBrut(article.contenu), 150);
  const cadreImage = cn(
    "forme-blob-3 w-full",
    compacte ? "aspect-square w-24 shrink-0 sm:aspect-[16/9] sm:w-full" : "aspect-[16/9]",
  );

  return (
    // Pas de carte encadrée : image en forme souple, texte posé dessous.
    <div className="group relative h-full">
      <article className={cn("flex h-full", compacte ? "gap-4 sm:flex-col sm:gap-0" : "flex-col")}>
        {article.image_couverture ? (
          <div className={cn("bg-nuage relative overflow-hidden", cadreImage)}>
            <Image
              src={article.image_couverture}
              alt={article.image_alt ?? ""}
              fill
              sizes={
                compacte
                  ? "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 96px"
                  : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              }
              className="zoom-survol object-cover"
              priority={priorite}
              loading={priorite ? undefined : "lazy"}
            />
          </div>
        ) : (
          <VisuelParDefaut className={cadreImage} decoratif />
        )}

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-2 px-1",
            compacte ? "gap-1.5 sm:gap-2 sm:pt-5" : "pt-5",
          )}
        >
          <p className="text-doux flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {article.categorie ? (
              <span className="bg-bleu-voile text-bleu-fonce rounded-full px-2.5 py-0.5 text-xs font-bold">
                {libelleCategorie(article.categorie)}
              </span>
            ) : null}
            {article.date_publication ? (
              <time dateTime={article.date_publication}>
                {formaterDate(article.date_publication)}
              </time>
            ) : null}
          </p>

          <CardTitre className={cn(compacte && "text-base leading-snug sm:text-xl")}>
            {/*
              Le lien couvre toute la carte via ::after : la zone cliquable est
              large au doigt, tout en gardant un intitulé de lien explicite pour
              les lecteurs d'écran.
            */}
            <Link
              href={`/actualites/${article.slug}`}
              className="hover:text-rouge after:absolute after:inset-0"
            >
              {article.titre}
            </Link>
          </CardTitre>

          <p
            className={cn(
              "text-doux text-sm leading-relaxed",
              compacte && "line-clamp-2 sm:line-clamp-none",
            )}
          >
            {resume}
          </p>

          <p
            className={cn(
              "text-rouge mt-auto items-center gap-1.5 pt-3 text-sm font-semibold",
              compacte ? "hidden sm:flex" : "flex",
            )}
          >
            Lire l&apos;article
            <ArrowRight className="size-4" aria-hidden="true" />
          </p>
        </div>
      </article>
    </div>
  );
}
