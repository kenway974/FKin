import Image from "next/image";
import { CalendarDays, MapPin, Package } from "lucide-react";
import { Badge, CardTitre } from "@/components/ui/card";
import { VisuelParDefaut } from "@/components/sections";
import { formaterDate } from "@/lib/utils";
import type { Projet } from "@/types/database";

/**
 * Carte d'un projet de la galerie « Réalisations ».
 *
 * `priorite` n'est vrai que pour les toutes premières cartes visibles : les
 * suivantes restent en chargement paresseux, ce qui évite de saturer une
 * connexion lente au premier affichage.
 */
export function CarteProjet({ projet, priorite = false }: { projet: Projet; priorite?: boolean }) {
  return (
    // Pas de carte encadrée : la photo prend une forme souple, le texte est
    // posé dessous, directement sur la page.
    <div className="group h-full">
      <article className="flex h-full flex-col">
        {projet.image_url ? (
          <div className="bg-nuage forme-blob-1 relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={projet.image_url}
              alt={projet.image_alt ?? `Photographie du projet : ${projet.titre}`}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="zoom-survol object-cover"
              priority={priorite}
              loading={priorite ? undefined : "lazy"}
            />
          </div>
        ) : (
          <VisuelParDefaut
            className="forme-blob-1"
            legende={`Photographie à venir pour le projet ${projet.titre}`}
          />
        )}

        <div className="flex flex-1 flex-col gap-3 px-1 pt-5">
          <div className="flex flex-wrap gap-2">
            <Badge ton="rouge">
              <MapPin className="size-3.5" aria-hidden="true" />
              {projet.lieu}
            </Badge>
            {projet.date_projet ? (
              <Badge>
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {formaterDate(projet.date_projet)}
              </Badge>
            ) : null}
          </div>

          <CardTitre>{projet.titre}</CardTitre>
          <p className="text-doux text-sm leading-relaxed">{projet.description}</p>

          <dl className="mt-auto space-y-2 pt-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-encre flex shrink-0 items-center gap-1.5 font-semibold">
                <Package className="text-rouge size-4" aria-hidden="true" />
                Matériel
              </dt>
              <dd className="text-doux">{projet.type_materiel}</dd>
            </div>
            <div className="border-bleu-vif border-l-4 pl-3">
              <dt className="text-bleu-fonce font-semibold">Résultat obtenu</dt>
              <dd className="text-bleu-fonce/90 mt-0.5">{projet.resultat}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  );
}
