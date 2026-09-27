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
  const styles = {
    info: "border-bordure bg-sable text-encre",
    succes: "border-vert/30 bg-vert-voile text-vert-fonce",
    erreur: "border-red-300 bg-red-50 text-red-900",
  } as const;

  const Icone = ton === "succes" ? CircleCheck : ton === "erreur" ? CircleAlert : Info;

  return (
    <div
      role={ton === "erreur" ? "alert" : "status"}
      className={cn("rounded-douce flex gap-3 border p-4", styles[ton], className)}
    >
      <Icone className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="space-y-1 text-sm">
        {titre ? <p className="font-semibold">{titre}</p> : null}
        {children}
      </div>
    </div>
  );
}
