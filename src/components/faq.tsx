import { Plus } from "lucide-react";
import type { QuestionFaq } from "@/lib/faq";

/**
 * Questions fréquentes en accordéon, sans cadre : une question par ligne,
 * séparées d'un filet, un « + » dans une pastille qui pivote à l'ouverture.
 *
 * Éléments `<details>` natifs : accessibles au clavier et aux lecteurs
 * d'écran sans JavaScript, et lisibles par les moteurs de recherche même
 * repliés. L'attribut `name` n'autorise qu'une réponse ouverte à la fois
 * (sans effet sur les navigateurs anciens, qui les ouvrent simplement toutes).
 */
export function Faq({ questions, nom = "faq" }: { questions: QuestionFaq[]; nom?: string }) {
  return (
    <div data-apparition-cascade="" className="divide-bordure border-bordure divide-y border-y">
      {questions.map((element) => (
        <details key={element.question} name={nom} className="group faq-question">
          <summary className="hover:text-rouge-fonce flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left transition-colors [&::-webkit-details-marker]:hidden">
            <span className="font-titre text-lg font-semibold md:text-xl">{element.question}</span>
            <span
              aria-hidden="true"
              className="bg-nuage-fonce text-marine group-open:bg-rouge-vif grid size-9 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-300 group-open:rotate-45 group-open:text-white"
            >
              <Plus className="size-5" />
            </span>
          </summary>
          <div className="faq-reponse text-doux max-w-3xl pr-14 pb-6 leading-relaxed md:text-lg">
            {element.reponse}
          </div>
        </details>
      ))}
    </div>
  );
}

/** Données structurées `FAQPage` (à poser sur une seule page du site). */
export function donneesFaq(questions: QuestionFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((element) => ({
      "@type": "Question",
      name: element.question,
      acceptedAnswer: { "@type": "Answer", text: element.reponse },
    })),
  };
}
