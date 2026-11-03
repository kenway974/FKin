import { beforeEach, describe, expect, it, vi } from "vitest";
import { creerFauxSupabase } from "../../../../tests/helpers/faux-supabase";

const { creerClientServeur, revalidatePath } = vi.hoisted(() => ({
  creerClientServeur: vi.fn(),
  revalidatePath: vi.fn(),
}));

// Seul le client Supabase est simulé : `recupererAdmin` (lib/auth.ts) est le
// vrai, pour vérifier la chaîne complète action → contrôle d'accès.
vi.mock("@/lib/supabase/server", () => ({ creerClientServeur }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { marquerCommeLu, supprimerMessage } from "./actions";

const utilisateur = { id: "u-1", email: "user@example.org" };
const ligneAdmin = { user_id: "u-1", email: "admin@example.org", nom_affichage: null };
const refus = { statut: "erreur", message: "Session expirée. Reconnectez-vous." };

beforeEach(() => {
  creerClientServeur.mockReset();
  revalidatePath.mockClear();
});

describe("supprimerMessage", () => {
  it("refuse un appelant sans session, sans rien supprimer", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(supprimerMessage("m-1")).resolves.toEqual(refus);
    expect(ecritures.delete).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("refuse un utilisateur authentifié mais non admin, sans rien supprimer", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur, ligneAdmin: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(supprimerMessage("m-1")).resolves.toEqual(refus);
    expect(client.from).not.toHaveBeenCalledWith("messages");
    expect(ecritures.delete).not.toHaveBeenCalled();
  });

  it("supprime le message pour un administrateur", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur, ligneAdmin });
    creerClientServeur.mockResolvedValue(client);

    await expect(supprimerMessage("m-1")).resolves.toEqual({
      statut: "succes",
      message: "Message supprimé.",
    });
    expect(ecritures.delete).toHaveBeenCalledWith("messages");
  });
});

describe("marquerCommeLu", () => {
  it("refuse un utilisateur non admin, sans rien modifier", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur, ligneAdmin: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(marquerCommeLu("m-1", true)).resolves.toEqual(refus);
    expect(ecritures.update).not.toHaveBeenCalled();
  });
});
