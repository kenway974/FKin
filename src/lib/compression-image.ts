/**
 * Compression d'une photo dans le navigateur, avant envoi.
 *
 * Une photo de téléphone pèse souvent 3 à 8 Mo : trop lourd pour une
 * connexion mobile moyenne et pour la limite d'envoi du serveur. On la
 * redimensionne et on la réencode en WebP, ou en JPEG si le navigateur ne
 * sait pas produire de WebP (Safari). Si le résultat dépasse encore le poids
 * maximal (photo très détaillée), on réessaie plus petit et plus compressé
 * plutôt que de refuser la photo.
 *
 * L'image est redessinée : les métadonnées EXIF (position GPS notamment) ne
 * sont donc pas transmises.
 */

/** Tentatives successives : côté maximal (px) et qualité d'encodage. */
const TENTATIVES = [
  { cote: 1600, qualite: 0.8 },
  { cote: 1280, qualite: 0.7 },
  { cote: 1024, qualite: 0.6 },
];

/** Erreur distinguant un fichier illisible d'une photo impossible à alléger. */
export class ErreurPhoto extends Error {
  constructor(public raison: "illisible" | "trop-lourde") {
    super(raison);
  }
}

export async function compresserImage(fichier: File, poidsMax: number): Promise<File> {
  const image = await decoder(fichier);
  try {
    for (const { cote, qualite } of TENTATIVES) {
      const blob = await encoder(image, cote, qualite);
      if (blob.size <= poidsMax) {
        const extension = blob.type === "image/webp" ? "webp" : "jpg";
        const nom = fichier.name.replace(/\.[^.]+$/, "") || "photo";
        return new File([blob], `${nom}.${extension}`, { type: blob.type });
      }
    }
    throw new ErreurPhoto("trop-lourde");
  } finally {
    if ("close" in image) image.close();
  }
}

type Source = ImageBitmap | HTMLImageElement;

/**
 * Décode la photo. `createImageBitmap` d'abord (rapide, hors du fil
 * principal) ; à défaut, un élément <img>, qui lit tous les formats que le
 * navigateur sait afficher (le HEIC des iPhone sur Safari, par exemple).
 */
async function decoder(fichier: File): Promise<Source> {
  try {
    return await createImageBitmap(fichier, { imageOrientation: "from-image" });
  } catch {
    const url = URL.createObjectURL(fichier);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      return image;
    } catch {
      throw new ErreurPhoto("illisible");
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

async function encoder(image: Source, coteMax: number, qualite: number): Promise<Blob> {
  const largeurSource = "naturalWidth" in image ? image.naturalWidth : image.width;
  const hauteurSource = "naturalHeight" in image ? image.naturalHeight : image.height;
  if (!largeurSource || !hauteurSource) throw new ErreurPhoto("illisible");

  const echelle = Math.min(1, coteMax / Math.max(largeurSource, hauteurSource));
  const toile = document.createElement("canvas");
  toile.width = Math.round(largeurSource * echelle);
  toile.height = Math.round(hauteurSource * echelle);
  const contexte = toile.getContext("2d");
  if (!contexte) throw new ErreurPhoto("illisible");
  contexte.drawImage(image, 0, 0, toile.width, toile.height);

  const produire = (type: string) =>
    new Promise<Blob | null>((resoudre) => toile.toBlob(resoudre, type, qualite));

  // Safari renvoie du PNG quand on lui demande du WebP : on bascule alors
  // sur le JPEG, bien plus léger qu'un PNG pour une photo.
  let blob = await produire("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await produire("image/jpeg");
  if (!blob) throw new ErreurPhoto("illisible");
  return blob;
}
