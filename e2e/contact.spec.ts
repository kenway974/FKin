import { expect, test } from "@playwright/test";

test.describe("formulaire de contact", () => {
  test("le paramètre ?profil pré-sélectionne le type d'émetteur", async ({ page }) => {
    await page.goto("/contact?profil=beneficiaire");
    await expect(page.getByRole("radio", { checked: true })).toHaveValue("beneficiaire");
  });

  test("un envoi vide affiche les erreurs sans quitter la page", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /envoyer/i }).click();

    await expect(page.getByText("Merci de préciser qui vous êtes.")).toBeVisible();
    await expect(page.getByText(/Merci d'indiquer votre nom/)).toBeVisible();
    await expect(page.getByLabel(/Nom et prénom/)).toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("les erreurs disparaissent une fois le champ corrigé", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /envoyer/i }).click();
    await expect(page.getByText(/Merci d'indiquer votre nom/)).toBeVisible();

    await page.getByLabel(/Nom et prénom/).fill("Awa Mbemba");
    await page.getByRole("button", { name: /envoyer/i }).click();

    await expect(page.getByText(/Merci d'indiquer votre nom/)).toBeHidden();
  });

  test("le champ piège est hors de portée des humains", async ({ page }) => {
    await page.goto("/contact");
    const piege = page.locator("#site-web");
    await expect(piege).toHaveAttribute("tabindex", "-1");
    await expect(piege).not.toBeInViewport();
  });
});
