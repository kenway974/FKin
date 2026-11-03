import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Configuration des tests unitaires.
 *
 * - `@/` pointe vers `src/`, comme dans `tsconfig.json`.
 * - `server-only` est remplacé par un module vide : hors du bundler de
 *   Next.js, le vrai paquet lève une erreur à l'import, ce qui empêcherait de
 *   tester les modules serveur (`lib/auth.ts`, Server Actions…).
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    restoreMocks: true,
  },
});
