import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Image Open Graph par défaut, générée à la volée.
 *
 * Évite d'embarquer un PNG de plusieurs centaines de kilo-octets dans le dépôt,
 * et reste automatiquement cohérente avec le nom de la structure défini dans
 * `lib/site.ts`.
 */
export const alt = `${site.nom} — dons de matériel entre l'Île-de-France et le Congo`;
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
        backgroundColor: "#fdfaf6",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            backgroundColor: "#9c4a1f",
            display: "flex",
          }}
        />
        <div style={{ fontSize: 34, fontWeight: 700, color: "#2b211a" }}>{site.nom}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 62, fontWeight: 700, color: "#2b211a", lineHeight: 1.15 }}>
          Le matériel dont vous n&apos;avez plus l&apos;usage devient une salle de classe équipée.
        </div>
        <div style={{ fontSize: 30, color: "#6b5a4c" }}>
          Collecte en Île-de-France · Distribution au Congo
        </div>
      </div>

      <div style={{ display: "flex", height: 12, width: "100%" }}>
        <div style={{ flex: 2, backgroundColor: "#9c4a1f" }} />
        <div style={{ flex: 1, backgroundColor: "#c97b1e" }} />
        <div style={{ flex: 1, backgroundColor: "#2f6b4f" }} />
      </div>
    </div>,
    size,
  );
}
