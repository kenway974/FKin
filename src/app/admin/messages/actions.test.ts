import { beforeEach, describe, expect, it, vi } from "vitest";
import { creerFauxSupabase } from "../../../../tests/helpers/faux-supabase";

const { creerClientServeur, revalidatePath } = vi.hoisted(() => ({
  creerClientServeur: vi.fn(),
  revalidatePath: vi.fn(),
}));

// Seul le client Supabase est simulé : `accesAdmin` (lib/actions-serveur.ts)
// et `recupererAdmin` (lib/auth.ts) sont les vrais, pour vérifier la chaîne
// complète action → contrôle d'accès.
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
  it("refuse un appelant sans session, sans rien lire ni supprimer", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(supprimerMessage("m-1")).resolves.toEqual(refus);
    expect(client.from).not.toHaveBeenCalledWith("messages");
    expect(ecritures.delete).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("refuse un utilisateur authentifié mais non admin, sans rien lire ni supprimer", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur, ligneAdmin: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(supprimerMessage("m-1")).resolves.toEqual(refus);
    expect(client.from).not.toHaveBeenCalledWith("messages");
    expect(ecritures.delete).not.toHaveBeenCalled();
  });

  it("supprime le message pour un administrateur", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur, ligneAdmin });
    creerClientServeur.mockResolvedValue(client);

    await expect(supprimerMessage("m-1")).resolves.toMatchObject({ statut: "succes" });
    expect(ecritures.delete).toHaveBeenCalledWith("messages");
    expect(ecritures.stockageRemove).not.toHaveBeenCalled();
  });

  it("supprime aussi les photos jointes du bucket privé", async () => {
    const { client, ecritures } = creerFauxSupabase({
      utilisateur,
      ligneAdmin,
      ligneLue: { photos: ["m-1/a.jpg", "m-1/b.jpg"] },
    });
    creerClientServeur.mockResolvedValue(client);

    await expect(supprimerMessage("m-1")).resolves.toMatchObject({ statut: "succes" });
    expect(ecritures.stockageRemove).toHaveBeenCalledWith("photos-dons", [
      "m-1/a.jpg",
      "m-1/b.jpg",
    ]);
  });
});

describe("marquerCommeLu", () => {
  it("refuse un utilisateur non admin, sans rien modifier", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur, ligneAdmin: null });
    creerClientServeur.mockResolvedValue(client);

    await expect(marquerCommeLu("m-1", true)).resolves.toEqual(refus);
    expect(ecritures.update).not.toHaveBeenCalled();
  });

  it("met à jour le seul champ « lu » pour un administrateur", async () => {
    const { client, ecritures } = creerFauxSupabase({ utilisateur, ligneAdmin });
    creerClientServeur.mockResolvedValue(client);

    await expect(marquerCommeLu("m-1", true)).resolves.toMatchObject({ statut: "succes" });
    expect(ecritures.update).toHaveBeenCalledWith("messages", { lu: true });
  });
});
