import { EnteteAdmin } from "@/components/admin/entete-admin";
import { Alert } from "@/components/ui/alert";
import { lireCoordonneesAdmin } from "@/lib/admin-data";
import { fusionnerCoordonnees } from "@/lib/coordonnees";
import { FormulaireCoordonnees } from "./formulaire-coordonnees";

export const metadata = { title: "Coordonnées" };

/** Coordonnées affichées sur le site public. */
export default async function PageAdminCoordonnees() {
  // Table absente : le script `supabase/schema.sql` n'a pas été relancé.
  const { ligne, tableAbsente } = await lireCoordonneesAdmin();
  const coordonnees = fusionnerCoordonnees(ligne);

  return (
    <div className="space-y-10">
      <EnteteAdmin
        surtitre="Tout le site"
        titre="Coordonnées"
        description="L'adresse e-mail, le téléphone, les adresses et le numéro WhatsApp de l'association."
      />

      {tableAbsente ? (
        <Alert titre="Les coordonnées ne sont pas encore modifiables">
          <p>
            La base de données doit être mise à jour : relancez le fichier{" "}
            <code>supabase/schema.sql</code> dans Supabase (voir le README). En attendant, le site
            affiche les coordonnées d&apos;origine.
          </p>
        </Alert>
      ) : (
        <>
          <Alert titre="Où s'affichent ces coordonnées">
            <p>
              Dans le pied de page de toutes les pages, sur la page contact et dans les mentions
              légales. Les modifications sont visibles dès l&apos;enregistrement.
            </p>
          </Alert>
          <FormulaireCoordonnees
            valeurs={{
              email: coordonnees.email,
              telephone: coordonnees.telephone,
              rue: coordonnees.rue,
              codePostal: coordonnees.codePostal,
              ville: coordonnees.ville,
              adresseRdc: coordonnees.adresseRdc,
              whatsapp: ligne?.whatsapp ?? "",
            }}
          />
        </>
      )}
    </div>
  );
}
