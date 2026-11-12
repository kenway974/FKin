/**
 * Mise en forme légère du contenu des articles.
 *
 * Le contenu reste du texte brut, saisi dans le back-office : aucun HTML n'est
 * jamais interprété (React échappe tout le texte au rendu). Seules trois
 * conventions, inspirées du Markdown, sont reconnues :
 *
 *   ## Un intertitre          → titre de section (<h2>)
 *   - un élément de liste     → liste à puces
 *   **texte important**       → texte en gras
 *   [texte du lien](/chemin)  → lien interne, ou externe en https://
 *
 * Une ligne vide sépare deux paragraphes, comme avant : les articles écrits
 * sans ces conventions s'affichent à l'identique.
 */

export type Segment =
  | { type: "texte"; texte: string }
  | { type: "gras"; texte: string }
  | { type: "lien"; texte: string; href: string; externe: boolean };

export type Bloc =
  | { type: "intertitre"; texte: string }
  | { type: "paragraphe"; segments: Segment[] }
  | { type: "liste"; elements: Segment[][] };

// L'adresse peut contenir un niveau de parenthèses (`…_(homonymie)`).
const MOTIF_LIEN = /\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;

/**
 * Vrai pour un lien sûr : chemin interne (`/services`, mais pas `//hote`) ou
 * adresse web complète en http(s). Tout le reste (`javascript:`, `data:`…)
 * est refusé.
 */
function lienAutorise(href: string): boolean {
  if (href.startsWith("/")) return !href.startsWith("//") && !href.includes("\\");
  return /^https?:\/\/[^/\s]+/i.test(href);
}

const MOTIF_GRAS = /\*\*([^*\n]+)\*\*/g;

/** Découpe un morceau de texte sans lien en texte normal et texte en gras. */
function separerGras(texte: string): Segment[] {
  const segments: Segment[] = [];
  let position = 0;
  for (const correspondance of texte.matchAll(MOTIF_GRAS)) {
    const debut = correspondance.index ?? 0;
    if (debut > position) segments.push({ type: "texte", texte: texte.slice(position, debut) });
    segments.push({ type: "gras", texte: correspondance[1] ?? "" });
    position = debut + correspondance[0].length;
  }
  if (position < texte.length) segments.push({ type: "texte", texte: texte.slice(position) });
  return segments;
}

/** Découpe une ligne de texte en segments de texte, de gras et de liens. */
function analyserLigne(ligne: string): Segment[] {
  const segments: Segment[] = [];
  let tampon = "";
  let position = 0;

  for (const correspondance of ligne.matchAll(MOTIF_LIEN)) {
    const [complet, texte = "", href = ""] = correspondance;
    tampon += ligne.slice(position, correspondance.index);
    position = (correspondance.index ?? 0) + complet.length;

    if (lienAutorise(href)) {
      segments.push(...separerGras(tampon));
      tampon = "";
      segments.push({ type: "lien", texte, href, externe: !href.startsWith("/") });
    } else {
      tampon += texte;
    }
  }

  tampon += ligne.slice(position);
  segments.push(...separerGras(tampon));
  return segments;
}

export function analyserContenu(contenu: string): Bloc[] {
  const blocs: Bloc[] = [];
  let paragraphe: string[] = [];
  let liste: string[] = [];

  const cloreParagraphe = () => {
    if (paragraphe.length) {
      blocs.push({ type: "paragraphe", segments: analyserLigne(paragraphe.join(" ")) });
      paragraphe = [];
    }
  };
  const cloreListe = () => {
    if (liste.length) {
      blocs.push({ type: "liste", elements: liste.map(analyserLigne) });
      liste = [];
    }
  };

  for (const brute of contenu.replace(/\r\n?/g, "\n").split("\n")) {
    const ligne = brute.trim();

    if (!ligne) {
      cloreParagraphe();
      cloreListe();
    } else if (ligne.startsWith("## ")) {
      cloreParagraphe();
      cloreListe();
      blocs.push({ type: "intertitre", texte: ligne.slice(3).trim() });
    } else if (ligne.startsWith("- ")) {
      cloreParagraphe();
      liste.push(ligne.slice(2).trim());
    } else {
      cloreListe();
      paragraphe.push(ligne);
    }
  }

  cloreParagraphe();
  cloreListe();
  return blocs;
}

/** Texte sans mise en forme, sur une ligne : pour les résumés et descriptions. */
export function texteBrut(contenu: string): string {
  return analyserContenu(contenu)
    .flatMap((bloc) => {
      if (bloc.type === "intertitre") return [bloc.texte];
      const lignes = bloc.type === "liste" ? bloc.elements : [bloc.segments];
      return lignes.map((segments) => segments.map((segment) => segment.texte).join(""));
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
