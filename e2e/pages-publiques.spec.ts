import { expect, test } from "@playwright/test";

/** Pages publiques fixes, avec un extrait attendu de leur titre principal. */
const pages = [
  { chemin: "/", h1: /salle de classe équipée/ },
  { chemin: "/services", h1: /Deux métiers/ },
  { chemin: "/realisations", h1: /Ce que le matériel est devenu/ },
  { chemin: "/comment-ca-marche", h1: /Le parcours complet d'un don/ },
  { chemin: "/actualites", h1: /Nouvelles des convois/ },
  { chemin: "/contact", h1: /Écrivez-nous/ },
];

for (const { chemin, h1 } of pages) {
  test(`${chemin} s'affiche sans erreur`, async ({ page }) => {
    const erreurs: string[] = [];
    page.on("pageerror", (erreur) => erreurs.push(erreur.message));
    page.on("console", (message) => {
      if (message.type() === "error") erreurs.push(message.text());
    });

    const reponse = await page.goto(chemin);
    expect(reponse?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(h1);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("main#contenu-principal")).toBeVisible();

    expect(erreurs).toEqual([]);
  });
}

test("la navigation principale mène aux pages", async ({ page, isMobile }) => {
  await page.goto("/");

  if (isMobile) {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  }
  const nav = page.getByRole("navigation", {
    name: isMobile ? "Navigation principale (mobile)" : "Navigation principale",
    exact: true,
  });
  await nav.getByRole("link", { name: "Comment ça marche" }).click();

  await expect(page).toHaveURL(/\/comment-ca-marche$/);
  await expect(page.locator("h1")).toHaveText(/Le parcours complet/);
});

test("le lien d'évitement est le premier élément focalisable", async ({ page, isMobile }) => {
  test.skip(isMobile, "Navigation au clavier : ordinateur uniquement.");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Aller au contenu principal" })).toBeFocused();
});

test("une page inconnue renvoie une 404 utile", async ({ page }) => {
  const reponse = await page.goto("/cette-page-n-existe-pas");
  expect(reponse?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText(/Cette page n'existe pas/);
  await expect(page.getByRole("navigation", { name: "Navigation de secours" })).toBeVisible();
});

test("un article inconnu renvoie une 404", async ({ page }) => {
  const reponse = await page.goto("/actualites/article-inexistant");
  expect(reponse?.status()).toBe(404);
});
