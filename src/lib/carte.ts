import { PANNEAUX } from "@/lib/carte-geo";

/**
 * Projection de Mercator (identique à celle qui a servi à générer les
 * contours de `carte-geo.ts`) : place un point sur la carte, ou retrouve ses
 * coordonnées à partir d'un clic.
 */

export type NomPanneau = keyof typeof PANNEAUX;

const RAD = Math.PI / 180;

/** Panneau (France ou Congo) où tombe un point, avec sa position en pixels. */
export function projeter(latitude: number, longitude: number) {
  for (const nom of Object.keys(PANNEAUX) as NomPanneau[]) {
    const { k, tx, ty, bornes } = PANNEAUX[nom];
    const [ouest, sud, est, nord] = bornes;
    if (longitude < ouest || longitude > est || latitude < sud || latitude > nord) continue;
    return {
      panneau: nom,
      x: tx + k * longitude * RAD,
      y: ty - k * Math.log(Math.tan(Math.PI / 4 + (latitude * RAD) / 2)),
    };
  }
  return null;
}

/** Coordonnées (arrondies à ~100 m) d'un point cliqué sur un panneau. */
export function inverser(panneau: NomPanneau, x: number, y: number) {
  const { k, tx, ty } = PANNEAUX[panneau];
  const longitude = (x - tx) / k / RAD;
  const latitude = (2 * Math.atan(Math.exp((ty - y) / k)) - Math.PI / 2) / RAD;
  const arrondir = (valeur: number) => Math.round(valeur * 1000) / 1000;
  return { latitude: arrondir(latitude), longitude: arrondir(longitude) };
}
