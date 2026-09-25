import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Même alias que tsconfig.json : `@/lib/utils` → `src/lib/utils`.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // Logique pure (utilitaires, schémas zod) : pas besoin d'un DOM simulé.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
