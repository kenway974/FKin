import { cn } from "@/lib/utils";

/**
 * Illustrations du site, en SVG inline.
 *
 * Pourquoi du SVG plutôt que des images : aucune photographie n'est fournie
 * avec le code, et une banque d'images générique desservirait une structure
 * dont l'argument principal est l'authenticité. Ces illustrations tiennent en
 * quelques kilo-octets, restent nettes sur tous les écrans, ne déclenchent
 * aucune requête réseau et s'adaptent à la palette du thème.
 *
 * Elles sont toutes purement décoratives : `aria-hidden` partout, l'information
 * est portée par le texte adjacent.
 */

/**
 * Scène principale de la bannière d'accueil.
 *
 * Raconte le trajet en une image : un immeuble de bureaux (en France) à gauche,
 * un conteneur au centre, une école baignée de soleil à droite.
 */
export function SceneBanniere({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 500"
      className={cn("w-full", className)}
      /* `xMidYMax meet` : la scène garde ses proportions et reste collée au bas
         de la bannière, comme une ligne d'horizon. Un `slice` la ferait zoomer
         de façon incontrôlée dès que la bannière devient haute. */
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Le haut du ciel est transparent : la scène se fond dans le dégradé
            de la bannière au lieu de créer une couture horizontale visible. */}
        <linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f4858" stopOpacity="0" />
          <stop offset="32%" stopColor="#2f4858" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#7a3915" stopOpacity="1" />
          <stop offset="100%" stopColor="#9c4a1f" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="soleil-halo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8a33d" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e8a33d" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a3915" />
          <stop offset="100%" stopColor="#2b211a" />
        </linearGradient>
      </defs>

      <rect width="1200" height="500" fill="url(#ciel)" />

      {/* Soleil et son halo */}
      <circle cx="905" cy="170" r="150" fill="url(#soleil-halo)" />
      <circle cx="905" cy="170" r="52" fill="#e8a33d" className="respire-soleil" />

      {/* Ligne d'horizon lointaine */}
      <path
        d="M0 300 Q 180 268 340 292 T 700 280 T 1000 296 T 1200 284 L1200 500 L0 500 Z"
        fill="#4a2a12"
        opacity="0.55"
      />

      {/* --- Rive gauche : immeubles de bureaux (France) --- */}
      <g opacity="0.95">
        <rect x="60" y="150" width="94" height="180" rx="4" fill="#243a47" />
        <rect x="168" y="196" width="76" height="134" rx="4" fill="#2f4858" />
        <rect x="16" y="216" width="38" height="114" rx="3" fill="#2f4858" opacity="0.8" />
        {/* Fenêtres allumées */}
        {[0, 1, 2, 3].map((ligne) =>
          [0, 1, 2].map((colonne) => (
            <rect
              key={`g-${ligne}-${colonne}`}
              x={74 + colonne * 26}
              y={168 + ligne * 34}
              width="15"
              height="20"
              rx="2"
              fill="#e8a33d"
              opacity={(ligne + colonne) % 3 === 0 ? 0.85 : 0.35}
            />
          )),
        )}
        {[0, 1, 2].map((ligne) =>
          [0, 1].map((colonne) => (
            <rect
              key={`g2-${ligne}-${colonne}`}
              x={182 + colonne * 28}
              y={214 + ligne * 34}
              width="15"
              height="20"
              rx="2"
              fill="#e8a33d"
              opacity={ligne === 1 ? 0.7 : 0.28}
            />
          )),
        )}
      </g>

      {/* --- Centre : le conteneur en transit --- */}
      <g>
        {/* Trace du trajet */}
        <path
          d="M280 372 C 460 330, 700 330, 900 366"
          fill="none"
          stroke="#e8a33d"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="14 12"
          opacity="0.65"
        />
        <g transform="translate(520 300)">
          <rect x="0" y="0" width="180" height="86" rx="6" fill="#b4472f" />
          <rect
            x="0"
            y="0"
            width="180"
            height="86"
            rx="6"
            fill="none"
            stroke="#7a3915"
            strokeWidth="3"
          />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect
              key={`c-${i}`}
              x={12 + i * 24}
              y="10"
              width="10"
              height="66"
              rx="2"
              fill="#9c4a1f"
            />
          ))}
          <rect x="0" y="86" width="180" height="9" rx="3" fill="#2b211a" />
        </g>
      </g>

      {/* --- Rive droite : l'école --- */}
      <g transform="translate(900 236)">
        {/* Corps du bâtiment */}
        <rect x="0" y="40" width="220" height="120" rx="5" fill="#f6efe6" />
        {/* Toit */}
        <path d="M-16 44 L110 -6 L236 44 Z" fill="#b4472f" />
        {/* Porte */}
        <rect x="94" y="106" width="34" height="54" rx="3" fill="#7a3915" />
        {/* Fenêtres de classe, éclairées */}
        {[0, 1].map((ligne) =>
          [0, 1].map((colonne) => (
            <g key={`e-${ligne}-${colonne}`}>
              <rect
                x={colonne === 0 ? 26 : 150}
                y={62 + ligne * 40}
                width="44"
                height="30"
                rx="3"
                fill="#2f6b4f"
                opacity="0.25"
              />
              <rect
                x={colonne === 0 ? 30 : 154}
                y={66 + ligne * 40}
                width="36"
                height="22"
                rx="2"
                fill="#e8a33d"
                opacity="0.9"
              />
            </g>
          )),
        )}
        {/* Drapeau */}
        <line
          x1="110"
          y1="-6"
          x2="110"
          y2="-52"
          stroke="#f6efe6"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M110 -50 L152 -40 L110 -30 Z" fill="#2f6b4f" />
      </g>

      {/* Végétation au premier plan */}
      <g fill="#2f6b4f">
        <ellipse cx="330" cy="452" rx="86" ry="30" opacity="0.55" />
        <ellipse cx="820" cy="466" rx="120" ry="34" opacity="0.45" />
        <path d="M175 452 q 22 -60 44 0 z" opacity="0.7" />
        <path d="M1035 462 q 26 -68 52 0 z" opacity="0.6" />
      </g>

      <path d="M0 470 Q 300 448 600 466 T 1200 458 L1200 500 L0 500 Z" fill="url(#sol)" />
    </svg>
  );
}

