import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { FormulaireProjet } from "../formulaire-projet";
import { trouverProjet } from "@/lib/admin-data";
import { supprimerProjet } from "../actions";

export const metadata = { title: "Modifier un projet" };

export default async function PageModifierProjet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projet = await trouverProjet(id);

  if (!projet) notFound();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Button asChild variante="courbe" taille="sm">
            <Link href="/admin/projets">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Retour aux projets
            </Link>
          </Button>
          <h1 className="mt-5 text-3xl font-bold text-balance md:text-4xl">{projet.titre}</h1>
        </div>

        <BoutonSuppression
          intitule={projet.titre}
          onSupprimer={supprimerProjet.bind(null, projet.id)}
          redirectionApres="/admin/projets"
        />
      </div>

      <FormulaireProjet projet={projet} />
    </div>
  );
}
