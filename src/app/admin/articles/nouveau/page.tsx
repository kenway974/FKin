import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormulaireArticle } from "../formulaire-article";

export const metadata = { title: "Nouvel article" };

export default function PageNouvelArticle() {
  return (
    <div className="space-y-10">
      <div>
        <Button asChild variante="courbe" taille="sm">
          <Link href="/admin/articles">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour aux articles
          </Link>
        </Button>
        <h1 className="mt-5 text-3xl font-bold text-balance md:text-4xl">Nouvel article</h1>
        <p className="text-doux mt-2 max-w-3xl text-lg">
          Enregistrez-le en brouillon autant de fois que nécessaire : il ne sera visible sur le site
          qu&apos;une fois passé en « Publié ».
        </p>
      </div>

      <FormulaireArticle />
    </div>
  );
}
