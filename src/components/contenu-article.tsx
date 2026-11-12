import Link from "next/link";
import { analyserContenu, type Segment } from "@/lib/mise-en-forme";

/**
 * Corps d'un article : intertitres, paragraphes, listes et liens, à partir du
 * texte saisi dans le back-office (conventions dans `lib/mise-en-forme.ts`).
 *
 * Aucun HTML n'est interprété : chaque morceau de texte est rendu par React,
 * qui l'échappe. Les liens ne sont produits que pour des adresses vérifiées
 * (chemin interne ou http(s)).
 */
const classeLien =
  "text-rouge-fonce decoration-rouge/40 hover:decoration-rouge font-semibold underline underline-offset-4";

function Segments({ segments }: { segments: Segment[] }) {
  return segments.map((segment, index) => {
    if (segment.type === "texte") return segment.texte;
    return segment.externe ? (
      <a
        key={index}
        href={segment.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classeLien}
      >
        {segment.texte}
      </a>
    ) : (
      <Link key={index} href={segment.href} className={classeLien}>
        {segment.texte}
      </Link>
    );
  });
}

export function ContenuArticle({ contenu }: { contenu: string }) {
  return (
    <div className="text-encre/90 space-y-5 text-[1.05rem] leading-relaxed">
      {analyserContenu(contenu).map((bloc, index) => {
        if (bloc.type === "intertitre") {
          return (
            <h2
              key={index}
              className="font-titre text-encre pt-6 text-2xl leading-snug font-bold md:text-3xl"
            >
              {bloc.texte}
            </h2>
          );
        }
        if (bloc.type === "liste") {
          return (
            <ul key={index} className="marker:text-rouge list-disc space-y-2 pl-6">
              {bloc.elements.map((element, rang) => (
                <li key={rang}>
                  <Segments segments={element} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index}>
            <Segments segments={bloc.segments} />
          </p>
        );
      })}
    </div>
  );
}
