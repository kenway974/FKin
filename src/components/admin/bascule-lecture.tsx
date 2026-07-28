"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marquerCommeLu } from "@/app/admin/messages/actions";

/**
 * Remet un message à l'état « non lu ».
 *
 * L'ouverture d'un message le marque automatiquement comme lu ; ce bouton
 * permet de le remettre en avant pour le traiter plus tard.
 */
export function BasculeLecture({ id }: { id: string }) {
  const router = useRouter();
  const [enCours, setEnCours] = React.useState(false);

  async function basculer() {
    setEnCours(true);
    await marquerCommeLu(id, false);
    router.push("/admin/messages");
    router.refresh();
  }

  return (
    <Button type="button" variante="contour" onClick={basculer} disabled={enCours}>
      <MailOpen className="size-4" aria-hidden="true" />
      {enCours ? "Mise à jour…" : "Marquer comme non lu"}
    </Button>
  );
}
