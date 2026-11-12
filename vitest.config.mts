import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Tests unitaires : logique pure de `src/` (utilitaires, validation,
 * limitation de débit). Les tests de bout en bout vivent dans `e2e/` et sont
 * exécutés par Playwright, pas par Vitest.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    // Les dates sont formatées en français : on fixe le fuseau pour que les
    // résultats ne dépendent pas de la machine (poste local ou CI).
    env: { TZ: "Europe/Paris" },
  },
});
