"use client";

/**
 * Filet de sécurité de dernier recours : ne se déclenche que si le layout
 * racine lui-même échoue. Il doit donc fournir ses propres balises `<html>` et
 * `<body>`, et ne peut compter sur aucun style de l'application.
 */
export default function ErreurGlobale({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#f8fbfe",
          color: "#16233f",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
            Le site rencontre un problème
          </h1>
          <p style={{ color: "#4f5b74", marginBottom: "1.5rem" }}>
            Merci de réessayer dans quelques instants.
            {error.digest ? ` Référence : ${error.digest}` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              backgroundColor: "#d72e2b",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
