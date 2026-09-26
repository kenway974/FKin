import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CardTitre } from "@/components/ui/card";
import { VisuelParDefaut } from "@/components/sections";
import { extraireResume, formaterDate } from "@/lib/utils";
import type { Article } from "@/types/database";

/** Carte d'aperçu d'un article, utilisée sur l'accueil et la liste des actualités. */
export function CarteArticle({
  article,
  priorite = false,
}: {
  article: Article;
  priorite?: boolean;
}) {
  const resume = article.extrait?.trim() || extraireResume(article.contenu, 150);

  return (
    // Pas de carte encadrée : image en forme souple, texte posé dessous.
    <div className="group relative h-full">
      <article className="flex h-full flex-col">
        {article.image_couverture ? (
          <div className="bg-nuage forme-blob-3 relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={article.image_couverture}
              alt={article.image_alt ?? ""}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="zoom-survol object-cover"
              priority={priorite}
              loading={priorite ? undefined : "lazy"}
            />
          </div>
        ) : (
          <VisuelParDefaut className="forme-blob-3 aspect-[16/9]" decoratif />
        )}

        <div className="flex flex-1 flex-col gap-2 px-1 pt-5">
          {article.date_publication ? (
            <p className="text-doux text-sm">
              <time dateTime={article.date_publication}>
                {formaterDate(article.date_publication)}
              </time>
            </p>
          ) : null}

          <CardTitre>
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

          <p className="text-doux text-sm leading-relaxed">{resume}</p>

          <p className="text-rouge mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold">
            Lire l&apos;article
            <ArrowRight className="size-4" aria-hidden="true" />
          </p>
        </div>
      </article>
    </div>
  );
}
