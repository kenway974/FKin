"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import {
  CATEGORIES_ARTICLE,
  estCategorieArticle,
  filtrerArticles,
  type CategorieArticle,
} from "@/lib/articles-filtre";
import { cn } from "@/lib/utils";

/** Nombre d'articles affichés d'emblée, puis à chaque « Afficher plus ». */
const PAS = 9;

export type ElementActualite = {
  cle: string;
  titre: string;
  extrait: string | null;
  categorie: CategorieArticle | null;
};

/**
 * Liste filtrable des actualités : rubriques, recherche et affichage
 * progressif.
 *
 * Les cartes sont rendues par le serveur et toutes présentes dans le HTML :
 * les moteurs de recherche voient chaque article, même ceux qu'un filtre ou
 * l'affichage progressif masque à l'écran (attribut `hidden`). Le filtre
 * ne fait que montrer ou cacher, sans rien recharger : il reste instantané,
 * même sur une connexion lente.
 *
 * La rubrique et la recherche sont reportées dans l'adresse
 * (`?categorie=congo&q=ecole`) : un lien partagé rouvre la même sélection.
 */
export function ListeActualites({
  elements,
  cartes,
}: {
  elements: ElementActualite[];
  cartes: React.ReactNode[];
}) {
  const [categorie, setCategorie] = React.useState<CategorieArticle | null>(null);
  const [recherche, setRecherche] = React.useState("");
  const [limite, setLimite] = React.useState(PAS);
  const idRecherche = React.useId();

  // Sélection d'origine lue dans l'adresse, une fois la page affichée.
  React.useEffect(() => {
    const parametres = new URLSearchParams(window.location.search);
    const depuisAdresse = parametres.get("categorie");
    if (estCategorieArticle(depuisAdresse)) setCategorie(depuisAdresse);
    setRecherche(parametres.get("q") ?? "");
  }, []);

  // Et reportée dans l'adresse à chaque changement, sans recharger la page.
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (categorie) url.searchParams.set("categorie", categorie);
    else url.searchParams.delete("categorie");
    if (recherche.trim()) url.searchParams.set("q", recherche.trim());
    else url.searchParams.delete("q");
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }, [categorie, recherche]);

  const resultats = filtrerArticles(elements, { categorie, recherche });
  const visibles = new Set(resultats.slice(0, limite).map((element) => element.cle));
  const filtreActif = Boolean(categorie || recherche.trim());

  const compte = (id: CategorieArticle | null) =>
    id ? elements.filter((element) => element.categorie === id).length : elements.length;

  function choisir(id: CategorieArticle | null) {
    setCategorie(id);
    setLimite(PAS);
  }

  function reinitialiser() {
    setCategorie(null);
    setRecherche("");
    setLimite(PAS);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="relative max-w-xl">
          <label htmlFor={idRecherche} className="sr-only">
            Rechercher un article
          </label>
          <Search
            className="text-doux pointer-events-none absolute top-1/2 left-1 size-5 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id={idRecherche}
            type="search"
            value={recherche}
            onChange={(evenement) => {
              setRecherche(evenement.target.value);
              setLimite(PAS);
            }}
            placeholder="Rechercher un article…"
            className="border-bordure text-encre placeholder:text-doux/70 focus:border-bleu h-12 w-full rounded-none border-0 border-b-2 bg-transparent pr-2 pl-9 text-lg focus:shadow-[0_2px_0_0_var(--color-bleu)] focus:outline-none"
          />
        </div>

        <div role="group" aria-label="Filtrer par rubrique" className="flex flex-wrap gap-2">
          {[null, ...CATEGORIES_ARTICLE.map((c) => c.id)].map((id) => {
            const actif = categorie === id;
            const libelle = id
              ? CATEGORIES_ARTICLE.find((c) => c.id === id)?.libelle
              : "Toutes les rubriques";
            const nombre = compte(id);
            if (id && nombre === 0) return null;
            return (
              <button
                key={id ?? "toutes"}
                type="button"
                aria-pressed={actif}
                onClick={() => choisir(id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  actif
                    ? "border-marine bg-marine text-white"
                    : "border-bordure text-encre hover:border-marine bg-white",
                )}
              >
                {libelle}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    actif ? "bg-white/20" : "bg-nuage text-doux",
                  )}
                >
                  {nombre}
                </span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="text-doux text-sm">
          {resultats.length === 0
            ? "Aucun article ne correspond."
            : `${resultats.length} article${resultats.length > 1 ? "s" : ""}${filtreActif ? " trouvé" + (resultats.length > 1 ? "s" : "") : ""}`}
          {filtreActif ? (
            <button
              type="button"
              onClick={reinitialiser}
              className="text-rouge-fonce ml-3 inline-flex items-center gap-1 font-semibold underline underline-offset-4"
            >
              <X className="size-3.5" aria-hidden="true" />
              Tout afficher
            </button>
          ) : null}
        </p>
      </div>

      <ul
        data-apparition-cascade=""
        className="grid gap-x-5 gap-y-7 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3"
      >
        {elements.map((element, index) => (
          <li key={element.cle} hidden={!visibles.has(element.cle)}>
            {cartes[index]}
          </li>
        ))}
      </ul>

      {resultats.length > limite ? (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setLimite((valeur) => valeur + PAS)}
            className="border-marine text-marine hover:bg-marine rounded-full border-2 px-6 py-3 font-semibold transition-colors hover:text-white"
          >
            Afficher plus d&apos;articles ({resultats.length - limite} restant
            {resultats.length - limite > 1 ? "s" : ""})
          </button>
        </div>
      ) : null}
    </div>
  );
}
