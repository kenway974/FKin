# Comportements attendus du site

Ce document décrit ce que le site **doit** faire, du point de vue de ses
utilisateurs. C'est la référence des tests automatiques : chaque test
correspond à un comportement de cette liste et porte son numéro (`C12`…).

Règles d'usage :

- Les comportements viennent du cahier des charges, du guide du back-office
  et des demandes du client lors de la refonte — **pas du code**.
- Si un test échoue, on corrige le code. On ne modifie un comportement de ce
  document (et le test associé) qu'après décision explicite du responsable du
  projet.
- Les points marqués **À trancher** doivent être décidés avant d'écrire leurs
  tests.

Sources : `CDC` = cahier des charges, `Guide` = guide du back-office
(`docs/admin.md`), `Refonte` = demandes du client lors de la refonte.

---

## 1. Pages publiques

| N° | Comportement attendu | Source |
| --- | --- | --- |
| C1 | Les pages Accueil, Nos services, Réalisations, Comment ça marche, Actualités et Contact s'ouvrent sans erreur. | CDC §3 |
| C2 | Tout le site est en français. | CDC §6 |
| C3 | Une adresse qui n'existe pas affiche une page « introuvable » (erreur 404), pas une page vide. | CDC §6 |
| C4 | Chaque page a son propre titre et sa description pour les moteurs de recherche. | CDC §6 |
| C5 | `sitemap.xml` et `robots.txt` sont accessibles. Le sitemap liste les pages publiques et les articles publiés, jamais le back-office. | CDC §6 |

## 2. Articles (Actualités)

| N° | Comportement attendu | Source |
| --- | --- | --- |
| C6 | Un article **publié** apparaît sur la page Actualités, avec son titre, sa date et son résumé. | CDC §3, Guide |
| C7 | Un article en **brouillon** n'apparaît nulle part sur le site public : ni dans la liste, ni sur l'accueil, ni par son adresse directe (qui donne une 404). | Guide |
| C8 | Les articles sont classés du plus récent au plus ancien. | Guide |
| C9 | La page d'un article affiche son titre, sa date, son contenu découpé en paragraphes (une ligne vide = un nouveau paragraphe). | Guide |
| C10 | Le contenu d'un article est affiché comme du texte : du HTML ou du code saisi dans un article n'est jamais interprété. | Guide |
| C11 | Les derniers articles publiés apparaissent sur la page d'accueil. | Guide |

## 3. Projets (Réalisations)

| N° | Comportement attendu | Source |
| --- | --- | --- |
| C12 | Un projet **visible** apparaît sur la page Réalisations, avec son titre, son lieu, son type de matériel et son résultat. | CDC §3, Guide |
| C13 | Un projet **masqué** n'apparaît nulle part sur le site public. | Guide |
| C14 | Les projets sont classés selon leur ordre d'affichage : les plus petits nombres en premier. | Guide |
| C15 | Les trois premiers projets visibles apparaissent sur la page d'accueil. | Guide |
| C16 | S'il n'y a aucun projet visible, la page Réalisations affiche « Aucun projet publié pour le moment » au lieu d'une zone vide. | Guide |
| C17 | Les projets qui ont une position (latitude et longitude) apparaissent sur la carte des structures équipées. Les autres n'y sont pas, sans faire planter la carte. | Refonte |

## 4. Chiffres clés

| N° | Comportement attendu | Source |
| --- | --- | --- |
| C18 | Les chiffres clés saisis dans le back-office s'affichent sur la page d'accueil, dans l'ordre choisi. | Refonte |
| C19 | Tant qu'aucun chiffre n'est saisi, l'accueil affiche des chiffres calculés automatiquement (pas une zone vide). | Refonte |

## 5. Formulaire de contact et de don

| N° | Comportement attendu | Source |
| --- | --- | --- |
| C20 | Le visiteur choisit d'abord son profil : « entreprise donatrice » ou « structure bénéficiaire ». | CDC §3 |
| C21 | Le formulaire se remplit en plusieurs étapes. On ne peut pas passer à l'étape suivante tant que les champs obligatoires de l'étape sont vides ou invalides. | Refonte |
| C22 | Une adresse e-mail invalide est refusée, avec un message d'erreur clair à côté du champ. | CDC §3 |
| C23 | Un message vide est refusé. | CDC §3 |
| C24 | Le visiteur peut joindre jusqu'à 5 photos du matériel. Une 6ᵉ est refusée avec un message clair. | Refonte |
| C25 | Une photo dans un format non accepté (autre que JPEG, PNG ou WebP) ou trop lourde est refusée avec un message clair. | Refonte |
| C26 | Les photos jointes ne sont jamais accessibles publiquement : seuls les administrateurs peuvent les voir. | Refonte |
| C27 | Un envoi valide est enregistré en base et le visiteur voit un message de confirmation. | CDC §3 |
| C28 | Un envoi valide déclenche une notification par e-mail à l'association (si l'envoi d'e-mails est configuré). | CDC §3 |
| C29 | Si l'envoi échoue, le visiteur voit un message d'erreur et les informations saisies ne sont pas perdues. | CDC §3 |
| C30 | Anti-spam : au-delà d'un certain nombre d'envois depuis la même connexion sur une période donnée, les envois suivants sont refusés avec un message indiquant quand réessayer. | CDC §3, §6 |
| C31 | Anti-spam : un robot qui remplit le formulaire automatiquement est bloqué. | CDC §6 |

