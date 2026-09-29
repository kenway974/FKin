import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

/**
 * Champs de formulaire.
 *
 * Chaque champ est associé à son `<label>` via `htmlFor`, et le message
 * d'erreur est relié par `aria-describedby` : un lecteur d'écran annonce donc
 * l'erreur en même temps que le champ concerné.
 */

export function Label({
  className,
  ...proprietes
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("text-encre block text-sm font-semibold", className)}
      {...proprietes}
    />
  );
}

// Pas de boîte : un simple trait souligné, qui s'épaissit et passe au bleu
// quand le champ est actif, au rouge quand il est en erreur.
const styleChamp =
  "w-full rounded-none border-0 border-b-2 border-bordure bg-transparent px-0.5 py-2.5 text-lg text-encre transition-colors placeholder:text-doux/60 hover:border-doux/50 focus:border-bleu focus:shadow-[0_2px_0_0_var(--color-bleu)] focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-red-700";

export function Input({ className, ...proprietes }: React.ComponentProps<"input">) {
  return <input className={cn(styleChamp, "h-12", className)} {...proprietes} />;
}

export function Textarea({ className, ...proprietes }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(styleChamp, "min-h-32 resize-y leading-relaxed", className)}
      {...proprietes}
    />
  );
}

export function Select({ className, ...proprietes }: React.ComponentProps<"select">) {
  return <select className={cn(styleChamp, "h-12 pr-8", className)} {...proprietes} />;
}

/** Message d'erreur d'un champ. `role="alert"` le rend annoncé dès son apparition. */
export function MessageErreur({ id, children }: { id?: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-sm font-medium text-red-800">
      {children}
    </p>
  );
}

/** Texte d'aide sous un champ (indications de saisie, format attendu…). */
export function AideChamp({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-doux text-sm">
      {children}
    </p>
  );
}

/** Regroupe label + champ + aide + erreur avec un espacement homogène. */
export function Champ({ className, ...proprietes }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1.5", className)} {...proprietes} />;
}

/** Attributs d'accessibilité à poser sur le contrôle d'un `ChampFormulaire`. */
export type AriaChamp = {
  id: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
  "aria-describedby"?: string;
};

/**
 * Champ complet : libellé (avec astérisque si requis), contrôle, aide et
 * erreur, reliés entre eux pour les lecteurs d'écran. Le contrôle est fourni
 * en fonction, qui reçoit les attributs d'accessibilité à lui passer :
 *
 *   <ChampFormulaire id="nom" libelle="Nom" requis erreur={errors.nom?.message}>
 *     {(aria) => <Input {...aria} {...register("nom")} />}
 *   </ChampFormulaire>
 */
export function ChampFormulaire({
  id,
  libelle,
  requis = false,
  aide,
  erreur,
  className,
  children,
}: {
  id: string;
  libelle: React.ReactNode;
  requis?: boolean;
  aide?: React.ReactNode;
  erreur?: string;
  className?: string;
  children: (aria: AriaChamp) => React.ReactNode;
}) {
  const decrit = [aide ? `aide-${id}` : null, erreur ? `erreur-${id}` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <Champ className={className}>
      <Label htmlFor={id}>
        {libelle}
        {requis ? <span aria-hidden="true"> *</span> : null}
      </Label>
      {children({
        id,
        "aria-invalid": erreur ? true : undefined,
        "aria-required": requis ? true : undefined,
        "aria-describedby": decrit || undefined,
      })}
      {aide ? <AideChamp id={`aide-${id}`}>{aide}</AideChamp> : null}
      <MessageErreur id={`erreur-${id}`}>{erreur}</MessageErreur>
    </Champ>
  );
}
