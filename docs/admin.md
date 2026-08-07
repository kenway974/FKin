# Guide du back-office

Ce document s'adresse à la personne qui gère le contenu du site au quotidien.
Aucune compétence technique n'est nécessaire.

Pour l'installation et le branchement de la base, voir plutôt le
[README](../README.md).

---

## Sommaire

- [Se connecter](#se-connecter)
- [Le tableau de bord](#le-tableau-de-bord)
- [Publier un article](#publier-un-article)
- [Ajouter un projet à la galerie](#ajouter-un-projet-à-la-galerie)
- [Lire les messages reçus](#lire-les-messages-reçus)
- [Ajouter les photos](#ajouter-les-photos)
- [Supprimer le contenu de démonstration](#supprimer-le-contenu-de-démonstration)
- [Questions fréquentes](#questions-fréquentes)

---

## Se connecter

1. Rendez-vous sur **`votre-domaine.fr/connexion`**. Le lien figure aussi tout
   en bas de chaque page du site, sous l'intitulé « Espace administration ».
2. Saisissez votre adresse e-mail et votre mot de passe.
3. Vous arrivez sur le tableau de bord.

Si le message « Adresse e-mail ou mot de passe incorrect » s'affiche alors que
vous êtes sûr de vos identifiants, contactez la personne qui a installé le site :
votre compte n'a probablement pas encore été déclaré comme administrateur.

**Pour vous déconnecter**, utilisez le bouton en haut à droite. Pensez-y sur un
ordinateur partagé.

## Le tableau de bord

Il donne l'état du site en un coup d'œil :

- le nombre d'articles, dont les brouillons ;
- le nombre de projets dans la galerie ;
- le nombre de messages, dont les non lus ;
- les cinq derniers messages reçus.

Les quatre onglets en haut de page — **Tableau de bord**, **Articles**,
**Projets**, **Messages** — sont les seules sections existantes.

Le bouton **Voir le site** ouvre le site public tel que le voient les visiteurs.

## Publier un article

Un article sert à raconter ce qui se passe entre deux livraisons : le départ
d'un conteneur, l'installation d'une salle, un retour de terrain.

### Créer

**Articles** → **Nouvel article**.

| Champ                         | À quoi il sert                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Titre**                     | Obligatoire. C'est aussi ce que voient les moteurs de recherche.                                                                                  |
| **Adresse de la page (slug)** | L'adresse de l'article. Cliquez sur **Depuis le titre** pour le remplir automatiquement.                                                          |
| **Chapô**                     | Deux ou trois phrases affichées en tête d'article et dans les aperçus. Sert aussi de description pour Google. Facultatif mais vivement conseillé. |
| **Contenu**                   | Obligatoire, 50 caractères minimum. Texte simple.                                                                                                 |
| **Statut**                    | « Brouillon » (invisible) ou « Publié » (en ligne).                                                                                               |
| **Date de publication**       | Laissez vide pour utiliser la date du jour.                                                                                                       |
| **Signature**                 | Ex. : « L'équipe de collecte ». Facultatif.                                                                                                       |
| **Image de couverture**       | Voir [Ajouter les photos](#ajouter-les-photos).                                                                                                   |
| **Description de l'image**    | Décrit la photo pour les personnes malvoyantes. À remplir dès qu'une image est présente.                                                          |

**Pour faire des paragraphes**, laissez une ligne vide entre deux blocs de
texte. Chaque bloc devient un paragraphe distinct sur le site.

> Le gras, l'italique et les liens ne sont pas gérés dans le corps d'un article.
> C'est un choix délibéré : cela garantit qu'aucun code indésirable ne peut être
> introduit dans les pages.

### Enregistrer et publier

Cliquez sur **Créer l'article**. Un bandeau vert confirme l'enregistrement.

La marche à suivre habituelle :

1. Rédigez en laissant le statut sur **Brouillon**. Enregistrez autant de fois
   que vous voulez, rien n'est visible.
2. Relisez.
3. Passez le statut sur **Publié** et enregistrez à nouveau.

L'article apparaît alors immédiatement sur `/actualites` et sur la page
d'accueil.

### Modifier ou supprimer

**Articles** → cliquez sur le titre. Le bouton **Voir** (uniquement pour les
articles publiés) ouvre la page telle qu'elle est en ligne.

La suppression demande une confirmation en deux temps. **Elle est
définitive** : il n'y a pas de corbeille. En cas de doute, repassez plutôt
l'article en brouillon.

> **Évitez de modifier le slug d'un article déjà publié.** Les liens partagés
> vers l'ancienne adresse cesseraient de fonctionner.

## Ajouter un projet à la galerie

C'est la partie la plus consultée du site par les entreprises qui hésitent à
donner. Une fiche = une livraison menée à son terme.

**Projets** → **Nouveau projet**.

| Champ                  | Conseil de rédaction                                                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Titre**              | Ce qui a été équipé. Ex. : « Salle informatique du lycée Bonsomi ».                                                                                         |
| **Identifiant (slug)** | Cliquez sur **Depuis le titre**. Sert uniquement à éviter les doublons.                                                                                     |
| **Lieu**               | Le plus précis possible. Ex. : « Kinshasa, commune de Limete ».                                                                                             |
| **Date du projet**     | Date de la livraison ou de la mise en service.                                                                                                              |
| **Type de matériel**   | Listez avec les quantités : « 24 ordinateurs, 3 onduleurs, 1 imprimante ».                                                                                  |
| **Description**        | Le contexte : quelle structure, quel besoin, comment le projet est né.                                                                                      |
| **Résultat obtenu**    | **Le champ le plus important.** Ce que le matériel permet aujourd'hui, chiffré si possible : « 180 élèves suivent deux heures d'informatique par semaine ». |
| **Visibilité**         | « Visible » ou « Masqué ».                                                                                                                                  |
| **Ordre d'affichage**  | Les petits nombres passent en premier. Mettez `1` sur votre plus belle réalisation.                                                                         |
| **Photographie**       | Voir la section suivante.                                                                                                                                   |

Un projet **Visible** apparaît immédiatement dans `/realisations`, et les trois
premiers remontent sur la page d'accueil.

Modification et suppression fonctionnent comme pour les articles.

## Lire les messages reçus

**Messages** liste tous les envois du formulaire de contact, du plus récent au
plus ancien.

- Une étiquette **Non lu** et un liseré coloré signalent les messages
  non ouverts.
- Une étiquette indique le profil de l'expéditeur : **Entreprise donatrice**
  (ocre) ou **Structure bénéficiaire** (vert).

Cliquez sur un message pour l'ouvrir. Vous y trouvez le nom, l'e-mail,
l'organisation et le téléphone lorsqu'ils ont été renseignés.

- **Répondre par e-mail** ouvre votre logiciel de messagerie avec l'objet
  pré-rempli.
- **Marquer comme non lu** remet le message en avant pour le traiter plus tard.
- **Supprimer** est définitif.

Ouvrir un message le marque automatiquement comme lu.

> Si vous ne recevez pas d'alerte par e-mail à chaque nouveau message, c'est que
> Resend n'est pas configuré. Un bandeau vous le rappelle sur le tableau de
> bord. Pensez alors à consulter cet onglet régulièrement.

## Ajouter les photos

Le même outil sert pour les couvertures d'articles et les photos de projets.

1. Cliquez sur **Choisir une image**.
2. Sélectionnez le fichier. Le téléversement démarre aussitôt ; ne quittez pas
   la page tant qu'il n'est pas terminé.
3. Un aperçu s'affiche. **Retirer l'image** l'enlève de la fiche.
4. **Enregistrez la fiche** pour que le changement prenne effet sur le site.

**Contraintes techniques :** formats JPEG, PNG, WebP ou AVIF ; 5 Mo maximum.

**Recommandation :** visez environ 1200 × 900 pixels et moins de 300 ko. Une
partie du public consulte le site depuis un smartphone sur une connexion lente
et payante au volume. Un outil gratuit comme [Squoosh](https://squoosh.app)
permet de réduire le poids d'une photo en quelques secondes.

**Remplissez toujours la description de l'image.** Elle est lue à voix haute
aux personnes malvoyantes et s'affiche si la photo ne se charge pas. Décrivez ce
que l'on voit : « Des élèves devant les postes de la nouvelle salle
informatique », et non « photo1 ».

> Vous pouvez aussi coller directement l'adresse d'une image hébergée ailleurs
> dans le champ prévu à cet effet, sous le bouton de téléversement.

## Contenu de départ

Le site démarre avec **trois articles** déjà publiés (installés par
`supabase/seed.sql`) et **aucun projet** dans la galerie « Réalisations ».

Les projets sont à ajouter depuis l'onglet **Projets** au fur et à mesure des
réalisations. Vous pouvez modifier ou supprimer les articles de départ, ou en
publier d'autres, à tout moment depuis l'onglet **Articles**.

## Questions fréquentes

**Puis-je annuler une suppression ?**
Non. Il n'y a pas de corbeille. Pour retirer un contenu temporairement,
repassez-le en **Brouillon** (article) ou en **Masqué** (projet) : il disparaît
du site public mais reste enregistré.

**Combien de temps avant qu'une modification soit visible ?**
Immédiatement. Le site se met à jour à chaque enregistrement.

**Puis-je travailler depuis mon téléphone ?**
Oui, le back-office s'adapte aux petits écrans. La rédaction d'un long article
reste plus confortable sur ordinateur.

**Comment ajouter une autre personne à l'administration ?**
Cela passe par le dashboard Supabase, en deux étapes décrites à la section 4.5
du [README](../README.md). Aucune modification du site n'est nécessaire.

**J'ai fermé la page sans enregistrer.**
Les modifications sont perdues. Un message « Modifications non enregistrées »
s'affiche à côté du bouton d'enregistrement tant que vous n'avez pas sauvegardé.

**Le site affiche « Aucun projet publié pour le moment ».**
Aucun projet n'est marqué « Visible ». Vérifiez le champ **Visibilité** de vos
fiches.
