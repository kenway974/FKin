# Cahier des charges — Site « Respusse » (France ↔ Congo)

Document de référence du projet, conservé dans le dépôt pour que toute personne
reprenant le code comprenne les intentions initiales.

---

## 1. Contexte

La structure collecte du matériel (informatique, électrique, scolaire) auprès
d'entreprises d'Île-de-France, puis l'achemine vers des écoles, mairies et
associations au Congo — notamment à Kinshasa — où il sert à l'enseignement.

Le site doit **prouver que la démarche est réelle et aboutie** afin de
convaincre les entreprises de donner, et présenter clairement les services
proposés aux structures bénéficiaires.

## 2. Double audience

| Audience                                   | Attentes                                                                                          | Contraintes techniques                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Entreprises donatrices** (Île-de-France) | Preuve de sérieux, transparence, sécurité des données, impact concret, pièces exploitables en RSE | Consultation majoritairement sur ordinateur de bureau |
| **Structures bénéficiaires** (Congo)       | Comprendre les services et la marche à suivre pour en bénéficier                                  | Smartphone, connexion lente et coûteuse               |

La contrainte « connexion lente » prime sur les effets visuels : elle a guidé
les choix de police, de JavaScript et de stratégie de cache.

## 3. Périmètre fonctionnel

### Pages publiques

1. **Accueil** — mission, fonctionnement en trois temps (collecte IDF → envoi →
   utilisation au Congo), appels à l'action vers le contact.
2. **Nos services** — deux blocs distincts : entreprises / bénéficiaires.
3. **Galerie / Réalisations** — projets passés, alimentés par la base : photo,
   lieu, type de matériel, résultat obtenu.
4. **Comment ça marche** — le parcours d'un don, de la collecte à l'usage.
5. **Blog / Actualités** — liste et page article, alimentés par la base.
6. **Contact** — formulaire avec choix « entreprise donatrice / structure
   bénéficiaire », protection anti-spam, enregistrement en base **et**
   notification par e-mail.

### Back-office

- Authentification via Supabase Auth. Un seul compte au démarrage, mais le
  modèle doit permettre d'en ajouter sans refonte.
- Articles : création, modification, suppression, statut brouillon/publié.
- Projets : idem, avec téléversement d'image vers Supabase Storage.
- Messages : liste et lecture, avec le type d'émetteur.
- Routes protégées par middleware, redirection si non authentifié.

## 4. Stack imposée

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + primitives shadcn/ui
- Supabase (Postgres, Auth, Storage) — **code uniquement**, aucune infra créée
- Resend pour l'e-mail transactionnel
- react-hook-form + zod pour la validation
- Hébergement cible : Vercel
- Versions majeures épinglées, pas de canary

## 5. Direction artistique

Esthétique ONG / humanitaire : chaleureuse, sobre, crédible. Palette terre et
solidarité (tons chauds, accent vert ou ocre), typographie lisible, place
importante donnée aux photographies. Aucun registre larmoyant.

Mobile-first, images optimisées et différées, JavaScript réduit au strict
nécessaire, bon score Lighthouse.

## 6. Exigences transverses

- **Langue** : français uniquement.
- **SEO** : metadata par page, sitemap.xml, robots.txt, Open Graph, JSON-LD.
- **Sécurité** : en-têtes HTTP et CSP, hygiène des variables d'environnement,
  protection des routes d'administration, anti-spam sur le formulaire.
- **Accessibilité** : HTML sémantique, contrastes conformes, ARIA lorsque le
  HTML natif ne suffit pas.
- **Documentation** : README complet en français, `.env.example` commenté
  variable par variable, guide du back-office.

## 7. Limites explicites du périmètre

La mission s'arrête au code, à la configuration des variables d'environnement
et à la documentation de branchement. Aucune action n'est menée sur un service
distant : pas de projet Supabase créé, pas de migration appliquée, pas de compte
Resend ni de déploiement Vercel. Le schéma et le seed SQL sont livrés sous forme
de fichiers, à exécuter par le propriétaire du site.
