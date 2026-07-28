"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Bouton de suppression avec confirmation en deux temps.
 *
 * Le premier clic transforme le bouton en demande de confirmation explicite ;
 * seul le second déclenche la suppression. Plus fiable qu'un `window.confirm`
 * natif, souvent bloqué ou ignoré, et l'intitulé du bouton indique clairement
 * ce qui va être supprimé — utile au clavier comme au lecteur d'écran.
 */
export function BoutonSuppression({
  intitule,
  onSupprimer,
  redirectionApres,
}: {
  /** Nom de l'élément, repris dans la demande de confirmation. */
  intitule: string;
  onSupprimer: () => Promise<{ statut: "succes" | "erreur"; message: string }>;
  /** Page vers laquelle revenir après une suppression réussie. */
  redirectionApres?: string;
}) {
  const router = useRouter();
  const [confirmation, setConfirmation] = React.useState(false);
  const [enCours, setEnCours] = React.useState(false);
  const [erreur, setErreur] = React.useState<string | null>(null);

  // La demande de confirmation retombe d'elle-même au bout de 6 secondes.
  React.useEffect(() => {
    if (!confirmation) return;
    const minuteur = setTimeout(() => setConfirmation(false), 6000);
    return () => clearTimeout(minuteur);
  }, [confirmation]);

  async function supprimer() {
    setEnCours(true);
    setErreur(null);

    const reponse = await onSupprimer();

    if (reponse.statut === "erreur") {
      setErreur(reponse.message);
      setEnCours(false);
      setConfirmation(false);
      return;
    }

    if (redirectionApres) {
      router.push(redirectionApres);
    }
    router.refresh();
  }

  return (
    <div className="space-y-1.5">
      {confirmation ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-red-900">
            Supprimer définitivement « {intitule} » ?
          </span>
          <Button
            type="button"
            variante="danger"
            taille="sm"
            onClick={supprimer}
            disabled={enCours}
          >
            {enCours ? "Suppression…" : "Oui, supprimer"}
          </Button>
          <Button
            type="button"
            variante="discret"
            taille="sm"
            onClick={() => setConfirmation(false)}
            disabled={enCours}
          >
            Annuler
          </Button>
        </div>
      ) : (
        <Button type="button" variante="danger" taille="sm" onClick={() => setConfirmation(true)}>
          <Trash2 className="size-4" aria-hidden="true" />
          Supprimer
        </Button>
      )}

      {erreur ? (
        <p role="alert" className="text-sm font-medium text-red-800">
          {erreur}
        </p>
      ) : null}
    </div>
  );
}
