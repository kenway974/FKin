# CLAUDE.md

Site vitrine, blog et back-office de Respusse (Next.js 15 App Router, React 19,
TypeScript strict, Tailwind v4, Supabase, Resend, zod). Détails dans `README.md`,
cahier des charges dans `cahier-des-charges.md`.

## Méthode de travail : skills superpowers

Les skills superpowers sont installés sur le compte (claude.ai → Settings → Skills).
Utilise-les systématiquement, sans attendre qu'on te le demande :

- **Nouvelle feature ou changement de comportement** → `brainstorming` d'abord
  (reformuler le besoin, faire valider le design), puis `writing-plans` si la
  tâche dépasse quelques fichiers, puis `executing-plans`.
- **Bug, test qui échoue, build cassé** → `systematic-debugging` : cause racine
  avant tout correctif.
- **Code de logique (utilitaires, validation, actions serveur)** →
  `test-driven-development` : test d'abord, vu échouer, puis le code.
- **Retours de review** → `receiving-code-review` : vérifier chaque remarque
  contre le code avant de l'appliquer.
- **Avant de dire « c'est fini / corrigé / ça marche »** →
  `verification-before-completion` : lancer les commandes ci-dessous et citer
  leur résultat.

## Commandes

```bash
npm test            # tests Vitest (une passe)
npm run test:watch  # tests en continu
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # build Next.js de production
```

Une tâche n'est terminée que si `npm test`, `npm run typecheck` et
`npm run lint` passent.

## Conventions

- Code, noms et commentaires en **français**, comme le reste du dépôt.
- Dépendances épinglées à une **version exacte** (`npm install --save-exact`).
- Tests à côté du fichier testé : `src/lib/utils.ts` → `src/lib/utils.test.ts`.
- Import via l'alias `@/` (→ `src/`).
