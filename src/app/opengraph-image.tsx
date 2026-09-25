import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { pictogrammeDataUri } from "@/lib/marque-og";

/**
 * Image Open Graph par défaut, générée à la volée.
 *
 * Reste automatiquement cohérente avec le nom de la structure défini dans
 * `lib/site.ts`. Le pictogramme de la marque y est embarqué en data-URI
 * (`lib/marque-og.ts`) : Satori n'a pas accès au système de fichiers une fois
 * déployé, il faut donc lui fournir l'image encodée.
 */
export const alt = `${site.nom} — dons de matériel, en France et au Congo`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f8fbfe",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <img src={pictogrammeDataUri} width={87} height={64} alt="" />
        <div style={{ fontSize: 34, fontWeight: 700, color: "#1a2c50" }}>{site.nom}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 62, fontWeight: 700, color: "#1a2c50", lineHeight: 1.15 }}>
          Le matériel dont vous n&apos;avez plus l&apos;usage devient une salle de classe équipée.
        </div>
        <div style={{ fontSize: 30, color: "#4f5b74" }}>
          Collecte partout en France · Distribution en France et au Congo
        </div>
      </div>

      <div style={{ display: "flex", height: 12, width: "100%" }}>
        <div style={{ flex: 2, backgroundColor: "#1a2c50" }} />
        <div style={{ flex: 1, backgroundColor: "#0495d4" }} />
        <div style={{ flex: 1, backgroundColor: "#ef433f" }} />
      </div>
    </div>,
    size,
  );
}
