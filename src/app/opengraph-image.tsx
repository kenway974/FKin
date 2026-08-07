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
export const alt = `${site.nom} — dons de matériel entre la France et le Congo`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
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
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img src={pictogrammeDataUri} width={66} height={64} alt="" />
          <div style={{ fontSize: 34, fontWeight: 700, color: "#16263c" }}>{site.nom}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 62, fontWeight: 700, color: "#16263c", lineHeight: 1.15 }}>
            Le matériel dont vous n&apos;avez plus l&apos;usage devient une salle de classe équipée.
          </div>
          <div style={{ fontSize: 30, color: "#5a6b7a" }}>
            Collecte partout en France · Distribution au Congo
          </div>
        </div>

        <div style={{ display: "flex", height: 12, width: "100%" }}>
          <div style={{ flex: 2, backgroundColor: "#16263c" }} />
          <div style={{ flex: 1, backgroundColor: "#4e8a2e" }} />
          <div style={{ flex: 1, backgroundColor: "#7cae4f" }} />
        </div>
      </div>
    ),
    size,
  );
}
