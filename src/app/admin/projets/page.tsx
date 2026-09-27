import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardBody } from "@/components/ui/card";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { listerTousLesProjets } from "@/lib/admin-data";
import { formaterDate } from "@/lib/utils";
import { supprimerProjet } from "./actions";

export const metadata = { title: "Projets" };

/** Liste des projets de la galerie, masqués compris. */
export default async function PageAdminProjets() {
  const projets = await listerTousLesProjets();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-titre text-2xl font-bold">Projets</h1>
          <p className="text-doux mt-1">
            {projets.length} projet{projets.length > 1 ? "s" : ""} dans la galerie.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projets/nouveau">
            <Plus className="size-4" aria-hidden="true" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      {projets.length > 0 ? (
        <ul className="space-y-3">
          {projets.map((projet) => (
            <li key={projet.id}>
              <Card>
                <CardBody className="flex flex-wrap items-start gap-4">
                  <div className="rounded-douce border-bordure bg-sable relative aspect-[4/3] w-28 shrink-0 overflow-hidden border">
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
                      <Badge ton={projet.publie ? "vert" : "ocre"}>
                        {projet.publie ? "Visible" : "Masqué"}
                      </Badge>
                      <Badge>Ordre {projet.ordre}</Badge>
                      {projet.date_projet ? (
                        <span className="text-doux text-sm">
                          {formaterDate(projet.date_projet)}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-lg font-semibold">
                      <Link href={`/admin/projets/${projet.id}`} className="hover:text-terre">
                        {projet.titre}
                      </Link>
                    </h2>

                    <p className="text-doux text-sm">
                      {projet.lieu} · {projet.type_materiel}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variante="contour" taille="sm">
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
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardBody className="space-y-3 py-10 text-center">
            <p className="font-titre text-lg font-semibold">Aucun projet pour le moment</p>
            <p className="text-doux">
              La galerie est la page la plus consultée par les entreprises qui hésitent : une
              première fiche, même simple, change tout.
            </p>
            <div className="flex justify-center pt-2">
              <Button asChild>
                <Link href="/admin/projets/nouveau">
                  <Plus className="size-4" aria-hidden="true" />
                  Ajouter un projet
                </Link>
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
