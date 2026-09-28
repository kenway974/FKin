import { MapPin } from "lucide-react";
import { PANNEAUX, TAILLE_CARTE } from "@/lib/carte-geo";
import { projeter, type NomPanneau } from "@/lib/carte";
import { cn } from "@/lib/utils";

export type PointCarte = { titre: string; lieu: string; latitude: number; longitude: number };

const LIBELLES: Record<NomPanneau, string> = { france: "En France", congo: "Au Congo" };

/**
 * Carte des structures équipées : la France et les deux Congo côte à côte
 * (à la même échelle, ils seraient séparés par 5 000 km de vide), un point
 * rouge qui pulse par structure. Dessinée en SVG, sans service de cartes
 * tiers : aucune requête externe, aucun cookie, et le style du site.
 *
 * La liste des lieux sous les cartes en donne l'équivalent textuel (lecteurs
 * d'écran, et survol impossible sur téléphone).
 */
export function CarteStructures({ points }: { points: PointCarte[] }) {
  const places = points
    .map((point) => ({ ...point, position: projeter(point.latitude, point.longitude) }))
    .filter((point) => point.position !== null);

  return (
    <div className="space-y-10">
      <div data-apparition-cascade="" className="grid gap-10 md:grid-cols-2">
        {(Object.keys(PANNEAUX) as NomPanneau[]).map((nom) => {
          const ici = places.filter((point) => point.position?.panneau === nom);
          return (
            <figure key={nom} className="relative">
              <figcaption className="mb-4 flex items-baseline gap-3">
                <span className="font-titre text-2xl font-bold">{LIBELLES[nom]}</span>
                <span className="text-doux text-sm">
                  {ici.length
                    ? `${ici.length} structure${ici.length > 1 ? "s" : ""} équipée${ici.length > 1 ? "s" : ""}`
                    : "Bientôt sur la carte"}
                </span>
              </figcaption>
              <svg
                viewBox={`0 0 ${TAILLE_CARTE} ${TAILLE_CARTE}`}
                className="h-auto w-full"
                role="img"
                aria-label={`Carte : ${LIBELLES[nom].toLowerCase()}, ${ici.length} structure${ici.length > 1 ? "s" : ""} équipée${ici.length > 1 ? "s" : ""}`}
              >
                {PANNEAUX[nom].chemins.map((chemin, index) => (
                  <path
                    key={index}
                    d={chemin}
                    className={cn(
                      "stroke-marine/40 stroke-[1.2]",
                      nom === "france" ? "fill-bleu-voile" : "fill-rouge-voile",
                    )}
                    strokeLinejoin="round"
                  />
                ))}
                {ici.map((point, index) => (
                  <g
                    key={`${point.titre}-${index}`}
                    transform={`translate(${point.position!.x} ${point.position!.y})`}
                  >
                    <title>{`${point.titre} — ${point.lieu}`}</title>
                    <circle
                      r="14"
                      className="point-carte-onde fill-rouge-vif/30"
                      style={{ animationDelay: `${(index % 5) * 0.4}s` }}
                    />
                    <circle r="6.5" className="fill-rouge-vif stroke-white stroke-2" />
                  </g>
                ))}
              </svg>
            </figure>
          );
        })}
      </div>

      {places.length ? (
        <ul
          data-apparition-cascade=""
          className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {places.map((point, index) => (
            <li key={`${point.titre}-${index}`} className="flex gap-3">
              <MapPin className="text-rouge mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <span>
                <span className="text-encre block font-semibold">{point.titre}</span>
                <span className="text-doux block text-sm">{point.lieu}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-doux">
          Chaque structure équipée apparaîtra ici, dès que sa fiche sera publiée avec sa position.
        </p>
      )}
    </div>
  );
}
