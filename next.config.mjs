/**
 * Configuration Next.js.
 *
 * Deux responsabilités ici :
 *  1. autoriser `next/image` à optimiser les visuels servis par Supabase Storage ;
 *  2. poser les en-têtes de sécurité HTTP (dont la CSP) sur toutes les réponses.
 *
 * L'hôte Supabase n'est pas connu à l'avance : il est déduit de
 * NEXT_PUBLIC_SUPABASE_URL au moment du build. Tant que la variable n'est pas
 * renseignée, le site compile quand même — il tourne simplement sans données.
 */

/** Extrait le nom d'hôte d'une URL, ou `null` si l'URL est absente/invalide. */
function hostnameDepuisUrl(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const hoteSupabase = hostnameDepuisUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Origines externes que la page doit pouvoir contacter (API Supabase + Storage).
const originesSupabase = hoteSupabase ? [`https://${hoteSupabase}`, `wss://${hoteSupabase}`] : [];

/**
 * Politique de sécurité du contenu.
 *
 * Compromis assumé : `'unsafe-inline'` est conservé pour les styles, car Next.js
 * injecte des styles inline (notamment pour `next/image`). Les scripts inline
 * sont également autorisés car le JSON-LD et le bootstrap de Next en dépendent ;
 * passer à une CSP à nonce imposerait de rendre chaque page dynamique, ce qui
 * pénaliserait les connexions lentes visées par ce projet. Ce choix est
 * documenté dans le README.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${originesSupabase.join(" ")}`.trim(),
  "media-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // N'annonce pas la techno utilisée dans les en-têtes de réponse.
  poweredByHeader: false,
  images: {
    // Formats modernes : nettement plus légers sur connexion lente.
    formats: ["image/avif", "image/webp"],
    remotePatterns: hoteSupabase
      ? [{ protocol: "https", hostname: hoteSupabase, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
