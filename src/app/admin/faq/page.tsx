import { EnteteAdmin } from "@/components/admin/entete-admin";
import { Alert } from "@/components/ui/alert";
import { listerQuestionsFaq } from "@/lib/admin-data";
import type { LigneFaq } from "@/types/database";
import { EditeurFaq } from "./editeur-faq";

export const metadata = { title: "FAQ" };

/** Questions fréquentes de la page « Comment ça marche » et de la page contact. */
export default async function PageAdminFaq() {
  let questions: LigneFaq[] | null;
  try {
    questions = await listerQuestionsFaq();
  } catch {
    // Table absente : le script `supabase/schema.sql` n'a pas été relancé.
    questions = null;
  }

  return (
    <div className="space-y-10">
      <EnteteAdmin
        surtitre="Comment ça marche · Contact"
        titre="FAQ"
        description="Les questions fréquentes, dans l'ordre de leur position."
      />

      {questions === null ? (
        <Alert titre="La FAQ n'est pas encore disponible">
          <p>
            La base de données doit être mise à jour : relancez le fichier{" "}
            <code>supabase/schema.sql</code> dans Supabase (voir le README). En attendant, le site
            affiche la FAQ d&apos;origine.
          </p>
        </Alert>
      ) : (
        <>
          <Alert titre="Questions affichées sur le site">
            <p>
              Les questions s&apos;affichent dans cet ordre sur la page « Comment ça marche ».
              Celles marquées « aussi sous le formulaire » apparaissent également sur la page
              contact. Supprimer toutes les questions fait revenir la FAQ d&apos;origine.
            </p>
          </Alert>
          <EditeurFaq questions={questions} />
        </>
      )}
    </div>
  );
}