/** Illustration « collecte » : carton, cartes mères, camion stylisé. */
export function IlluCollecte({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="42" width="60" height="36" rx="4" className="fill-terre-voile" />
      <path d="M6 42 L36 26 L66 42 Z" className="fill-terre" opacity="0.85" />
      <rect x="28" y="52" width="16" height="26" rx="2" className="fill-terre" />
      <rect x="70" y="50" width="44" height="28" rx="4" className="fill-indigo" />
      <rect x="74" y="38" width="26" height="14" rx="3" className="fill-indigo" opacity="0.75" />
      <circle cx="82" cy="80" r="7" className="fill-encre" />
      <circle cx="106" cy="80" r="7" className="fill-encre" />
      <circle cx="82" cy="80" r="3" className="fill-sable" />
      <circle cx="106" cy="80" r="3" className="fill-sable" />
      <path d="M6 82 H118" className="stroke-ocre" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Illustration « acheminement » : porte-conteneurs et vagues. */
export function IlluTransport({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="30" y="30" width="22" height="16" rx="2" className="fill-brique" />
      <rect x="54" y="30" width="22" height="16" rx="2" className="fill-ocre" />
      <rect x="42" y="14" width="22" height="16" rx="2" className="fill-vert" />
      <path d="M14 48 H108 L96 68 H26 Z" className="fill-indigo" />
      <rect x="86" y="18" width="12" height="30" rx="2" className="fill-sable-fonce" />
      <path
        d="M6 74 q 12 -7 24 0 t 24 0 t 24 0 t 24 0 t 24 0"
        fill="none"
        className="stroke-vert"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M6 84 q 12 -7 24 0 t 24 0 t 24 0 t 24 0 t 24 0"
        fill="none"
        className="stroke-vert"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

/** Illustration « mise en service » : salle de classe équipée. */
export function IlluEcole({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="10" y="12" width="100" height="52" rx="5" className="fill-vert-voile" />
      <rect
        x="10"
        y="12"
        width="100"
        height="52"
        rx="5"
        fill="none"
        className="stroke-vert"
        strokeWidth="2.5"
      />
      {/* Trois postes alignés */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 30} 26)`}>
          <rect width="22" height="15" rx="2" className="fill-indigo" />
          <rect x="4" y="3" width="14" height="9" rx="1" className="fill-soleil" />
          <rect x="7" y="17" width="8" height="4" rx="1" className="fill-indigo" opacity="0.6" />
        </g>
      ))}
      {/* Élèves stylisés */}
      {[0, 1, 2].map((i) => (
        <g key={`el-${i}`} transform={`translate(${25 + i * 30} 54)`}>
          <circle cx="6" cy="4" r="4.5" className="fill-terre" />
          <path d="M0 16 q 6 -8 12 0 z" className="fill-terre" opacity="0.8" />
        </g>
      ))}
      <rect x="10" y="68" width="100" height="6" rx="3" className="fill-ocre" opacity="0.55" />
      <path d="M60 78 v 8" className="stroke-vert" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Motif décoratif d'angle, posé derrière certaines sections pour rompre
 * l'uniformité des aplats sans coûter la moindre requête.
 */
export function MotifAngle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("pointer-events-none absolute select-none", className)}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <circle
        cx="100"
        cy="100"
        r="64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle
        cx="100"
        cy="100"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.65"
      />
      <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/**
 * Forme courbe du héros de l'accueil.
 *
 * Reprend les trois couleurs du logo : un aplat marine qui porte le texte, une
 * grande courbe bleue qui accueille le sujet, et un liseré rouge qui souligne
 * la césure entre les deux. `slice` garantit que la scène remplit toujours la
 * bannière, quelle que soit sa hauteur.
 */
export function CourbeHeros({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 820"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="heros-marine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#24345f" />
          <stop offset="100%" stopColor="#141f3d" />
        </linearGradient>
        <linearGradient id="heros-bleu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35a9dd" />
          <stop offset="100%" stopColor="#0078c0" />
        </linearGradient>
      </defs>

      {/* Aplat de fond : c'est lui qui porte le texte, à gauche. */}
      <rect width="1440" height="820" fill="url(#heros-marine)" />

      {/* Cercles concentriques très discrets, pour éviter l'aplat plat. */}
      <g fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.07">
        <circle cx="210" cy="180" r="110" />
        <circle cx="210" cy="180" r="180" />
        <circle cx="210" cy="180" r="250" />
      </g>

      {/* Liseré rouge : même courbe, légèrement décalée vers la gauche. */}
      <path d="M1440 0 L700 0 C840 250, 520 520, 700 820 L1440 820 Z" fill="#e43c3c" />

      {/* Courbe bleue principale, par-dessus le liseré. */}
      <path
        d="M1440 0 L744 0 C884 250, 564 520, 744 820 L1440 820 Z"
        fill="url(#heros-bleu)"
      />

      {/* Reflet clair le long de la courbe, pour lui donner du volume. */}
      <path
        d="M744 0 C884 250, 564 520, 744 820"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.22"
      />
    </svg>
  );
}

/**
 * Un enfant, debout, de face. Dessiné à plat depuis le sol (`y = 0`) vers le
 * haut. Les manches recouvrent le haut des bras et les bras repassent sous
 * elles : la silhouette se lit d'un bloc, sans membre qui flotte.
 */
function EnfantSvg({
  x,
  echelle = 1,
  haut,
  peau,
}: {
  x: number;
  echelle?: number;
  haut: string;
  peau: string;
}) {
  const BAS = "#2b3a55";
  return (
    <g transform={`translate(${x} 0) scale(${echelle})`}>
      {/* Chaussures */}
      <rect x="-30" y="-13" width="26" height="13" rx="6" fill="#101a33" />
      <rect x="4" y="-13" width="26" height="13" rx="6" fill="#101a33" />
      {/* Jambes */}
      <rect x="-26" y="-98" width="20" height="88" rx="9" fill={BAS} />
      <rect x="6" y="-98" width="20" height="88" rx="9" fill={BAS} />
      {/* Bassin */}
      <rect x="-30" y="-108" width="60" height="26" rx="9" fill={BAS} />
      {/* Bras, glissés sous les manches */}
      <rect x="-41" y="-160" width="17" height="64" rx="8" fill={peau} />
      <rect x="24" y="-160" width="17" height="64" rx="8" fill={peau} />
      {/* Buste */}
      <rect x="-30" y="-198" width="60" height="100" rx="20" fill={haut} />
      {/* Manches courtes, par-dessus le haut des bras */}
      <rect x="-46" y="-194" width="22" height="44" rx="11" fill={haut} />
      <rect x="24" y="-194" width="22" height="44" rx="11" fill={haut} />
      {/* Cou */}
      <rect x="-9" y="-210" width="18" height="18" rx="6" fill={peau} />
      {/* Tête */}
      <circle cx="0" cy="-232" r="29" fill={peau} />
      {/* Cheveux */}
      <path d="M-29 -238 a29 29 0 0 1 58 0 q-29 -13 -58 0 z" fill="#241a12" />
    </g>
  );
}

/**
 * Groupe d'enfants, sujet par défaut du héros.
 *
 * Sert tant qu'aucune photographie détourée n'a été déposée dans
 * `public/heros/`. Volontairement à plat et sans visage dessiné : l'objectif
 * est d'évoquer, jamais de faire passer une illustration pour une photo.
 */
export function IlluEnfants({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-215 -292 430 296"
      /* `xMidYMax` colle le groupe au bas du cadre : les pieds viennent mourir
         sur le bord de la carte, sans bande vide en dessous. */
      preserveAspectRatio="xMidYMax meet"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <EnfantSvg x={-138} echelle={0.88} haut="#e43c3c" peau="#8a5a3b" />
      <EnfantSvg x={140} echelle={0.84} haut="#e8a33d" peau="#6f4629" />

      {/* Enfant du centre, au premier plan, un livre ouvert dans les mains. */}
      <EnfantSvg x={0} echelle={1} haut="#0090cc" peau="#a9714a" />
      <g transform="translate(0 -132)">
        <path d="M-44 -14 q22 -9 44 0 l0 30 q-22 -9 -44 0 z" fill="#f6efe6" />
        <path d="M44 -14 q-22 -9 -44 0 l0 30 q22 -9 44 0 z" fill="#ffffff" />
        <path d="M0 -14 v30" stroke="#182448" strokeWidth="2" opacity="0.45" />
      </g>
    </svg>
  );
}
