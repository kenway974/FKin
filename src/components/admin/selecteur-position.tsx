"use client";

import * as React from "react";
import { PANNEAUX, TAILLE_CARTE } from "@/lib/carte-geo";
import { inverser, projeter, type NomPanneau } from "@/lib/carte";
import { Button } from "@/components/ui/button";
import { AideChamp, ChampFormulaire, Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

/**
 * Choix de la position d'un projet sur la carte des structures équipées :
 * un clic sur la France ou sur le Congo place le point ; latitude et
 * longitude restent modifiables à la main (clavier, ou position précise
 * relevée sur un site de cartographie).
 */
export function SelecteurPosition({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number | null, longitude: number | null) => void;
}) {
  const position = latitude !== null && longitude !== null ? projeter(latitude, longitude) : null;

  function auClic(panneau: NomPanneau, evenement: React.MouseEvent<SVGSVGElement>) {
    const svg = evenement.currentTarget;
    const matrice = svg.getScreenCTM();
    if (!matrice) return;
    const point = new DOMPoint(evenement.clientX, evenement.clientY).matrixTransform(
      matrice.inverse(),
    );
    const coordonnees = inverser(panneau, point.x, point.y);
    onChange(coordonnees.latitude, coordonnees.longitude);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(PANNEAUX) as NomPanneau[]).map((nom) => (
          <div key={nom}>
            <p className="text-doux mb-1 text-xs font-bold tracking-[0.12em] uppercase">
              {nom === "france" ? "France" : "Congo"}
            </p>
            <svg
              viewBox={`0 0 ${TAILLE_CARTE} ${TAILLE_CARTE}`}
              className="h-auto w-full cursor-crosshair"
              onClick={(evenement) => auClic(nom, evenement)}
              aria-hidden="true"
            >
              {PANNEAUX[nom].chemins.map((chemin, index) => (
                <path
                  key={index}
                  d={chemin}
                  className={cn(
                    "stroke-marine/40 stroke-[1.5] transition-colors",
                    nom === "france"
                      ? "fill-bleu-voile hover:fill-bleu-vif/25"
                      : "fill-rouge-voile hover:fill-rouge-vif/25",
                  )}
                />
              ))}
              {position?.panneau === nom ? (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="11"
                  className="fill-rouge-vif stroke-white stroke-[3]"
                />
              ) : null}
            </svg>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChampCoordonnee
          id="latitude"
          libelle="Latitude"
          valeur={latitude}
          onValeur={(valeur) => onChange(valeur, longitude)}
          exemple="-4.325"
        />
        <ChampCoordonnee
          id="longitude"
          libelle="Longitude"
          valeur={longitude}
          onValeur={(valeur) => onChange(latitude, valeur)}
          exemple="15.322"
        />
      </div>

      <AideChamp>
        {latitude !== null && longitude !== null && !position
          ? "Cette position est hors de France et du Congo : le projet n'apparaîtra pas sur la carte."
          : "Cliquez sur la carte pour placer la structure, ou saisissez ses coordonnées. Laissez vide pour ne pas l'afficher."}
      </AideChamp>

      {latitude !== null || longitude !== null ? (
        <Button type="button" variante="courbe" taille="sm" onClick={() => onChange(null, null)}>
          Retirer de la carte
        </Button>
      ) : null}
    </div>
  );
}

const lire = (texte: string) => {
  const nombre = Number(texte.replace(",", "."));
  return texte.trim() === "" || !Number.isFinite(nombre) ? null : nombre;
};

/**
 * Champ de coordonnée : garde le texte saisi tel quel (« - », « 4. »…) pour
 * permettre d'écrire un nombre négatif ou décimal, et ne transmet que les
 * valeurs lisibles. Un clic sur la carte remplace le texte.
 */
function ChampCoordonnee({
  id,
  libelle,
  valeur,
  onValeur,
  exemple,
}: {
  id: string;
  libelle: string;
  valeur: number | null;
  onValeur: (valeur: number | null) => void;
  exemple: string;
}) {
  const [texte, setTexte] = React.useState(valeur === null ? "" : String(valeur));
  // Valeur changée de l'extérieur (clic sur la carte, « Retirer ») : on suit.
  if (lire(texte) !== valeur) {
    setTexte(valeur === null ? "" : String(valeur));
  }

  return (
    <ChampFormulaire id={id} libelle={libelle}>
      {(aria) => (
        <Input
          {...aria}
          inputMode="decimal"
          value={texte}
          onChange={(evenement) => {
            setTexte(evenement.target.value);
            onValeur(lire(evenement.target.value));
          }}
          placeholder={`Ex. : ${exemple}`}
        />
      )}
    </ChampFormulaire>
  );
}
