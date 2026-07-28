import { cn } from "@/lib/utils";

/**
 * Logo du site, en SVG inline.
 *
 * Inline plutôt qu'en fichier image : aucune requête réseau supplémentaire, et
 * le rendu reste net sur tous les écrans. Le motif évoque une passerelle entre
 * deux rives — la métaphore de l'activité de la structure.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("text-terre", className)}
    >
      <circle cx="24" cy="24" r="23" fill="currentColor" opacity="0.1" />
      {/* Les deux rives */}
      <rect x="4" y="28" width="10" height="12" rx="2" fill="currentColor" />
      <rect x="34" y="28" width="10" height="12" rx="2" fill="currentColor" />
      {/* La passerelle */}
      <path
        d="M9 28c0-9 6.7-15 15-15s15 6 15 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* La graine / le résultat, en vert */}
      <circle cx="24" cy="21" r="4.5" className="fill-vert" />
    </svg>
  );
}
