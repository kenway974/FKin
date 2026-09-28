import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormulaireProjet } from "../formulaire-projet";

export const metadata = { title: "Nouveau projet" };

export default function PageNouveauProjet() {
  return (
    <div className="space-y-10">
      <div>
        <Button asChild variante="courbe" taille="sm">
          <Link href="/admin/projets">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour aux projets
          </Link>
        </Button>
        <h1 className="mt-5 text-3xl font-bold text-balance md:text-4xl">Nouveau projet</h1>
        <p className="text-doux mt-2 max-w-3xl text-lg">
          Renseignez surtout le lieu, le matériel livré et le résultat obtenu : c&apos;est ce que
          les entreprises regardent en premier.
        </p>
      </div>

      <FormulaireProjet />
    </div>
  );
}
