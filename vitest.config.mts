import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Même alias que tsconfig.json : `@/lib/utils` → `src/lib/utils`.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Hors du bundler de Next.js, le vrai paquet `server-only` lève une
      // erreur à l'import : on le remplace par un module vide pour pouvoir
      // tester les modules serveur (`lib/auth.ts`, Server Actions…).
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    // Logique pure (utilitaires, schémas zod) : pas besoin d'un DOM simulé.
    environment: "node",
    include: ["src/**/*.test.ts"],
    restoreMocks: true,
  },
});
