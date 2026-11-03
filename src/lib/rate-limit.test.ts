import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleDepuisEntetes, verifierLimite } from "./rate-limit";

const UNE_HEURE = 60 * 60 * 1000;

describe("verifierLimite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autorise 5 appels puis refuse le 6e", () => {
    const cle = "ip-cinq-appels";
    const restants = Array.from({ length: 5 }, () => verifierLimite(cle));

    expect(restants.map((r) => r.autorise)).toEqual([true, true, true, true, true]);
    expect(restants.map((r) => r.restant)).toEqual([4, 3, 2, 1, 0]);

    const refus = verifierLimite(cle);
    expect(refus).toEqual({ autorise: false, restant: 0, attenteSecondes: 3600 });
  });

  it("indique le temps d'attente restant", () => {
    const cle = "ip-attente";
    for (let i = 0; i < 5; i++) verifierLimite(cle);

    vi.advanceTimersByTime(20 * 60 * 1000);
    expect(verifierLimite(cle).attenteSecondes).toBe(40 * 60);
  });

  it("réautorise après expiration de la fenêtre", () => {
    const cle = "ip-fenetre";
    for (let i = 0; i < 5; i++) verifierLimite(cle);
    expect(verifierLimite(cle).autorise).toBe(false);

    vi.advanceTimersByTime(UNE_HEURE - 1);
    expect(verifierLimite(cle).autorise).toBe(false);

    vi.advanceTimersByTime(1);
    const apres = verifierLimite(cle);
    expect(apres).toEqual({ autorise: true, restant: 4, attenteSecondes: 0 });
  });

  it("respecte une limite et une fenêtre personnalisées", () => {
    const cle = "ip-personnalisee";
    expect(verifierLimite(cle, 2, 1000).autorise).toBe(true);
    expect(verifierLimite(cle, 2, 1000).autorise).toBe(true);
    expect(verifierLimite(cle, 2, 1000)).toEqual({
      autorise: false,
      restant: 0,
      attenteSecondes: 1,
    });

    vi.advanceTimersByTime(1000);
    expect(verifierLimite(cle, 2, 1000).autorise).toBe(true);
  });

  it("compte chaque clé indépendamment", () => {
    for (let i = 0; i < 5; i++) verifierLimite("ip-a");
    expect(verifierLimite("ip-a").autorise).toBe(false);

    expect(verifierLimite("ip-b")).toEqual({ autorise: true, restant: 4, attenteSecondes: 0 });
    expect(verifierLimite("ip-a").autorise).toBe(false);
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
