# Dons solidaires — Île-de-France ↔ Congo

Site vitrine, blog et back-office d'une structure qui collecte du matériel
(informatique, électrique, scolaire) auprès d'entreprises d'Île-de-France et
l'achemine vers des écoles, mairies et associations au Congo.

Le site poursuit deux objectifs :

- **convaincre les entreprises franciliennes de donner**, en prouvant que la
  démarche va jusqu'au bout (traçabilité, sécurité des données, comptes rendus
  d'usage) ;
- **présenter les services aux structures bénéficiaires**, souvent consultés
  depuis un smartphone sur une connexion lente.

> ⚠️ **Le code est livré non branché.** Aucun projet Supabase n'a été créé,
> aucune migration n'a été appliquée, aucun compte Resend ni déploiement Vercel
> n'a été réalisé. Le schéma et le seed SQL sont fournis en fichiers, à exécuter
> vous-même. Tout est détaillé plus bas.

---

## Sommaire

1. [Stack technique](#1-stack-technique)
2. [Prérequis](#2-prérequis)
3. [Installation locale](#3-installation-locale)
4. [Brancher Supabase](#4-brancher-supabase)
5. [Configurer Resend](#5-configurer-resend)
6. [Variables d'environnement](#6-variables-denvironnement)
7. [Déploiement sur Vercel](#7-déploiement-sur-vercel)
8. [Structure du projet](#8-structure-du-projet)
9. [Choix techniques et compromis assumés](#9-choix-techniques-et-compromis-assumés)
10. [Personnalisation](#10-personnalisation)
11. [Sécurité](#11-sécurité)
12. [Dépannage](#12-dépannage)

---

## 1. Stack technique

| Domaine               | Choix                                                  | Version épinglée                     |
| --------------------- | ------------------------------------------------------ | ------------------------------------ |
| Framework             | Next.js (App Router)                                   | 15.5.22                              |
| UI                    | React                                                  | 19.2.8                               |
| Langage               | TypeScript (mode strict)                               | 5.9.3                                |
| Styles                | Tailwind CSS v4 (thème en CSS, sans fichier de config) | 4.3.3                                |
| Composants            | Primitives shadcn/ui écrites dans le dépôt             | —                                    |
| Base, auth, stockage  | Supabase                                               | `supabase-js` 2.110.9 / `ssr` 0.12.3 |
| E-mail transactionnel | Resend                                                 | 6.18.0                               |
| Formulaires           | react-hook-form + zod                                  | 7.83.0 / 4.4.3                       |
| Hébergement cible     | Vercel                                                 | —                                    |

Toutes les dépendances sont épinglées à une version exacte (pas de `^`), et
aucune version canary n'est utilisée.

## 2. Prérequis

- **Node.js 20.9 ou supérieur** (22 recommandé, voir `.nvmrc`)
- **npm 10+**
- Un compte **Supabase** (offre gratuite suffisante pour démarrer)
- Un compte **Resend** (facultatif au départ : sans lui, les messages sont
  quand même enregistrés en base, seule la notification e-mail est ignorée)
- Un compte **Vercel** pour la mise en ligne

## 3. Installation locale

```bash
git clone <url-de-votre-dépôt>
cd FKin
npm install

# Copiez le modèle de variables d'environnement
cp .env.example .env.local

npm run dev
```

Le site est alors disponible sur <http://localhost:3000>.

**Il démarre même avec un `.env.local` non rempli.** Les pages alimentées par la
base affichent simplement un état vide soigné, et un avertissement apparaît
dans la console. C'est volontaire : vous pouvez découvrir le site avant de créer
quoi que ce soit chez Supabase.

### Scripts disponibles

| Commande            | Effet                                 |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Serveur de développement              |
| `npm run build`     | Build de production                   |
| `npm run start`     | Sert le build de production           |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | Vérification TypeScript sans émission |
| `npm run format`    | Formatage Prettier                    |

## 4. Brancher Supabase

> ✅ **Déjà fait pour ce déploiement.** Le projet `dons-solidaires`
> (ref `ujvfqlriwylxrkjwamjc`, région eu-west-3 / Paris) a été provisionné : le
> schéma, les politiques RLS, le bucket `medias` et le contenu de démonstration
> sont en place. Les étapes 4.1 à 4.4 sont donc terminées.
>
> Restent à votre charge, parce qu'elles exigent des accès que l'automatisation
> n'a pas : **créer le compte administrateur** (4.5) et **récupérer la clé
> `service_role`** (4.6), qui n'est jamais exposée hors du dashboard.
>
> Les étapes ci-dessous restent la marche à suivre complète si vous devez un
> jour recréer le projet de zéro.

Ces six étapes sont à réaliser une seule fois. Comptez une vingtaine de minutes.

### 4.1 Créer le projet

1. Rendez-vous sur <https://supabase.com/dashboard> et cliquez sur
   **New project**.
2. Choisissez un nom, un mot de passe de base de données (conservez-le dans un
   gestionnaire de mots de passe) et la région **Europe (eu-west-3, Paris)** ou
   **eu-central-1** — c'est la plus proche de vos deux publics.
3. Attendez que le projet finisse de s'initialiser (une à deux minutes).

### 4.2 Appliquer le schéma

1. Dans le menu de gauche, ouvrez **SQL Editor** puis **New query**.
2. Copiez **l'intégralité** du fichier [`supabase/schema.sql`](supabase/schema.sql)
   et collez-le dans l'éditeur.
3. Cliquez sur **Run**.

Le script crée les tables `articles`, `projets`, `messages` et `admins`, la
fonction `est_admin()`, toutes les politiques RLS ainsi que le bucket de
stockage `medias`. Il est idempotent : vous pouvez le rejouer sans risque.

### 4.3 Charger le contenu de démonstration (facultatif mais conseillé)

Même opération avec [`supabase/seed.sql`](supabase/seed.sql) : trois projets et
trois articles fictifs mais crédibles, pour que le site ne soit pas vide lors de
la première mise en ligne.

Tous ces contenus ont un slug commençant par `demo-`. Vous pouvez les supprimer
un par un depuis le back-office, ou d'un coup avec la requête de nettoyage
fournie en bas du fichier de seed.

### 4.4 Vérifier le bucket de stockage

Le script `schema.sql` crée déjà le bucket `medias` en lecture publique.
Vérifiez sa présence dans **Storage** : vous devez voir un bucket `medias`
marqué **Public**.

S'il n'apparaît pas, créez-le à la main : **Storage** → **New bucket** → nom
`medias`, case **Public bucket** cochée. Les politiques d'écriture, elles, ont
bien été posées par le script.

### 4.5 Créer le compte administrateur

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Renseignez votre adresse e-mail et un mot de passe robuste (12 caractères
   minimum). **Cochez « Auto Confirm User »**, sinon la connexion sera refusée.
3. Revenez dans **SQL Editor** et exécutez, en remplaçant l'adresse :

```sql
insert into public.admins (user_id, email, nom_affichage)
select id, email, 'Votre prénom'
from auth.users
where email = 'vous@votre-domaine.fr'
on conflict (user_id) do nothing;
```

4. Vérifiez : `select * from public.admins;` doit renvoyer une ligne.

> **Pour ajouter un second administrateur plus tard**, répétez uniquement les
> étapes 1 à 3. Aucune modification de code n'est nécessaire : le droit
> d'administration est une donnée, pas une constante dans le code.

### 4.6 Renseigner les clés

**Project Settings** → **API**. Recopiez dans `.env.local` :

| Champ du dashboard               | Variable                        |
| -------------------------------- | ------------------------------- |
| Project URL                      | `NEXT_PUBLIC_SUPABASE_URL`      |
| Clé `anon` / `publishable`       | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Clé `service_role` (**secrète**) | `SUPABASE_SERVICE_ROLE_KEY`     |

Relancez `npm run dev`, puis connectez-vous sur
<http://localhost:3000/connexion>.

## 5. Configurer Resend

Nécessaire uniquement pour recevoir une alerte e-mail à chaque message. Sans
cette configuration, le formulaire fonctionne : les messages sont enregistrés et
consultables dans l'onglet **Messages** du back-office.

1. Créez un compte sur <https://resend.com>.
2. **Domains** → ajoutez votre domaine et suivez les instructions de
   vérification DNS (enregistrements SPF et DKIM). Comptez quelques minutes à
   quelques heures de propagation.
3. **API Keys** → **Create API Key** (droit d'envoi suffisant). Copiez la clé,
   elle ne s'affiche qu'une fois.
4. Complétez `.env.local` :

```env
RESEND_API_KEY=re_votre_cle
RESEND_FROM_EMAIL="Dons solidaires <contact@votre-domaine.fr>"
CONTACT_NOTIFICATION_EMAIL=vous@votre-domaine.fr
```

`CONTACT_NOTIFICATION_EMAIL` accepte plusieurs adresses séparées par des
virgules.

> **Pour tester sans domaine vérifié**, utilisez
> `RESEND_FROM_EMAIL=onboarding@resend.dev`. Resend n'acceptera alors d'envoyer
> qu'à l'adresse de votre propre compte.

## 6. Variables d'environnement

Toutes les variables sont listées et commentées une par une dans
[`.env.example`](.env.example). En résumé :

| Variable                        | Obligatoire           | Rôle                                              |
| ------------------------------- | --------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | oui en production     | URL canonique, sitemap, Open Graph                |
| `NEXT_PUBLIC_SUPABASE_URL`      | oui                   | URL du projet Supabase                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | oui                   | Clé publique, protégée par la RLS                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | oui                   | **Secrète.** Enregistrement des messages entrants |
| `NEXT_PUBLIC_SUPABASE_BUCKET`   | non (défaut `medias`) | Bucket des images                                 |
| `RESEND_API_KEY`                | non                   | **Secrète.** Notification e-mail                  |
| `RESEND_FROM_EMAIL`             | non                   | Expéditeur des notifications                      |
| `CONTACT_NOTIFICATION_EMAIL`    | non                   | Destinataire(s) des notifications                 |

Règle à ne jamais enfreindre : **une variable préfixée `NEXT_PUBLIC_` est
envoyée au navigateur**. Ne préfixez jamais ainsi une clé secrète.

## 7. Déploiement sur Vercel

1. Poussez le dépôt sur GitHub.
2. Sur <https://vercel.com>, **Add New** → **Project** → importez le dépôt.
   Vercel détecte Next.js automatiquement : aucun réglage de build à modifier.
3. Dans **Environment Variables**, ajoutez **toutes** les variables de
   `.env.example`, pour les environnements _Production_, _Preview_ et
   _Development_. `NEXT_PUBLIC_SITE_URL` doit valoir votre URL finale
   (`https://votre-domaine.fr`, **sans slash final**).
4. **Deploy**.
5. Une fois le domaine personnalisé branché (**Settings** → **Domains**),
   corrigez `NEXT_PUBLIC_SITE_URL` si nécessaire et **redéployez** : cette
   variable est lue au build pour le sitemap et les balises canoniques.

### Après la mise en ligne

- Vérifiez `https://votre-domaine.fr/robots.txt` et
  `https://votre-domaine.fr/sitemap.xml`.
- Soumettez le sitemap à la Google Search Console.
- Connectez-vous à `/connexion` pour confirmer que le back-office fonctionne en
  production.
- Envoyez un message de test depuis `/contact` et vérifiez qu'il apparaît bien
  dans l'onglet **Messages**.

## 8. Structure du projet

```
.
├── cahier-des-charges.md        Document de référence du projet
├── docs/admin.md                Guide d'utilisation du back-office
├── middleware.ts                Session Supabase + protection de /admin
├── next.config.mjs              En-têtes de sécurité, CSP, images distantes
├── supabase/
│   ├── schema.sql               Tables, contraintes, RLS, bucket — NON APPLIQUÉ
│   └── seed.sql                 Contenu de démonstration — NON APPLIQUÉ
└── src/
    ├── app/
    │   ├── (site)/              Pages publiques (header + footer communs)
    │   │   ├── page.tsx                 Accueil
    │   │   ├── services/                Nos services
    │   │   ├── realisations/            Galerie des projets
    │   │   ├── comment-ca-marche/       Parcours d'un don
    │   │   ├── actualites/              Blog : liste et article
    │   │   └── contact/                 Formulaire + Server Action
    │   ├── admin/               Back-office (layout protégé)
    │   │   ├── articles/                Liste, création, édition
    │   │   ├── projets/                 Liste, création, édition
    │   │   └── messages/                Boîte de réception
    │   ├── connexion/           Authentification
    │   ├── deconnexion/         Route POST de déconnexion
    │   ├── robots.ts            /robots.txt
    │   ├── sitemap.ts           /sitemap.xml
    │   └── opengraph-image.tsx  Image de partage générée
    ├── components/
    │   ├── ui/                  Primitives (bouton, champs, carte, alerte)
    │   ├── layout/              Header, footer, logo
    │   └── admin/               Téléversement d'image, suppression, navigation
    ├── lib/
    │   ├── env.ts               Lecture et validation des variables
    │   ├── site.ts              Nom, coordonnées, navigation
    │   ├── auth.ts              Contrôle d'accès du back-office
    │   ├── data.ts              Lectures publiques
    │   ├── admin-data.ts        Lectures du back-office
    │   ├── rate-limit.ts        Limitation de débit du formulaire
    │   ├── supabase.ts          Point d'entrée documenté
    │   ├── supabase/            Clients navigateur, serveur, service, middleware
    │   └── validation/          Schémas zod partagés client/serveur
    ├── styles/globals.css       Thème Tailwind v4
    └── types/database.ts        Types de la base, alignés sur schema.sql
```

## 9. Choix techniques et compromis assumés

Les points ci-dessous n'étaient pas tranchés par le cahier des charges. La
décision la plus simple a été retenue, et la voici documentée.

**Aucune police web n'est chargée.** La pile système est utilisée pour le texte
courant comme pour les titres. Cela supprime deux à trois requêtes bloquantes
et tout scintillement au chargement — un gain net sur les connexions lentes,
qui sont une contrainte explicite du projet. Voir
[Personnalisation](#10-personnalisation) pour revenir sur ce choix.

**Le contenu des articles est stocké en texte brut, pas en HTML.** Les
paragraphes sont séparés par des lignes vides et rendus en `<p>` distincts.
Conséquence : pas de gras ni de liens dans le corps d'un article, mais aucune
surface d'injection XSS depuis le back-office. Le compromis penche
volontairement du côté de la sécurité et de la simplicité d'usage.

**La limitation de débit est en mémoire de processus.** Cinq envois par heure
et par IP, sans dépendance externe. Sur Vercel, chaque instance serverless a sa
propre mémoire : le compteur n'est donc pas partagé. Combiné au honeypot et au
piège temporel, cela suffit au volume attendu. Pour durcir, branchez Upstash
Ratelimit dans `lib/rate-limit.ts` sans changer l'interface.

**Les messages sont insérés avec la clé `service_role`.** Cela permet de
n'accorder _aucun_ droit d'écriture au rôle anonyme sur la table `messages` : un
visiteur ne peut pas y insérer de lignes en dehors du formulaire. La clé ne
quitte jamais le serveur.

**La CSP autorise `'unsafe-inline'` pour les scripts et les styles.** Next.js
injecte des styles inline (notamment pour `next/image`) et du JSON-LD. Passer à
une CSP à nonce imposerait de rendre chaque page dynamique, ce qui supprimerait
le bénéfice du cache statique. Le reste de la politique est strict :
`frame-ancestors 'none'`, `object-src 'none'`, `connect-src` limité à votre
projet Supabase.

**Les pages publiques alimentées par la base sont revalidées toutes les
heures**, et invalidées immédiatement à chaque publication depuis le
back-office. Le visiteur reçoit donc une page en cache — rapide — sans jamais
voir un contenu périmé après une modification.

**`lib/supabase.ts` ne contient pas le client lui-même.** Un client navigateur,
un client serveur et un client privilégié ne peuvent pas cohabiter dans un même
module : le second importe `server-only`, le troisième porte la clé
`service_role`. Le fichier sert de point d'entrée documenté et réexporte les
types ; les implémentations vivent dans `lib/supabase/`.

**Le site fonctionne sans Supabase.** Les lectures échouent proprement et
renvoient des listes vides plutôt que de faire planter le build. C'est ce qui
permet de cloner, installer et déployer avant même d'avoir créé la base.

## 10. Personnalisation

**Nom, coordonnées, navigation** → `src/lib/site.ts`. Un seul fichier alimente
le header, le footer, les balises SEO et le JSON-LD.

**Couleurs** → bloc `@theme` de `src/styles/globals.css`. Les ratios de
contraste actuels y sont commentés ; si vous modifiez une couleur de texte,
vérifiez qu'elle reste au-dessus de 4,5:1 sur le fond.

**Chiffres-clés de l'accueil** → `src/app/(site)/page.tsx`, section repérée par
un commentaire `TODO`. Remplacez-les par vos données réelles avant la mise en
ligne.

**Ajouter une police web** → installez-la via `next/font` dans
`src/app/layout.tsx`, exposez sa variable CSS, puis remplacez `--police-sans`
et/ou `--police-titre` dans `globals.css`. Gardez à l'esprit le coût pour les
visiteurs sur connexion lente.

**Photographies** → aucune photo n'est livrée avec le code. Les cartes affichent
un visuel de remplacement tant qu'aucune image n'a été téléversée. Ajoutez les
vôtres depuis le back-office : elles partent dans Supabase Storage et sont
servies optimisées par `next/image`.

## 11. Sécurité

Mesures en place :

- En-têtes HTTP : HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, CSP complète (`next.config.mjs`).
- Row Level Security activée sur les quatre tables ; tout est interdit par
  défaut, les accès sont ouverts au cas par cas (`supabase/schema.sql`).
- Trois barrières successives sur `/admin` : middleware (session), vérification
  serveur de l'appartenance à la table `admins`, puis politiques RLS.
- Chaque Server Action revérifie les droits de l'appelant. Une Server Action est
  une route HTTP : elle ne fait jamais confiance au contexte d'affichage.
- Validation zod côté serveur sur toutes les entrées, avec les mêmes schémas que
  le client.
- Formulaire de contact : honeypot, piège temporel (3 secondes minimum) et
  limitation à 5 envois par heure et par IP. Aucune IP n'est stockée en base.
- Déconnexion en POST uniquement, pour qu'un simple lien ou un préchargement ne
  puisse pas la déclencher.
- Redirection après connexion restreinte aux chemins internes (pas de
  redirection ouverte via `?suite=`).
- Message de connexion générique, qui ne permet pas d'énumérer les comptes.
- `poweredByHeader` désactivé ; `/admin` et `/connexion` exclus de
  l'indexation.
- Téléversements : type MIME et poids contrôlés côté client, nom de fichier
  reconstruit de zéro, écriture réservée aux administrateurs par politique
  Storage.

Bonnes pratiques à votre charge :

- Ne commitez jamais `.env.local` (déjà exclu par `.gitignore`).
- Faites tourner la clé `service_role` si vous soupçonnez une fuite
  (**Project Settings** → **API** → **Reset**).
- Activez les sauvegardes automatiques de la base dans Supabase.
- Lancez `npm audit` régulièrement.

## 12. Dépannage

**« Variables d'environnement invalides » au démarrage.** Une variable est
présente mais mal formée : URL sans `https://`, clé Resend ne commençant pas par
`re_`. Le détail figure dans le message d'erreur. Une variable absente ne
déclenche pas cette erreur — seulement une variable incorrecte.

**Connexion refusée alors que le mot de passe est bon.** Deux causes possibles :
l'utilisateur n'a pas été confirmé (cochez **Auto Confirm User** à la création),
ou il n'a pas été inscrit dans la table `admins` (étape 4.5).

**Le back-office se charge mais les listes sont vides.** Le compte est
authentifié mais absent de `admins` : les politiques RLS filtrent alors tout.
Vérifiez avec `select * from public.admins;`.

**Le téléversement d'image échoue.** Vérifiez que le bucket `medias` existe et
qu'il est public, que `NEXT_PUBLIC_SUPABASE_BUCKET` correspond bien à son nom,
et que votre compte figure dans `admins`.

**Les images ne s'affichent pas en production.** `next/image` n'autorise que
l'hôte déduit de `NEXT_PUBLIC_SUPABASE_URL` **au moment du build**. Si vous avez
renseigné cette variable après un premier déploiement, redéployez.

**Aucun e-mail reçu.** Regardez les logs de la fonction sur Vercel : un message
`[contact] Resend non configuré` ou `[contact] Resend a refusé l'envoi` indique
la cause. Le domaine expéditeur doit être vérifié chez Resend. Dans tous les
cas, le message est bien enregistré et consultable dans le back-office.

**Un article publié n'apparaît pas.** Vérifiez son statut (« Publié » et non
« Brouillon »). Les pages publiques sont revalidées à la publication, mais si
vous avez modifié la base directement en SQL, attendez une heure ou redéployez.

---

## Licence

MIT — voir [LICENSE](LICENSE).
