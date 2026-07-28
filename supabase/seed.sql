-- =============================================================================
--  Contenu de démonstration — Dons solidaires Île-de-France ↔ Congo
-- =============================================================================
--
--  ⚠️  CE CONTENU EST FICTIF.
--
--  Il sert uniquement à ce que le site ne soit pas vide lors de la première
--  mise en ligne, le temps que vous saisissiez vos vrais projets et articles.
--  Les noms d'établissements, d'entreprises, les chiffres et les dates ont été
--  inventés. Ne les laissez pas en ligne une fois votre contenu réel disponible.
--
--  CE FICHIER N'A PAS ÉTÉ APPLIQUÉ. Pour l'exécuter :
--    1. Appliquez d'abord `supabase/schema.sql`
--    2. Dashboard Supabase > SQL Editor > New query > collez ce fichier > Run
--
--  POUR TOUT SUPPRIMER D'UN COUP, deux possibilités :
--    - depuis le back-office : onglets « Projets » et « Articles », bouton
--      « Supprimer » sur chaque fiche (recommandé, aucun risque) ;
--    - ou en SQL, la requête de nettoyage fournie tout en bas de ce fichier.
--
--  Les slugs de démonstration commencent tous par « demo- », ce qui les rend
--  faciles à repérer et à supprimer en bloc.
-- =============================================================================


-- -----------------------------------------------------------------------------
--  Projets de la galerie (3 fiches)
-- -----------------------------------------------------------------------------
--  `image_url` est laissé à NULL : le site affiche alors un visuel de
--  remplacement propre plutôt qu'une image cassée. Remplacez-le par l'adresse
--  d'une photo téléversée depuis le back-office.

insert into public.projets
  (slug, titre, description, lieu, date_projet, type_materiel, resultat, image_url, image_alt, publie, ordre)
values
  (
    'demo-salle-informatique-lycee-bonsomi',
    'Salle informatique du lycée Bonsomi',
    'Le lycée disposait d''une salle vide, sécurisée et raccordée au réseau électrique, mais d''aucun équipement. Une société de conseil du 92 renouvelait à la même période l''intégralité de son parc de postes fixes. Les vingt-quatre unités centrales ont été testées, leurs disques effacés, puis expédiées avec trois onduleurs pour absorber les coupures de courant, fréquentes dans le quartier.',
    'Kinshasa, commune de Limete',
    '2024-11-18',
    '24 ordinateurs de bureau, 24 écrans, 3 onduleurs, 1 imprimante laser',
    '180 élèves de seconde et de première suivent désormais deux heures d''informatique par semaine. Deux enseignants ont été formés à la maintenance de premier niveau.',
    null,
    null,
    true,
    1
  ),
  (
    'demo-bureau-etat-civil-mairie-masina',
    'Bureau d''état civil de la mairie de Masina',
    'Les actes de naissance étaient encore établis à la main, ce qui allongeait les délais et multipliait les erreurs de recopie. La mairie a sollicité un équipement bureautique simple et robuste. Le lot provient d''une PME de Seine-Saint-Denis ayant déménagé ses locaux, complété par du mobilier récupéré lors du même enlèvement.',
    'Kinshasa, commune de Masina',
    '2025-03-07',
    '6 ordinateurs portables, 2 imprimantes multifonctions, 4 armoires métalliques',
    'Le délai moyen de délivrance d''un acte est passé de onze jours à trois. Les registres de l''année en cours sont désormais saisis au fur et à mesure.',
    null,
    null,
    true,
    2
  ),
  (
    'demo-atelier-couture-association-mama-mosala',
    'Atelier de couture de l''association Mama Mosala',
    'L''association forme des femmes en reconversion aux métiers de la couture. Elle travaillait avec quatre machines mécaniques pour vingt-deux apprenties. Une entreprise de textile du Val-de-Marne nous a confié son matériel d''atelier lors de la fermeture d''un site, dont huit machines électriques en bon état de marche.',
    'Brazzaville, quartier Moungali',
    '2025-06-24',
    '8 machines à coudre électriques, 2 surjeteuses, 1 groupe électrogène, lot de fournitures',
    'Les vingt-deux apprenties disposent chacune d''un poste sur les créneaux de formation. La promotion 2025 a doublé par rapport à l''an passé.',
    null,
    null,
    true,
    3
  )
on conflict (slug) do nothing;


-- -----------------------------------------------------------------------------
--  Articles du blog (3 articles)
-- -----------------------------------------------------------------------------
--  Le contenu est du texte brut : une ligne vide sépare deux paragraphes.
--  Le site en fait automatiquement des <p> distincts.

insert into public.articles
  (slug, titre, extrait, contenu, image_couverture, image_alt, statut, date_publication, auteur)
