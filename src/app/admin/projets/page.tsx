import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { EtatVide } from "@/components/sections";
import { EnteteAdmin } from "@/components/admin/entete-admin";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { listerTousLesProjets } from "@/lib/admin-data";
import { formaterDate } from "@/lib/utils";
import { supprimerProjet } from "./actions";

export const metadata = { title: "Projets" };

/** Liste des projets de la galerie, masqués compris. */
export default async function PageAdminProjets() {
  const projets = await listerTousLesProjets();

  return (
    <div className="space-y-10">
      <EnteteAdmin
        surtitre="Réalisations"
        titre="Projets"
        description={
          <>
            {projets.length} projet{projets.length > 1 ? "s" : ""} dans la galerie.
          </>
        }
      >
        <Button asChild>
          <Link href="/admin/projets/nouveau">
            Nouveau projet
            <Plus aria-hidden="true" />
          </Link>
        </Button>
      </EnteteAdmin>

      {projets.length > 0 ? (
        <ul className="divide-bordure divide-y">
          {projets.map((projet) => (
            <li key={projet.id}>
              <div className="flex flex-wrap items-start gap-4 py-6">
                <div className="forme-blob-3 bg-nuage relative aspect-[4/3] w-28 shrink-0 overflow-hidden">
                  {projet.image_url ? (
                    <Image
                      src={projet.image_url}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-doux flex h-full items-center justify-center text-xs">
                      Sans photo
                    </span>
                  )}
                </div>

                <div className="min-w-56 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge ton={projet.publie ? "bleu" : "marine"}>
                      {projet.publie ? "Visible" : "Masqué"}
                    </Badge>
                    <Badge>Ordre {projet.ordre}</Badge>
                    {projet.date_projet ? (
                      <span className="text-doux text-sm">{formaterDate(projet.date_projet)}</span>
                    ) : null}
                  </div>

                  <h2 className="text-lg font-semibold">
                    <Link href={`/admin/projets/${projet.id}`} className="hover:text-rouge">
                      {projet.titre}
                    </Link>
                  </h2>

                  <p className="text-doux text-sm">
                    {projet.lieu} · {projet.type_materiel}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variante="courbe" taille="sm">
                    <Link href={`/admin/projets/${projet.id}`}>
                      <Pencil className="size-4" aria-hidden="true" />
                      Modifier
                    </Link>
                  </Button>
                  <BoutonSuppression
                    intitule={projet.titre}
                    onSupprimer={supprimerProjet.bind(null, projet.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EtatVide titre="Aucun projet pour le moment" anime={false}>
          <p>
            La galerie est la page la plus consultée par les entreprises qui hésitent : une première
            fiche, même simple, change tout.
          </p>
          <div className="mt-5 flex justify-center">
            <Button asChild>
              <Link href="/admin/projets/nouveau">
                Ajouter un projet
                <Plus aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </EtatVide>
      )}
    </div>
  );
}
