/** Destination par défaut après connexion : le tableau de bord. */
const DESTINATION_PAR_DEFAUT = "/admin";

/** Origine fictive, servant uniquement à résoudre un chemin relatif. */
const ORIGINE_INTERNE = "http://interne.invalid";

/**
 * Vrai si la chaîne contient un caractère que les navigateurs réinterprètent
 * en résolvant une URL : la barre oblique inverse (`\` devient `/`, donc
 * `/\evil.com` équivaut à `//evil.com`), les caractères de contrôle et les
 * espaces (tabulations et retours à la ligne sont supprimés, donc
 * `/<TAB>/evil.com` équivaut aussi à `//evil.com`).
 */
function contientCaractereAmbigu(chemin: string): boolean {
  for (const caractere of chemin) {
    const code = caractere.codePointAt(0) ?? 0;
    if (caractere === "\\" || code <= 0x20 || code === 0x7f || /\s/u.test(caractere)) {
      return true;
    }
  }
  return false;
}

/**
 * Destination après connexion au back-office.
 *
 * Le paramètre `?suite=` conserve la page demandée avant la redirection vers
 * `/connexion`. Une destination doit rester interne au site, pour empêcher
 * une redirection ouverte. Sont refusées :
 *  - toute URL absolue (`https://…`, `javascript:…`) ;
 *  - toute URL relative au protocole (`//…`) ;
 *  - toute chaîne qu'un navigateur normaliserait en l'une des précédentes
 *    (`/\evil.com`, `/<TAB>/evil.com`…).
 *
 * En dernier recours, le chemin est résolu contre une origine fictive : s'il
 * en sort, ou s'il se normalise en « //… » (`/..//evil.com`), il est refusé.
 * La chaîne renvoyée est toujours celle reçue, jamais une version normalisée.
 * À défaut, retour au tableau de bord.
 */
export function destinationApresConnexion(suite: string | null): string {
  if (!suite || !suite.startsWith("/") || suite.startsWith("//")) {
    return DESTINATION_PAR_DEFAUT;
  }

  if (contientCaractereAmbigu(suite)) return DESTINATION_PAR_DEFAUT;

  try {
    const resolue = new URL(suite, ORIGINE_INTERNE);
    // Même sur la bonne origine, un chemin qui se normalise en « //… »
    // (« /..//evil.com ») redeviendrait une URL externe s'il était réutilisé.
    if (resolue.origin !== ORIGINE_INTERNE || resolue.pathname.startsWith("//")) {
      return DESTINATION_PAR_DEFAUT;
    }
  } catch {
    return DESTINATION_PAR_DEFAUT;
  }

  return suite;
}
