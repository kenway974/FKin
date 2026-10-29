import { describe, expect, it } from "vitest";
import { estTableAbsente } from "@/lib/erreurs-base";

describe("estTableAbsente", () => {
  it("reconnaît une table pas encore créée (Postgres ou API Supabase)", () => {
    expect(
      estTableAbsente({ code: "42P01", message: 'relation "public.faq" does not exist' }),
    ).toBe(true);
    expect(estTableAbsente({ code: "PGRST205", message: "Could not find the table" })).toBe(true);
  });

  it("ne confond pas une autre erreur avec une table absente", () => {
    expect(estTableAbsente({ code: "42501", message: "permission denied" })).toBe(false);
    expect(estTableAbsente(new Error("fetch failed"))).toBe(false);
    expect(estTableAbsente(null)).toBe(false);
  });
});
