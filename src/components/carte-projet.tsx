import Image from "next/image";
import { CalendarDays, MapPin, Package } from "lucide-react";
import { Badge, Card, CardBody, CardTitre } from "@/components/ui/card";
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
    <Card className="h-full">
      <article className="flex h-full flex-col">
        {projet.image_url ? (
          <div className="bg-sable relative aspect-[4/3] w-full">
            <Image
              src={projet.image_url}
              alt={projet.image_alt ?? `Photographie du projet : ${projet.titre}`}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              priority={priorite}
              loading={priorite ? undefined : "lazy"}
            />
          </div>
        ) : (
          <VisuelParDefaut legende={`Photographie à venir pour le projet ${projet.titre}`} />
        )}

        <CardBody className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge ton="terre">
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

          <dl className="border-bordure mt-auto space-y-2 border-t pt-3 text-sm">
            <div className="flex gap-2">
              <dt className="text-encre flex shrink-0 items-center gap-1.5 font-semibold">
                <Package className="text-terre size-4" aria-hidden="true" />
                Matériel
              </dt>
              <dd className="text-doux">{projet.type_materiel}</dd>
            </div>
            <div className="rounded-douce bg-vert-voile p-3">
              <dt className="text-vert-fonce font-semibold">Résultat obtenu</dt>
              <dd className="text-vert-fonce/90 mt-0.5">{projet.resultat}</dd>
            </div>
          </dl>
        </CardBody>
      </article>
    </Card>
  );
}
