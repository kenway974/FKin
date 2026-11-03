/**
 * Destination après connexion au back-office.
 *
 * Le paramètre `?suite=` conserve la page demandée avant la redirection vers
 * `/connexion`. Une destination doit rester interne au site : on refuse toute
 * URL absolue (`https://…`) et toute URL relative au protocole (`//…`) pour
 * empêcher une redirection ouverte. À défaut, retour au tableau de bord.
 */
export function destinationApresConnexion(suite: string | null): string {
  return suite && suite.startsWith("/") && !suite.startsWith("//") ? suite : "/admin";
}
