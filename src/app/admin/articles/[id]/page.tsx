import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { FormulaireArticle } from "../formulaire-article";
import { trouverArticle } from "@/lib/admin-data";
import { supprimerArticle } from "../actions";

export const metadata = { title: "Modifier un article" };

export default async function PageModifierArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await trouverArticle(id);

  if (!article) notFound();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Button asChild variante="courbe" taille="sm">
            <Link href="/admin/articles">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Retour aux articles
            </Link>
          </Button>
          <h1 className="mt-5 text-3xl font-bold text-balance md:text-4xl">{article.titre}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {article.statut === "publie" ? (
            <Button asChild variante="courbe" taille="sm">
              <Link href={`/actualites/${article.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" aria-hidden="true" />
                Voir sur le site
                <span className="sr-only"> (nouvel onglet)</span>
              </Link>
            </Button>
          ) : null}

          <BoutonSuppression
            intitule={article.titre}
            onSupprimer={supprimerArticle.bind(null, article.id)}
            redirectionApres="/admin/articles"
          />
        </div>
      </div>

      <FormulaireArticle article={article} />
    </div>
  );
}
