"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChampFormulaire, Input, Select, Textarea } from "@/components/ui/field";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { schemaQuestionFaq, type DonneesQuestionFaq } from "@/lib/validation/contenu";
import type { LigneFaq } from "@/types/database";
import { enregistrerQuestion, supprimerQuestion } from "./actions";
import { Surtitre } from "@/components/ui/surtitre";

/**
 * Édition de la FAQ : une ligne par question, modifiable sur place. Une
 * dernière ligne, vide, sert à en ajouter une.
 */
export function EditeurFaq({ questions }: { questions: LigneFaq[] }) {
  return (
    <div className="space-y-2">
      <ul className="divide-bordure divide-y">
        {questions.map((question) => (
          <li key={question.id} className="py-8 first:pt-0">
            <LigneQuestion question={question} />
          </li>
        ))}
      </ul>
      <div className="pt-6">
        <Surtitre className="mb-6">Ajouter une question</Surtitre>
        <LigneQuestion ordreParDefaut={questions.length} />
      </div>
    </div>
  );
}

const videParDefaut = (ordre: number): DonneesQuestionFaq => ({
  question: "",
  reponse: "",
  public: "tous",
  essentielle: false,
  ordre,
});

function LigneQuestion({
  question,
  ordreParDefaut = 0,
}: {
  question?: LigneFaq;
  ordreParDefaut?: number;
}) {
  const router = useRouter();
  const [retour, setRetour] = React.useState<{ ok: boolean; message: string } | null>(null);
  const prefixe = question ? `faq-${question.id}` : "nouvelle-question";

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DonneesQuestionFaq>({
    resolver: zodResolver(schemaQuestionFaq),
    defaultValues: question
      ? {
          question: question.question,
          reponse: question.reponse,
          public: question.public,
          essentielle: question.essentielle,
          ordre: question.ordre,
        }
      : videParDefaut(ordreParDefaut),
  });

  async function auEnvoi(donnees: DonneesQuestionFaq) {
    setRetour(null);
    const reponse = await enregistrerQuestion(question?.id ?? null, donnees);
    if (reponse.statut === "erreur") {
      for (const [champ, messages] of Object.entries(reponse.erreursChamps ?? {})) {
        if (messages?.[0]) setError(champ as keyof DonneesQuestionFaq, { message: messages[0] });
      }
      setRetour({ ok: false, message: reponse.message });
      return;
    }
    setRetour({ ok: true, message: reponse.message });
    reset(question ? donnees : videParDefaut(donnees.ordre + 1));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(auEnvoi)} noValidate className="space-y-5">
      <ChampFormulaire
        id={`${prefixe}-question`}
        libelle="Question"
        requis
        erreur={errors.question?.message}
      >
        {(aria) => (
          <Input
            {...aria}
            placeholder="Ex. : Certains matériels sont-ils mis en vente ?"
            {...register("question")}
          />
        )}
      </ChampFormulaire>

      <ChampFormulaire
        id={`${prefixe}-reponse`}
        libelle="Réponse"
        requis
        erreur={errors.reponse?.message}
      >
        {(aria) => <Textarea {...aria} rows={4} {...register("reponse")} />}
      </ChampFormulaire>

      <div className="grid gap-5 sm:grid-cols-[1fr_1fr_7rem]">
        <ChampFormulaire
          id={`${prefixe}-public`}
          libelle="Pour qui"
          erreur={errors.public?.message}
        >
          {(aria) => (
            <Select {...aria} {...register("public")}>
              <option value="tous">Tout le monde</option>
              <option value="donateurs">Entreprises donatrices</option>
              <option value="beneficiaires">Structures bénéficiaires</option>
            </Select>
          )}
        </ChampFormulaire>
        <ChampFormulaire id={`${prefixe}-essentielle`} libelle="Page contact">
          {(aria) => (
            <Select
              {...aria}
              {...register("essentielle", {
                // Un `<select>` ne renvoie que des chaînes : on rétablit le booléen.
                setValueAs: (valeur) => valeur === true || valeur === "true",
              })}
            >
              <option value="false">Page « Comment ça marche » seulement</option>
              <option value="true">Aussi sous le formulaire de contact</option>
            </Select>
          )}
        </ChampFormulaire>
        <ChampFormulaire id={`${prefixe}-ordre`} libelle="Position" erreur={errors.ordre?.message}>
          {(aria) => (
            <Input
              {...aria}
              type="number"
              inputMode="numeric"
              min={0}
              max={99}
              {...register("ordre", { valueAsNumber: true })}
            />
          )}
        </ChampFormulaire>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="submit" taille="sm" disabled={isSubmitting || (question && !isDirty)}>
          {isSubmitting ? "Enregistrement…" : question ? "Enregistrer" : "Ajouter"}
          {question ? <Save aria-hidden="true" /> : <Plus aria-hidden="true" />}
        </Button>
        {question ? (
          <BoutonSuppression
            intitule={question.question}
            onSupprimer={supprimerQuestion.bind(null, question.id)}
          />
        ) : null}
        {retour ? (
          <p
            role="status"
            className={
              retour.ok ? "text-bleu text-sm font-semibold" : "text-sm font-semibold text-red-800"
            }
          >
            {retour.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
