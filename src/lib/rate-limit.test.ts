import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleDepuisEntetes, verifierLimite } from "@/lib/rate-limit";

describe("verifierLimite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autorise jusqu'au maximum puis bloque", () => {
    const cle = "test:blocage";
    for (let i = 0; i < 3; i++) {
      expect(verifierLimite(cle, 3, 60_000)).toMatchObject({ autorise: true, restant: 2 - i });
    }
    expect(verifierLimite(cle, 3, 60_000)).toEqual({
      autorise: false,
      restant: 0,
      attenteSecondes: 60,
    });
  });

  it("indique le temps d'attente restant", () => {
    const cle = "test:attente";
    verifierLimite(cle, 1, 60_000);
    vi.advanceTimersByTime(45_000);
    expect(verifierLimite(cle, 1, 60_000).attenteSecondes).toBe(15);
  });

  it("rouvre la fenêtre une fois expirée", () => {
    const cle = "test:expiration";
    verifierLimite(cle, 1, 60_000);
    expect(verifierLimite(cle, 1, 60_000).autorise).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(verifierLimite(cle, 1, 60_000)).toMatchObject({ autorise: true, restant: 0 });
  });

  it("compte chaque clé séparément", () => {
    verifierLimite("test:a", 1, 60_000);
    expect(verifierLimite("test:a", 1, 60_000).autorise).toBe(false);
    expect(verifierLimite("test:b", 1, 60_000).autorise).toBe(true);
  });
});

describe("cleDepuisEntetes", () => {
  it("prend la première IP de x-forwarded-for", () => {
    const entetes = new Headers({ "x-forwarded-for": " 203.0.113.7 , 10.0.0.1" });
    expect(cleDepuisEntetes(entetes)).toBe("203.0.113.7");
  });

  it("se rabat sur x-real-ip", () => {
    expect(cleDepuisEntetes(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
  });

  it("renvoie « inconnu » sans en-tête exploitable", () => {
    expect(cleDepuisEntetes(new Headers())).toBe("inconnu");
    expect(cleDepuisEntetes(new Headers({ "x-forwarded-for": " , " }))).toBe("inconnu");
  });
});
