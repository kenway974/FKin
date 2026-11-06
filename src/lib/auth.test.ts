import { beforeEach, describe, expect, it, vi } from "vitest";
import { creerFauxSupabase } from "../../tests/helpers/faux-supabase";

const { creerClientServeur, redirect } = vi.hoisted(() => ({
  creerClientServeur: vi.fn(),
  // Comme le vrai `redirect` de Next.js, interrompt l'exécution en levant.
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/supabase/server", () => ({ creerClientServeur }));
vi.mock("next/navigation", () => ({ redirect }));

import { exigerAdmin, recupererAdmin } from "./auth";

const utilisateur = { id: "u-1", email: "auth@example.org" };
const ligneAdmin = { user_id: "u-1", email: "admin@example.org", nom_affichage: "Admin" };

beforeEach(() => {
  creerClientServeur.mockReset();
  redirect.mockClear();
});

describe("recupererAdmin", () => {
  it("renvoie null si Supabase n'est pas configuré", async () => {
    creerClientServeur.mockResolvedValue(null);
    await expect(recupererAdmin()).resolves.toBeNull();
  });

  it("renvoie null sans session", async () => {
    const { client } = creerFauxSupabase({ utilisateur: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(recupererAdmin()).resolves.toBeNull();
    expect(client.from).not.toHaveBeenCalled();
  });

  it("refuse une session valide absente de la table admins", async () => {
    const { client, filtresAdmins } = creerFauxSupabase({ utilisateur, ligneAdmin: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(recupererAdmin()).resolves.toBeNull();
    expect(client.from).toHaveBeenCalledWith("admins");
    expect(filtresAdmins).toEqual([["user_id", "u-1"]]);
  });

  it("refuse en cas d'erreur de lecture de la table admins", async () => {
    const { client } = creerFauxSupabase({
      utilisateur,
      ligneAdmin,
      erreurAdmin: { message: "permission denied" },
    });
    creerClientServeur.mockResolvedValue(client);

    await expect(recupererAdmin()).resolves.toBeNull();
  });

  it("autorise une session présente dans la table admins", async () => {
    const { client } = creerFauxSupabase({ utilisateur, ligneAdmin });
    creerClientServeur.mockResolvedValue(client);

    await expect(recupererAdmin()).resolves.toEqual({
      id: "u-1",
      email: "admin@example.org",
      nomAffichage: "Admin",
    });
  });

  it("se rabat sur l'e-mail du compte si la ligne admins n'en a pas", async () => {
    const { client } = creerFauxSupabase({
      utilisateur,
      ligneAdmin: { user_id: "u-1", email: null, nom_affichage: null },
    });
    creerClientServeur.mockResolvedValue(client);

    await expect(recupererAdmin()).resolves.toEqual({
      id: "u-1",
      email: "auth@example.org",
      nomAffichage: null,
    });
  });
});

describe("exigerAdmin", () => {
  it("redirige vers /connexion sans session", async () => {
    const { client } = creerFauxSupabase({ utilisateur: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(exigerAdmin()).rejects.toThrow("NEXT_REDIRECT:/connexion?suite=%2Fadmin");
    expect(redirect).toHaveBeenCalledWith("/connexion?suite=%2Fadmin");
  });

  it("redirige un utilisateur authentifié mais non admin, en conservant la page demandée", async () => {
    const { client } = creerFauxSupabase({ utilisateur, ligneAdmin: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(exigerAdmin("/admin/messages")).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/connexion?suite=%2Fadmin%2Fmessages");
  });

  it("renvoie l'administrateur sans rediriger", async () => {
    const { client } = creerFauxSupabase({ utilisateur, ligneAdmin });
    creerClientServeur.mockResolvedValue(client);

    await expect(exigerAdmin()).resolves.toMatchObject({ id: "u-1" });
    expect(redirect).not.toHaveBeenCalled();
  });
});
