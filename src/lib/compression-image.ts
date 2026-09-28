/**
 * Compression d'une photo dans le navigateur, avant envoi.
 *
 * Une photo de téléphone pèse souvent 3 à 8 Mo : trop lourd pour une
 * connexion mobile moyenne et pour la limite d'envoi du serveur. On la
 * redimensionne (1600 px sur le grand côté, largement assez pour juger d'un
 * lot de matériel) et on la réencode en WebP, ou en JPEG si le navigateur ne
 * sait pas produire de WebP (Safari). Résultat typique : 150 à 400 Ko.
 *
 * L'image est redessinée : les métadonnées EXIF (position GPS notamment) ne
 * sont donc pas transmises.
 */

const COTE_MAX = 1600;

export async function compresserImage(fichier: File): Promise<File> {
  const image = await createImageBitmap(fichier);
  const echelle = Math.min(1, COTE_MAX / Math.max(image.width, image.height));
  const largeur = Math.round(image.width * echelle);
  const hauteur = Math.round(image.height * echelle);

  const toile = document.createElement("canvas");
  toile.width = largeur;
  toile.height = hauteur;
  const contexte = toile.getContext("2d");
  if (!contexte) throw new Error("Canvas indisponible");
  contexte.drawImage(image, 0, 0, largeur, hauteur);
  image.close();

  const encoder = (type: string) =>
    new Promise<Blob | null>((resoudre) => toile.toBlob(resoudre, type, 0.8));

  // Safari renvoie du PNG quand on lui demande du WebP : on bascule alors
  // sur le JPEG, bien plus léger qu'un PNG pour une photo.
  let blob = await encoder("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await encoder("image/jpeg");
  if (!blob) throw new Error("Encodage impossible");

  const extension = blob.type === "image/webp" ? "webp" : "jpg";
  const nom = fichier.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${nom}.${extension}`, { type: blob.type });
}
