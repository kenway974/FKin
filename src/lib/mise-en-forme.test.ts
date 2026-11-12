import { describe, expect, it } from "vitest";
import { analyserContenu, texteBrut } from "@/lib/mise-en-forme";

const texte = (t: string) => ({ type: "texte", texte: t });

describe("analyserContenu", () => {
  it("garde le comportement historique : une ligne vide sépare deux paragraphes", () => {
    expect(analyserContenu("Premier.\n\nSecond\nsur deux lignes.")).toEqual([
      { type: "paragraphe", segments: [texte("Premier.")] },
      { type: "paragraphe", segments: [texte("Second sur deux lignes.")] },
    ]);
  });

  it("transforme « ## » en intertitre", () => {
    expect(analyserContenu("## Que dit la loi ?\n\nLe texte.")).toEqual([
      { type: "intertitre", texte: "Que dit la loi ?" },
      { type: "paragraphe", segments: [texte("Le texte.")] },
    ]);
  });

  it("accepte un intertitre collé à son paragraphe", () => {
    expect(analyserContenu("## Titre\nLe texte.")).toEqual([
      { type: "intertitre", texte: "Titre" },
      { type: "paragraphe", segments: [texte("Le texte.")] },
    ]);
  });

  it("regroupe les lignes « - » en une liste", () => {
    expect(analyserContenu("Avant :\n- ordinateurs\n- écrans\n\nAprès.")).toEqual([
      { type: "paragraphe", segments: [texte("Avant :")] },
      { type: "liste", elements: [[texte("ordinateurs")], [texte("écrans")]] },
      { type: "paragraphe", segments: [texte("Après.")] },
    ]);
  });

  it("reconnaît les liens internes et https", () => {
    expect(
      analyserContenu("Voir [nos services](/services) et [la CNIL](https://www.cnil.fr)."),
    ).toEqual([
      {
        type: "paragraphe",
        segments: [
          texte("Voir "),
          { type: "lien", texte: "nos services", href: "/services", externe: false },
          texte(" et "),
          { type: "lien", texte: "la CNIL", href: "https://www.cnil.fr", externe: true },
          texte("."),
        ],
      },
    ]);
  });

  it("refuse tout lien dangereux ou ambigu et n'en garde que le texte", () => {
    for (const href of ["javascript:alert(1)", "//evil.com", "data:text/html,x", "ftp://x.fr"]) {
      expect(analyserContenu(`[clic](${href})`)).toEqual([
        { type: "paragraphe", segments: [texte("clic")] },
      ]);
    }
  });

  it("met en gras le texte entre doubles astérisques, y compris dans une liste", () => {
    expect(analyserContenu("- **Écrans** : utiles.\n\nUn **mot** fort.")).toEqual([
      {
        type: "liste",
        elements: [[{ type: "gras", texte: "Écrans" }, texte(" : utiles.")]],
      },
      {
        type: "paragraphe",
        segments: [texte("Un "), { type: "gras", texte: "mot" }, texte(" fort.")],
      },
    ]);
  });

  it("laisse tels quels des astérisques isolés", () => {
    expect(analyserContenu("Note * importante")).toEqual([
      { type: "paragraphe", segments: [texte("Note * importante")] },
    ]);
  });

  it("n'interprète jamais de HTML", () => {
    expect(analyserContenu("<script>alert(1)</script>")).toEqual([
      { type: "paragraphe", segments: [texte("<script>alert(1)</script>")] },
    ]);
  });

  it("renvoie une liste vide pour un contenu vide", () => {
    expect(analyserContenu("  \n\n ")).toEqual([]);
  });
});

describe("texteBrut", () => {
  it("retire la mise en forme pour produire un résumé lisible", () => {
    expect(texteBrut("## Titre\n\nUn [lien](/contact) **utile**.\n\n- un\n- deux")).toBe(
      "Titre Un lien utile. un deux",
    );
  });
});
