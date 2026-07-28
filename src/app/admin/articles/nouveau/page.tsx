import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormulaireArticle } from "../formulaire-article";

export const metadata = { title: "Nouvel article" };

export default function PageNouvelArticle() {
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variante="lien" taille="sm" className="px-0">
          <Link href="/admin/articles">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour aux articles
          </Link>
        </Button>
        <h1 className="font-titre mt-2 text-2xl font-bold">Nouvel article</h1>
        <p className="text-doux mt-1">
          Enregistrez-le en brouillon autant de fois que nécessaire : il ne sera visible sur le site
          qu&apos;une fois passé en « Publié ».
        </p>
      </div>

      <FormulaireArticle />
    </div>
  );
}
