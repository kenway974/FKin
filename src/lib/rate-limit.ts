/**
 * Limitation de débit minimaliste, en mémoire.
 *
 * Limite volontairement simple, conforme à la consigne « rate-limit basique » :
 * une `Map` en mémoire de processus, sans dépendance externe ni service payant.
 *
 * Limite connue : sur Vercel, chaque instance serverless a sa propre mémoire et
 * les instances sont recyclées. Le compteur n'est donc pas partagé — c'est un
 * ralentisseur contre les envois répétés, pas un rempart absolu. Combiné au
 * honeypot et au piège temporel, cela suffit largement au volume attendu.
 * Pour durcir : brancher Upstash Ratelimit (Redis) sans changer cette interface.
 */

type Fenetre = { compte: number; expireA: number };

const compteurs = new Map<string, Fenetre>();

/** Purge les fenêtres expirées pour éviter que la Map ne grossisse sans fin. */
function purger(maintenant: number) {
  for (const [cle, fenetre] of compteurs) {
    if (fenetre.expireA <= maintenant) compteurs.delete(cle);
  }
}

export type ResultatLimite = {
  autorise: boolean;
  /** Nombre de tentatives restantes dans la fenêtre courante. */
  restant: number;
  /** Secondes à attendre avant de pouvoir réessayer (0 si autorisé). */
  attenteSecondes: number;
};

/**
 * @param cle          identifiant du demandeur (IP hachée, e-mail, …)
 * @param maxTentatives nombre d'appels autorisés par fenêtre
 * @param fenetreMs    durée de la fenêtre glissante, en millisecondes
 */
export function verifierLimite(
  cle: string,
  maxTentatives = 5,
  fenetreMs = 60 * 60 * 1000,
): ResultatLimite {
  const maintenant = Date.now();
  purger(maintenant);

  const existante = compteurs.get(cle);

  if (!existante || existante.expireA <= maintenant) {
    compteurs.set(cle, { compte: 1, expireA: maintenant + fenetreMs });
    return { autorise: true, restant: maxTentatives - 1, attenteSecondes: 0 };
  }

  if (existante.compte >= maxTentatives) {
    return {
      autorise: false,
      restant: 0,
      attenteSecondes: Math.ceil((existante.expireA - maintenant) / 1000),
    };
  }

  existante.compte += 1;
  return {
    autorise: true,
    restant: maxTentatives - existante.compte,
    attenteSecondes: 0,
  };
}

/**
 * Déduit une clé d'identification à partir des en-têtes de la requête.
 * On ne conserve jamais l'IP en base : elle sert uniquement de clé volatile.
 */
export function cleDepuisEntetes(entetes: Headers): string {
  const transmise = entetes.get("x-forwarded-for");
  if (transmise) {
    const premiere = transmise.split(",")[0]?.trim();
    if (premiere) return premiere;
  }
  return entetes.get("x-real-ip") ?? "inconnu";
}
