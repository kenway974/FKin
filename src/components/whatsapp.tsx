import { MessageCircle } from "lucide-react";
import { lienWhatsApp, whatsAppExemple } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Bouton flottant « Écrire sur WhatsApp », en bas à droite des pages
 * publiques. Pilule marine et pastille verte (le vert de WhatsApp, pour être
 * reconnu d'un coup d'œil) ; sur téléphone, la pastille seule. N'apparaît
 * pas si aucun numéro n'est configuré. Aucun JavaScript.
 */
export function BoutonWhatsApp() {
  const lien = lienWhatsApp();
  if (!lien) return null;

  return (
    <a
      href={lien}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-flottant bg-marine focus-visible:ring-bleu-vif fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full p-1.5 text-white shadow-[0_14px_30px_-12px_rgba(22,35,63,0.7)] transition-transform hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:outline-none sm:right-6 sm:bottom-6 sm:pl-5"
    >
      <span className="hidden text-sm font-semibold sm:inline">
        WhatsApp{whatsAppExemple ? " (numéro d'exemple)" : ""}
      </span>
      <PastilleWhatsApp className="size-11" />
      <span className="sr-only">
        Écrire sur WhatsApp (nouvel onglet){whatsAppExemple ? ", numéro d'exemple" : ""}
      </span>
    </a>
  );
}

/** Lien WhatsApp en ligne, pour les blocs de contact. */
export function LienWhatsApp({ className }: { className?: string }) {
  const lien = lienWhatsApp();
  if (!lien) return null;
  return (
    <a
      href={lien}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
    >
      <PastilleWhatsApp className="size-7" />
      <span className="underline decoration-2 underline-offset-4">
        Écrire sur WhatsApp{whatsAppExemple ? " (numéro d'exemple)" : ""}
      </span>
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );
}

function PastilleWhatsApp({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-[#25d366] text-white",
        className,
      )}
    >
      <MessageCircle className="size-[55%]" strokeWidth={2.2} />
    </span>
  );
}
