import * as React from "react";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bandeau de message (succès, erreur, information).
 *
 * `role="status"` pour les messages neutres et de succès, `role="alert"` pour
 * les erreurs : seules ces dernières interrompent la lecture en cours d'un
 * lecteur d'écran, ce qui évite d'être intrusif sans raison.
 */
export function Alert({
  ton = "info",
  titre,
  children,
  className,
}: {
  ton?: "info" | "succes" | "erreur";
  titre?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  // Pas de cadre : l'icône, posée sur une pastille de couleur, porte seule
  // le ton du message ; le texte reste directement sur la page.
  const styles = {
    info: { texte: "text-encre", pastille: "bg-bleu-voile text-bleu" },
    succes: { texte: "text-bleu-fonce", pastille: "bg-bleu-vif text-white" },
    erreur: { texte: "text-red-900", pastille: "bg-rouge-vif text-white" },
  } as const;

  const Icone = ton === "succes" ? CircleCheck : ton === "erreur" ? CircleAlert : Info;

  return (
    <div
      role={ton === "erreur" ? "alert" : "status"}
      className={cn("flex gap-4", styles[ton].texte, className)}
    >
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-full",
          styles[ton].pastille,
        )}
      >
        <Icone className="size-5" aria-hidden="true" />
      </span>
      <div className="space-y-1 pt-1.5 leading-relaxed">
        {titre ? <p className="font-titre text-lg font-semibold">{titre}</p> : null}
        {children}
      </div>
    </div>
  );
}
