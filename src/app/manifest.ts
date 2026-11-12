import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Manifeste web (/manifest.webmanifest) : nom, couleurs et icônes utilisés
 * lorsqu'un visiteur ajoute le site à l'écran d'accueil de son téléphone.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nomLong,
    short_name: site.nom,
    description: site.description,
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f8fbfe",
    icons: [
      { src: "/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
