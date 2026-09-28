import { EnteteAdmin } from "@/components/admin/entete-admin";
import { Alert } from "@/components/ui/alert";
import { listerChiffres } from "@/lib/admin-data";
import { EditeurChiffres } from "./editeur-chiffres";

export const metadata = { title: "Chiffres d'impact" };

/** Chiffres d'impact affichés sur la page d'accueil. */
export default async function PageAdminChiffres() {
  const chiffres = await listerChiffres();

  return (
    <div className="space-y-10">
      <EnteteAdmin
        surtitre="Page d'accueil"
        titre="Chiffres d'impact"
        description="Les chiffres de la section « Notre action en bref », dans l'ordre de leur position."
      />

      <Alert titre={chiffres.length ? "Chiffres affichés sur l'accueil" : "Aucun chiffre saisi"}>
        <p>
          {chiffres.length
            ? "Ces chiffres remplacent ceux calculés automatiquement. Supprimez-les tous pour revenir au calcul automatique (projets, lieux équipés, comptes rendus)."
            : "L'accueil affiche pour l'instant des chiffres calculés automatiquement à partir des projets et des articles publiés. Dès le premier chiffre ajouté ici, ce sont les vôtres qui s'affichent."}{" "}
          Quatre chiffres donnent le meilleur rendu. N&apos;indiquez que des chiffres vérifiables :
          c&apos;est ce qui rassure les entreprises.
        </p>
      </Alert>

      <EditeurChiffres chiffres={chiffres} />
    </div>
  );
}
