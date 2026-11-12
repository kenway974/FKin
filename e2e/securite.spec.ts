import { expect, test } from "@playwright/test";

test.describe("sécurité et accès", () => {
  test("les en-têtes de sécurité sont posés", async ({ request }) => {
    const reponse = await request.get("/");
    const entetes = reponse.headers();

    expect(entetes["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(entetes["content-security-policy"]).toContain("object-src 'none'");
    expect(entetes["x-frame-options"]).toBe("DENY");
    expect(entetes["x-content-type-options"]).toBe("nosniff");
    expect(entetes["strict-transport-security"]).toContain("max-age=");
    expect(entetes["x-powered-by"]).toBeUndefined();
  });

  test("le back-office redirige un visiteur non connecté vers la connexion", async ({ page }) => {
    await page.goto("/admin/articles");
    await expect(page).toHaveURL(/\/connexion\?suite=%2Fadmin%2Farticles$/);
  });

  test("robots.txt exclut le back-office", async ({ request }) => {
    const reponse = await request.get("/robots.txt");
    expect(reponse.status()).toBe(200);
    const contenu = await reponse.text();
    expect(contenu).toContain("Disallow: /admin");
    expect(contenu).toContain("Disallow: /connexion");
  });

  test("sitemap.xml répond et ne liste pas le back-office", async ({ request }) => {
    const reponse = await request.get("/sitemap.xml");
    expect(reponse.status()).toBe(200);
    const contenu = await reponse.text();
    expect(contenu).toContain("<urlset");
    expect(contenu).not.toContain("/admin");
  });
});
