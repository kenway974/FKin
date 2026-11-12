# Arborescence des URL

Référence de toutes les adresses servies par le site, et des règles qui les
gardent propres. À tenir à jour à chaque ajout ou renommage de page : une URL
publiée et indexée ne doit plus changer sans redirection 301/308.

## Règles communes

- **Forme canonique** : minuscules, mots séparés par des tirets, sans accent,
  sans barre oblique finale ni répétée. Toute variante (`/Services`,
  `/contact/`, `//actualites`) est redirigée en **308 (permanente)** vers sa
  forme canonique par `src/middleware.ts` (`lib/url-canonique.ts`).
- **Une page = une URL** : chaque page publique déclare sa balise
  `<link rel="canonical">` et son `og:url` via `metadonneesPage()`
  (`lib/seo.ts`). Les paramètres de requête (`?profil=…`, `?utm_…`) ne créent
  donc pas de doublon : la canonique les ignore.
- **Domaine** : `NEXT_PUBLIC_SITE_URL`, à défaut le domaine de production
  Vercel. Les déploiements d'aperçu désignent le domaine de production comme
  version de référence.
- **Slugs** des articles : générés depuis le titre, validés côté serveur
  (`^[a-z0-9]+(?:-[a-z0-9]+)*$`, 80 caractères au plus).

## Pages publiques (indexées, présentes dans le sitemap)

```
/                                   Accueil
├── /services                       Nos services
│   ├── #reparation                   Réparation par des jeunes (Kinshasa)
│   └── #formation                    Centre de formation
├── /realisations                   Réalisations (projets publiés)
├── /comment-ca-marche              Parcours d'un don
│   └── #faq                          Questions fréquentes (JSON-LD FAQPage)
├── /actualites                     Actualités (liste)
│   └── /actualites/{slug}            Un article publié
├── /contact                        Formulaire de contact
│   ├── ?profil=entreprise            Pré-sélectionne « entreprise donatrice »
│   └── ?profil=beneficiaire          Pré-sélectionne « structure bénéficiaire »
├── /mentions-legales               Mentions légales
└── /confidentialite                Politique de confidentialité
```

## Fichiers techniques (générés)

```
/sitemap.xml            Plan du site (lib/plan-du-site.ts)
/robots.txt             Règles d'exploration
/manifest.webmanifest   Manifeste web (ajout à l'écran d'accueil)
/favicon.ico            Icône d'onglet (16, 32, 48 px)
/icon.png               Icône 192 px
/apple-icon.png         Icône iOS 180 px, fond blanc
/opengraph-image        Image de partage 1200 × 630
/icone-192.png          Icônes du manifeste (dossier public/)
/icone-512.png
```

## Pages non indexées

Exclues du sitemap, fermées aux robots (`robots.txt`) et/ou marquées `noindex`.

```
/connexion                         Connexion au back-office          noindex
│   └── ?suite={chemin}              Page à rouvrir après connexion
/deconnexion                       Déconnexion (POST uniquement)
/admin                             Tableau de bord                   noindex
├── /admin/articles                  Articles : liste
│   ├── /admin/articles/nouveau        Création
│   └── /admin/articles/{id}           Édition
├── /admin/projets                   Réalisations : liste
│   ├── /admin/projets/nouveau         Création
│   └── /admin/projets/{id}            Édition
├── /admin/messages                  Messages reçus
│   └── /admin/messages/{id}           Lecture
├── /admin/faq                       Questions fréquentes
├── /admin/chiffres                  Chiffres de l'accueil
└── /admin/coordonnees               Coordonnées affichées
(toute autre adresse)              Page 404                          noindex
```