## 6. Contact direct

| N° | Comportement attendu | Source |
| --- | --- | --- |
| C32 | Un lien WhatsApp ouvre une conversation avec le numéro de l'association. | Refonte |
| C33 | La FAQ affiche les questions ; cliquer sur une question ouvre ou ferme sa réponse. | Refonte |

## 7. Back-office : accès

| N° | Comportement attendu | Source |
| --- | --- | --- |
| C34 | Un visiteur non connecté qui ouvre une page du back-office est redirigé vers la page de connexion. | CDC §3 |
| C35 | Des identifiants incorrects affichent « Adresse e-mail ou mot de passe incorrect ». | Guide |
| C36 | Un compte connecté **mais non déclaré administrateur** n'a accès à aucune donnée du back-office (ni messages, ni brouillons, ni photos de dons). | CDC §3 |
| C37 | Le bouton de déconnexion ramène à un état non connecté : les pages du back-office ne sont plus accessibles. | Guide |
| C38 | Un visiteur ne peut jamais lire les messages reçus, ni créer, modifier ou supprimer un contenu, même en appelant directement la base de données. | CDC §6 |

## 8. Back-office : gestion des contenus

| N° | Comportement attendu | Source |
| --- | --- | --- |
| C39 | Le tableau de bord affiche le nombre d'articles (dont brouillons), de projets, de messages (dont non lus) et les cinq derniers messages. | Guide |
| C40 | Un administrateur peut créer, modifier et supprimer un article. Le titre est obligatoire ; le contenu fait au moins 50 caractères. | Guide |
| C41 | Le bouton « Depuis le titre » remplit l'adresse de la page (slug) à partir du titre. | Guide |
| C42 | Deux articles ne peuvent pas avoir la même adresse (slug). Idem pour les projets. | Guide |
| C43 | Un administrateur peut créer, modifier, masquer et supprimer un projet. | Guide |
| C44 | La suppression d'un article ou d'un projet demande une confirmation. | Guide |
| C45 | Le téléversement d'image accepte JPEG, PNG, WebP et AVIF jusqu'à 5 Mo, et refuse le reste avec un message clair. | Guide |
| C46 | Un administrateur peut ajouter, modifier, réordonner et supprimer les chiffres clés. | Refonte |
| C47 | La liste des messages est classée du plus récent au plus ancien, avec une étiquette « Non lu » et le profil de l'expéditeur. | Guide |
| C48 | Ouvrir un message le marque comme lu ; « Marquer comme non lu » le remet en non lu. | Guide |
| C49 | Un administrateur voit les photos jointes à un message de don. | Refonte |
| C50 | Quitter une fiche avec des modifications non enregistrées affiche l'avertissement « Modifications non enregistrées ». | Guide |

---

## À trancher

Ces points sont ambigus ou contradictoires. Il faut une décision avant d'écrire
leurs tests.

1. **Délai d'affichage (C6, C11, C12, C15).** Le guide du back-office promet
   qu'un contenu publié est visible « immédiatement ». En pratique, les listes
   du site sont mises en cache et peuvent mettre jusqu'à une heure à se
   mettre à jour. Lequel est le comportement voulu ?
2. **Seuil de l'anti-spam (C30).** Combien d'envois maximum, sur quelle
   période ? (Exemple : 3 envois par 10 minutes.)
3. **Poids maximum d'une photo jointe au formulaire (C25).** Le stockage est
   actuellement limité à 1 Mo par photo. Est-ce la bonne limite ? Les photos
   sont-elles compressées sur le téléphone avant l'envoi ?
4. **Nombre d'articles sur l'accueil (C11).** Combien : 3 ?
5. **Champs obligatoires du formulaire (C21).** Quels champs sont obligatoires
   à chaque étape, pour une entreprise et pour une structure bénéficiaire ?

## Hors périmètre des tests automatiques

Ces exigences du cahier des charges se vérifient autrement qu'avec des tests
de comportement :

- Direction artistique, esthétique : relecture visuelle.
- Performance et score Lighthouse : mesure Lighthouse.
- Contrastes et accessibilité fine : audit d'accessibilité (axe, Lighthouse).
- En-têtes de sécurité HTTP : contrôle ponctuel sur le site en ligne.
