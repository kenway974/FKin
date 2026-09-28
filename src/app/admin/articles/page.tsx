import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { EtatVide } from "@/components/sections";
import { EnteteAdmin } from "@/components/admin/entete-admin";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { listerTousLesArticles } from "@/lib/admin-data";
import { formaterDate } from "@/lib/utils";
import { supprimerArticle } from "./actions";

export const metadata = { title: "Articles" };

/** Liste des articles du blog, brouillons compris. */
export default async function PageAdminArticles() {
  const articles = await listerTousLesArticles();

  return (
    <div className="space-y-10">
      <EnteteAdmin
        surtitre="Actualités"
        titre="Articles"
        description={
          <>
            {articles.length} article{articles.length > 1 ? "s" : ""} au total.
          </>
        }
      >
        <Button asChild>
          <Link href="/admin/articles/nouveau">
            Nouvel article
            <Plus aria-hidden="true" />
          </Link>
        </Button>
      </EnteteAdmin>

      {articles.length > 0 ? (
        <ul className="divide-bordure divide-y">
          {articles.map((article) => (
            <li key={article.id}>
              <div className="flex flex-wrap items-start gap-4 py-6">
                <div className="min-w-64 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge ton={article.statut === "publie" ? "bleu" : "marine"}>
                      {article.statut === "publie" ? "Publié" : "Brouillon"}
                    </Badge>
                    {article.date_publication ? (
                      <span className="text-doux text-sm">
                        {formaterDate(article.date_publication)}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-lg font-semibold">
                    <Link href={`/admin/articles/${article.id}`} className="hover:text-rouge">
                      {article.titre}
                    </Link>
                  </h2>

                  <p className="text-doux text-sm">/actualites/{article.slug}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variante="courbe" taille="sm">
                    <Link href={`/admin/articles/${article.id}`}>
                      <Pencil className="size-4" aria-hidden="true" />
                      Modifier
                    </Link>
                  </Button>

                  {article.statut === "publie" ? (
                    <Button asChild variante="discret" taille="sm">
                      <Link
                        href={`/actualites/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" aria-hidden="true" />
                        Voir
                        <span className="sr-only"> (nouvel onglet)</span>
                      </Link>
                    </Button>
                  ) : null}

                  <BoutonSuppression
                    intitule={article.titre}
                    onSupprimer={supprimerArticle.bind(null, article.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EtatVide titre="Aucun article pour le moment" anime={false}>
          <p>
            Publiez un premier compte rendu de convoi : c&apos;est ce qui rassure le plus les
            entreprises qui hésitent à donner.
          </p>
          <div className="mt-5 flex justify-center">
            <Button asChild>
              <Link href="/admin/articles/nouveau">
                Écrire un article
                <Plus aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </EtatVide>
      )}
    </div>
  );
}
