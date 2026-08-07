-- =============================================================================
--  Contenu de départ — Respusse (France ↔ Congo)
-- =============================================================================
--
--  Ce fichier déclare les administrateurs du back-office et publie les trois
--  premiers articles du blog. Les projets de la galerie « Réalisations » ne
--  sont volontairement PAS pré-remplis : ils sont ajoutés par le client
--  lui-même depuis l'espace d'administration.
--
--  PRÉREQUIS — à faire AVANT d'exécuter ce fichier :
--    1. Appliquez d'abord `supabase/schema.sql` (tables, RLS, bucket).
--    2. Créez les deux comptes administrateurs dans le dashboard :
--         Authentication > Users > « Add user » > « Create new user »,
--         en cochant « Auto Confirm User » :
--           - respusse@gmail.com    (mot de passe choisi par le client)
--           - tikenspam2@gmail.com  (compte personnel du développeur)
--
--  Puis : Dashboard Supabase > SQL Editor > New query > collez ce fichier > Run.
--
--  Le fichier est idempotent (`on conflict do nothing`) : vous pouvez le rejouer
--  sans créer de doublons.
-- =============================================================================


-- -----------------------------------------------------------------------------
--  1. Administrateurs
-- -----------------------------------------------------------------------------
--  Le droit d'administration = une ligne dans `public.admins`. On retrouve les
--  identifiants des comptes créés à l'étape 2 ci-dessus à partir de leur e-mail.

insert into public.admins (user_id, email, nom_affichage)
select
  id,
  email,
  case when email = 'respusse@gmail.com' then 'Respusse' else 'Kenny' end
from auth.users
where email in ('respusse@gmail.com', 'tikenspam2@gmail.com')
on conflict (user_id) do nothing;


-- -----------------------------------------------------------------------------
--  2. Articles du blog (3 articles publiés)
-- -----------------------------------------------------------------------------
--  Le contenu est du texte brut : une ligne vide sépare deux paragraphes.
--  Le site en fait automatiquement des <p> distincts.

insert into public.articles
  (slug, titre, extrait, contenu, image_couverture, image_alt, statut, date_publication, auteur)
values
  (
    'pourquoi-donner-plutot-que-jeter',
    'Pourquoi donner votre matériel plutôt que le jeter',
    'Un ordinateur qui ne convient plus à votre entreprise peut équiper une salle de classe pendant des années. Le réemploi, c''est autant de déchets évités que d''usages retrouvés.',
    'Chaque année, des milliers d''ordinateurs encore fonctionnels sont mis au rebut par les entreprises françaises qui renouvellent leur parc. Pourtant, la plupart ont encore plusieurs années d''usage devant eux.

En confiant ce matériel à Respusse, vous évitez un déchet, vous sécurisez vos données et vous donnez à une école, une mairie ou une association au Congo les moyens de travailler.

Le geste est simple de votre côté : vous nous signalez le lot, nous organisons l''enlèvement, l''effacement des données et l''acheminement. Vous recevez un inventaire, puis un compte rendu d''usage.

Réemployer, ce n''est pas se débarrasser autrement. C''est prolonger la vie d''un matériel et lui donner une seconde utilité, là où elle compte le plus.',
    null,
    null,
    'publie',
    '2026-06-18',
    'L''équipe Respusse'
  ),
  (
    'effacement-des-donnees',
    'Effacement des données : ce que deviennent vos disques',
    'Avant tout réemploi, chaque support de stockage est effacé — ou détruit. Voici comment nous garantissons qu''aucune donnée ne quitte votre entreprise.',
    'La première inquiétude d''une entreprise qui donne son matériel, c''est le sort de ses données. C''est aussi notre première priorité.

Chaque disque est effacé selon une procédure d''écrasement en plusieurs passes, qui rend les données irrécupérables. Si vous le préférez, le support est détruit physiquement.

À la fin de l''opération, un certificat d''effacement est joint à l''inventaire du lot. Vous disposez d''une preuve écrite, exploitable dans votre démarche de conformité.

Ce n''est qu''une fois cette étape franchie que le matériel poursuit son chemin vers le reconditionnement, puis vers les structures qui en ont besoin.',
    null,
    null,
    'publie',
    '2026-07-09',
    'L''équipe Respusse'
  ),
  (
    'reparer-devient-un-metier',
    'À Kinshasa, réparer devient un métier',
    'Le matériel endommagé n''est pas perdu : confié à des recycleries à Kinshasa, il devient un support d''apprentissage pour des jeunes qui se forment à la réparation.',
    'Tout le matériel collecté n''arrive pas en parfait état. Plutôt que d''écarter ce qui est abîmé, nous en faisons une ressource.

Une partie de ces équipements est confiée à des recycleries à Kinshasa, où des jeunes apprennent à diagnostiquer les pannes, remplacer les pièces et remettre les appareils en service.

Chaque réparation devient un atelier concret : on ne se forme pas sur des exercices théoriques, mais sur du vrai matériel, qui repartira ensuite équiper une structure.

C''est le prolongement naturel de notre démarche. Un centre de formation aux métiers de l''informatique est d''ailleurs en train de voir le jour, pour aller plus loin encore.',
    null,
    null,
    'publie',
    '2026-07-30',
    'L''équipe Respusse'
  )
on conflict (slug) do nothing;


-- -----------------------------------------------------------------------------
--  3. Vérification
-- -----------------------------------------------------------------------------
select
  (select count(*) from public.admins)   as admins,
  (select count(*) from public.articles) as articles_publies;