values
  (
    'demo-depart-du-conteneur-de-fevrier',
    'Le conteneur de février est parti du Havre',
    'Onze palettes, soixante-dix postes de travail et une bonne dose de logistique : retour sur trois semaines de préparation avant le départ du convoi.',
    'Le chargement s''est terminé un mardi, en fin d''après-midi, après trois semaines de préparation dans notre local de stockage. Onze palettes filmées, soixante-dix postes de travail complets, une vingtaine d''onduleurs et deux lots de mobilier scolaire.

Ce convoi rassemble le matériel de quatre entreprises franciliennes différentes. C''est devenu notre mode de fonctionnement habituel : peu de structures se séparent d''assez de matériel d''un coup pour remplir un conteneur, mais quatre lots moyens y parviennent sans difficulté.

L''étape la plus longue n''est pas celle qu''on imagine. Le transport maritime prend environ cinq semaines, ce qui est prévisible et se planifie. Le test et l''effacement des disques, en revanche, mobilisent deux bénévoles pendant près de quinze jours. Chaque machine est mise sous tension, vérifiée, ses supports de stockage écrasés en plusieurs passes, puis étiquetée. Nous ne faisons aucune exception sur ce point : c''est ce qui permet aux entreprises de nous confier leur matériel sans arrière-pensée.

Sur les soixante-dix postes annoncés, sept ont été écartés en cours de préparation — cartes mères défaillantes ou alimentations hors service. Ils partiront en filière de recyclage agréée. Nous préférons le dire : un lot n''est jamais réemployable à cent pour cent, et annoncer le contraire ne rendrait service à personne.

Prochaine étape : le dédouanement à Matadi, puis l''acheminement routier vers Kinshasa. Nous publierons les photos d''installation dès que les livraisons auront eu lieu.',
    null,
    null,
    'publie',
    '2025-02-14',
    'L''équipe de collecte'
  ),
  (
    'demo-ce-que-nous-ne-prenons-pas',
    'Ce que nous ne prenons pas, et pourquoi',
    'Refuser du matériel fait partie du travail. Voici les cas les plus fréquents et les solutions que nous proposons à la place.',
    'Nous recevons régulièrement des propositions que nous devons décliner. Comme cela surprend parfois, autant expliquer notre raisonnement.

Les écrans cathodiques, d''abord. Ils sont lourds, fragiles au transport maritime, contiennent du plomb et n''ont plus aucun usage pédagogique. Aucune structure ne nous en demande. Ils relèvent d''une filière de recyclage, pas du réemploi.

Les machines dont la remise en état coûterait plus cher que le remplacement, ensuite. Un ordinateur portable dont la charnière est cassée et la batterie gonflée ne sera pas réparé sur place : les pièces détachées sont rares et chères. Nous préférons envoyer dix machines saines que trente machines dont vingt finiront en pièces détachées dans un coin de salle.

Les imprimantes à jet d''encre, enfin, sont un cas particulier. Elles fonctionnent, mais leurs cartouches sont introuvables localement et coûtent une fortune quand on les trouve. Nous privilégions systématiquement les modèles laser, dont les toners se rechargent.

Dans tous ces cas, nous ne laissons pas l''entreprise sans solution. Nous indiquons une filière de recyclage agréée près de ses locaux et, si le lot mixte le justifie, nous prenons ce qui est réemployable lors du même passage. Le tri se fait chez nous, pas chez vous.

Une règle simple résume notre position : nous n''emportons que ce qui servira réellement à quelqu''un dans les six mois. Le reste ne serait qu''un déplacement de déchet à sept mille kilomètres.',
    null,
    null,
    'publie',
    '2025-04-02',
    'L''équipe de collecte'
  ),
  (
    'demo-retour-lycee-bonsomi-six-mois-apres',
    'Lycée Bonsomi, six mois après : ce que la salle est devenue',
    'Nous sommes repassés au lycée Bonsomi en mai, six mois après l''installation. Vingt et un postes sur vingt-quatre fonctionnent encore.',
    'Nous tenons à repasser dans chaque structure quelques mois après une livraison. Sans ce retour, nous ne saurions pas si notre travail sert vraiment, et les entreprises donatrices non plus.

Au lycée Bonsomi, vingt et un des vingt-quatre postes installés en novembre fonctionnent encore. Deux alimentations ont lâché, une unité centrale ne démarre plus. Le professeur de technologie a récupéré les composants encore bons sur la machine morte, ce qui lui a permis de réparer l''une des deux autres. C''est exactement ce que nous espérions en formant deux enseignants à la maintenance de premier niveau.

Les trois onduleurs se sont révélés déterminants. Le quartier subit plusieurs coupures par semaine, dont certaines en pleine séance. Sans eux, les extinctions brutales auraient probablement coûté plusieurs disques dès le premier trimestre.

Le point faible est ailleurs : la connexion internet, prévue lors du montage du projet, n''a jamais été installée. Les cours portent donc sur la bureautique et l''algorithmique hors ligne. C''est utile, mais moins que ce qui était envisagé. Nous cherchons actuellement une solution avec la direction de l''établissement.

Nous transmettons ce compte rendu à l''entreprise qui a donné les machines. Elle nous a demandé si elle pouvait le citer dans son rapport RSE. C''est précisément à cela que servent ces retours.',
    null,
    null,
    'publie',
    '2025-05-28',
    'L''équipe de collecte'
  )
on conflict (slug) do nothing;


-- =============================================================================
--  NETTOYAGE — supprimer tout le contenu de démonstration
-- =============================================================================
--  Décommentez les deux lignes ci-dessous et exécutez-les pour retirer d'un
--  coup l'ensemble des fiches de démonstration (elles commencent toutes par
--  « demo- »). Vos propres contenus ne sont pas concernés.
--
--    delete from public.projets  where slug like 'demo-%';
--    delete from public.articles where slug like 'demo-%';
--
--  Vous pouvez aussi les supprimer une par une depuis le back-office, ce qui
--  est plus sûr si vous avez un doute.
-- =============================================================================
