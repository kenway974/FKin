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

const styleChamp =
  "w-full rounded-douce border border-bordure bg-white px-3.5 py-2.5 text-encre placeholder:text-doux/70 disabled:cursor-not-allowed disabled:bg-sable aria-invalid:border-red-700";

export function Input({ className, ...proprietes }: React.ComponentProps<"input">) {
  return <input className={cn(styleChamp, "h-11", className)} {...proprietes} />;
}

export function Textarea({ className, ...proprietes }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(styleChamp, "min-h-32 resize-y", className)} {...proprietes} />;
}

export function Select({ className, ...proprietes }: React.ComponentProps<"select">) {
  return <select className={cn(styleChamp, "h-11 pr-8", className)} {...proprietes} />;
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
