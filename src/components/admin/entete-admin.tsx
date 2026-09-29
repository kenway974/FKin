import * as React from "react";
import { Surtitre } from "@/components/ui/surtitre";

/**
 * En-tête des pages du back-office : surtitre à barre rouge, grand titre et
 * description, comme les titres de section du site public ; les actions
 * (bouton « Nouvel article »…) se placent à droite.
 */
export function EnteteAdmin({
  surtitre,
  titre,
  description,
  children,
}: {
  surtitre?: string;
  titre: string;
  description?: React.ReactNode;
  /** Actions de la page. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div>
        {surtitre ? <Surtitre className="mb-3">{surtitre}</Surtitre> : null}
        <h1 className="text-3xl font-bold text-balance md:text-4xl">{titre}</h1>
        {description ? <p className="text-doux mt-2 text-lg">{description}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
    </div>
  );
}
