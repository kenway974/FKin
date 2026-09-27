import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardBody } from "@/components/ui/card";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { listerTousLesArticles } from "@/lib/admin-data";
import { formaterDate } from "@/lib/utils";
import { supprimerArticle } from "./actions";

export const metadata = { title: "Articles" };

/** Liste des articles du blog, brouillons compris. */
export default async function PageAdminArticles() {
  const articles = await listerTousLesArticles();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-titre text-2xl font-bold">Articles</h1>
          <p className="text-doux mt-1">
            {articles.length} article{articles.length > 1 ? "s" : ""} au total.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/nouveau">
            <Plus className="size-4" aria-hidden="true" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {articles.length > 0 ? (
        <ul className="space-y-3">
          {articles.map((article) => (
            <li key={article.id}>
              <Card>
                <CardBody className="flex flex-wrap items-start gap-4">
                  <div className="min-w-64 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge ton={article.statut === "publie" ? "vert" : "ocre"}>
                        {article.statut === "publie" ? "Publié" : "Brouillon"}
                      </Badge>
                      {article.date_publication ? (
                        <span className="text-doux text-sm">
                          {formaterDate(article.date_publication)}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-lg font-semibold">
                      <Link href={`/admin/articles/${article.id}`} className="hover:text-terre">
                        {article.titre}
                      </Link>
                    </h2>

                    <p className="text-doux text-sm">/actualites/{article.slug}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variante="contour" taille="sm">
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
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardBody className="space-y-3 py-10 text-center">
            <p className="font-titre text-lg font-semibold">Aucun article pour le moment</p>
            <p className="text-doux">
              Publiez un premier compte rendu de convoi : c&apos;est ce qui rassure le plus les
              entreprises qui hésitent à donner.
            </p>
            <div className="flex justify-center pt-2">
              <Button asChild>
                <Link href="/admin/articles/nouveau">
                  <Plus className="size-4" aria-hidden="true" />
                  Écrire un article
                </Link>
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
