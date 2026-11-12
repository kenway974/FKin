import { defineConfig, devices } from "@playwright/test";

/**
 * Tests de bout en bout, exécutés contre le build de production
 * (`next start`), c'est-à-dire ce que Vercel sert réellement.
 *
 * - En CI, le build est produit par une étape précédente : on se contente de
 *   démarrer le serveur.
 * - En local, `npm run test:e2e` construit puis démarre le site, ou réutilise
 *   un serveur déjà lancé sur le port 3000.
 *
 * Les tests ne supposent aucune base Supabase : ils vérifient le site dans
 * l'état « non branché », qui doit rester consultable sans erreur.
 */
const PORT = Number(process.env.PORT ?? 3000);
const estCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: estCI,
  retries: estCI ? 1 : 0,
  workers: estCI ? 2 : undefined,
  reporter: estCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "ordinateur", use: { ...devices["Desktop Chrome"] } },
    // Les structures bénéficiaires consultent surtout depuis un smartphone.
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: estCI ? `npm run start -- -p ${PORT}` : `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !estCI,
    timeout: 300_000,
  },
});
