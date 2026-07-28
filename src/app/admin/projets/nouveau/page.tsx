import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormulaireProjet } from "../formulaire-projet";

export const metadata = { title: "Nouveau projet" };

export default function PageNouveauProjet() {
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variante="lien" taille="sm" className="px-0">
          <Link href="/admin/projets">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour aux projets
          </Link>
        </Button>
        <h1 className="font-titre mt-2 text-2xl font-bold">Nouveau projet</h1>
        <p className="text-doux mt-1">
          Renseignez surtout le lieu, le matériel livré et le résultat obtenu : c&apos;est ce que
          les entreprises regardent en premier.
        </p>
      </div>

      <FormulaireProjet />
    </div>
  );
}
