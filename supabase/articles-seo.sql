-- =============================================================================
--  Articles du blog — 21 nouveaux, 3 réécrits, 2 articles de test supprimés
-- =============================================================================
--
--  À exécuter UNE fois : Dashboard Supabase > SQL Editor > New query >
--  collez tout ce fichier > Run.
--
--  Sans risque si vous le rejouez :
--    - un article déjà présent (même slug) n'est pas recréé ;
--    - les 3 articles réécrits ne le sont que s'ils portent encore leur titre
--      d'origine : un article déjà réécrit, ou modifié dans le back-office,
--      n'est jamais écrasé.
--
--  Les articles marqués « brouillon » contiennent des passages [À COMPLÉTER] :
--  complétez-les dans le back-office, puis publiez-les.
-- =============================================================================

begin;

-- 1. Suppression des articles de test --------------------------------------
delete from public.articles
where slug in ('test-appel-aux-dons', 'test-convoi-septembre');

-- 2. Réécriture des articles existants --------------------------------------
update public.articles set
  titre   = $art$Effacer les données avant de donner ses ordinateurs (RGPD)$art$,
  extrait = $art$Formater un disque ne suffit pas. Ce que le RGPD impose à une entreprise qui se sépare de ses ordinateurs, les méthodes d'effacement fiables (disques durs et SSD) et la preuve à conserver.$art$,
  contenu = $art$La première inquiétude d'une entreprise qui donne ou revend ses ordinateurs, c'est le sort de ses données. Elle est légitime : un disque mal effacé peut livrer des fichiers clients, des documents RH ou des mots de passe. Voici ce que dit la réglementation et comment s'y prendre.

## Que dit le RGPD ?

Le RGPD impose à toute entreprise qui traite des données personnelles de les protéger pendant tout leur cycle de vie, y compris quand le matériel qui les contient quitte l'entreprise. Si un ordinateur donné ou revendu laisse fuiter des données, c'est l'entreprise qui en reste responsable.

La CNIL range d'ailleurs l'effacement des données de tout matériel avant sa mise au rebut ou sa cession parmi les mesures de sécurité de base, dans son guide de la sécurité des données personnelles. Elle publie aussi une fiche pratique pour [effacer ses données avant de se séparer d'un appareil](https://cnil.fr/fr/effacer-ses-donnees-dun-ordinateur-dun-telephone-ou-dune-tablette-avant-de-sen-separer).

## Pourquoi supprimer les fichiers ou formater ne suffit pas

Supprimer un fichier, vider la corbeille ou formater un disque ne fait qu'effacer l'index qui permet de retrouver les données. Les données elles-mêmes restent sur le disque, et des logiciels de récupération accessibles à tous peuvent les reconstituer.

## Les méthodes d'effacement fiables

- **Pour un disque dur classique (HDD)** : un logiciel d'effacement réécrit toute la surface du disque avec des données aléatoires ou nulles, en une ou plusieurs passes. Les données d'origine deviennent alors irrécupérables.
- **Pour un SSD** : la réécriture classique est moins fiable, à cause de la façon dont ces disques répartissent les données. On utilise plutôt la commande d'effacement sécurisé prévue par le fabricant, ou l'effacement cryptographique si le disque était chiffré.
- **La destruction physique** (broyage, perçage) : c'est la solution radicale pour les supports les plus sensibles, ou ceux qui ne fonctionnent plus et ne peuvent donc pas être effacés.

N'oubliez pas les autres supports : clés USB, cartes mémoire, disques externes, mais aussi les imprimantes multifonctions et les copieurs, qui conservent souvent une copie des documents traités.

## Quelle preuve conserver ?

En cas de contrôle ou d'incident, vous devez pouvoir montrer que les données ont bien été effacées. Conservez :

- l'inventaire des machines cédées, avec leurs numéros de série ;
- le certificat d'effacement ou de destruction, qui indique la méthode utilisée pour chaque support ;
- le document de remise du matériel (inventaire signé, attestation de don).

## Comment Respusse traite vos supports

Chez Respusse, l'effacement des données est la première étape du parcours, avant tout reconditionnement :

- chaque équipement est testé, puis ses supports de stockage sont effacés par une procédure d'écrasement en plusieurs passes ;
- si vous le préférez, les supports sont détruits physiquement ;
- un certificat d'effacement est joint à l'inventaire du lot, signé lors de l'enlèvement.

Vous disposez ainsi d'une preuve écrite, directement exploitable dans votre démarche de conformité. Ce n'est qu'une fois cette étape franchie que le matériel poursuit son chemin vers les écoles et associations qui en ont besoin.

## En résumé

- Ne cédez jamais un ordinateur après un simple formatage.
- Adaptez la méthode au type de disque : réécriture pour un HDD, effacement sécurisé constructeur pour un SSD, destruction pour les supports sensibles ou en panne.
- Exigez et conservez un certificat d'effacement.

Pour en savoir plus sur le parcours complet d'un don, consultez [Comment ça marche](/comment-ca-marche), ou [proposez-nous votre matériel](/contact?profil=entreprise).$art$
where slug = 'effacement-des-donnees' and titre = $art$Effacement des données : ce que deviennent vos disques$art$;

update public.articles set
  titre   = $art$Pourquoi donner son ordinateur plutôt que le recycler ?$art$,
  extrait = $art$L'essentiel de l'impact environnemental d'un ordinateur vient de sa fabrication. Le recycler ne récupère qu'une partie des matières ; le réemployer évite d'en fabriquer un neuf.$art$,
  contenu = $art$Chaque année, des milliers d'ordinateurs encore fonctionnels quittent les entreprises françaises qui renouvellent leur parc. Beaucoup partent au recyclage alors qu'ils ont encore plusieurs années d'usage devant eux. Pourquoi est-ce dommage, et pourquoi le réemploi fait-il une vraie différence ?

## D'où vient l'impact environnemental d'un ordinateur ?

On pense souvent à la consommation électrique. En réalité, l'essentiel de l'impact se joue avant même la première mise sous tension : extraction des métaux, fabrication des composants, assemblage, transport.

L'étude menée par l'ADEME et l'Arcep sur l'empreinte environnementale du numérique en France l'a confirmé : la fabrication représente environ 78 % de l'empreinte carbone du numérique, et les terminaux (ordinateurs, écrans, smartphones, télévisions…) en sont la première source. [Lire la synthèse de l'étude ADEME-Arcep](https://www.arcep.fr/uploads/tx_gspublication/etude-numerique-environnement-ademe-arcep-volet02-synthese_janv2022.pdf).

Autrement dit : le geste le plus efficace n'est pas d'économiser l'énergie d'un ordinateur, c'est de le faire durer.

## Recycler, ce n'est pas suffisant

Le recyclage est indispensable pour le matériel hors d'usage. Mais il a ses limites :

- il ne récupère qu'une partie des matières d'un appareil ;
- il consomme lui-même de l'énergie et des procédés industriels ;
- surtout, il détruit l'objet : il faudra fabriquer un ordinateur neuf pour le remplacer, avec tout l'impact que cela suppose.

C'est pour cela que la loi place le réemploi avant le recyclage dans la hiérarchie des modes de traitement des déchets. Pour le détail réglementaire, voir [les obligations des entreprises face aux DEEE](/actualites/deee-obligations-entreprises).

## Le réemploi : un ordinateur qui sert deux fois

Un ordinateur de quelques années, devenu trop lent pour les logiciels d'une entreprise, reste parfaitement adapté à de nombreux usages : traitement de texte, initiation à l'informatique, recherche documentaire, gestion administrative. Pour une école ou une association qui n'a pas de budget d'équipement, il change tout.

Réemployer, ce n'est donc pas se débarrasser autrement. C'est prolonger la vie d'un matériel et lui donner une seconde utilité, là où elle compte le plus.

## Ce que fait Respusse de votre matériel

En confiant votre matériel à Respusse, vous évitez un déchet, vous sécurisez vos données et vous donnez à une école, une mairie ou une association les moyens de travailler, en France ou au Congo.

- Le matériel est testé, et les données effacées ou les disques détruits.
- Ce qui fonctionne est redistribué aux structures qui en ont besoin.
- Ce qui se répare est confié à des ateliers à Kinshasa, où des jeunes apprennent le métier : voir [réparer devient un métier](/actualites/reparer-devient-un-metier).
- Ce qui ne peut pas être réemployé part dans une filière de recyclage agréée.

Le geste est simple de votre côté : vous nous signalez le lot, nous organisons l'enlèvement, l'effacement des données et l'acheminement. Vous recevez un inventaire, puis un compte rendu d'usage.

[Proposez-nous votre matériel](/contact?profil=entreprise), ou découvrez [le parcours complet d'un don](/comment-ca-marche).$art$
where slug = 'pourquoi-donner-plutot-que-jeter' and titre = $art$Pourquoi donner votre matériel plutôt que le jeter$art$;

update public.articles set
  titre   = $art$Kinshasa : des jeunes formés à la réparation informatique$art$,
  extrait = $art$Le matériel endommagé n'est pas perdu : confié à des recycleries de Kinshasa, il devient un support d'apprentissage pour des jeunes qui se forment au métier de technicien informatique.$art$,
  contenu = $art$Tout le matériel collecté n'arrive pas en parfait état. Un écran fissuré, un disque défaillant, une alimentation grillée : ailleurs, ces appareils finiraient à la benne. Chez Respusse, nous en faisons une ressource, et une porte d'entrée vers un métier.

## Des recycleries comme ateliers de formation

Une partie du matériel endommagé est confiée à des recycleries partenaires à Kinshasa. Des jeunes y apprennent à :

- diagnostiquer une panne ;
- démonter un appareil et identifier les pièces défectueuses ;
- remplacer les composants, en récupérant les pièces sur d'autres appareils irréparables ;
- tester le matériel remis en état avant qu'il reparte.

On ne se forme pas sur des exercices théoriques, mais sur du vrai matériel, qui repartira ensuite équiper une école ou une association. Chaque réparation devient un atelier.

## Pourquoi la réparation est un métier d'avenir au Congo

À mesure que les ordinateurs, les téléphones et les équipements électroniques se diffusent, le besoin de personnes capables de les entretenir et de les réparer grandit. C'est un savoir-faire concret, utile partout, qui permet de travailler à son compte ou dans une structure.

C'est aussi une condition pour que le matériel donné dure : une salle informatique a besoin de techniciens à proximité pour rester en service.

## Moins de déchets, plus d'usages

La réparation locale prolonge la vie d'appareils qui auraient sinon été perdus. Elle évite d'importer du matériel neuf pour remplacer ce qui peut être remis en état. C'est la même logique que le réemploi en France : faire durer plutôt que remplacer. Voir [pourquoi donner plutôt que jeter](/actualites/pourquoi-donner-plutot-que-jeter).

## Vers un centre de formation

C'est le prolongement naturel de notre démarche : un centre de formation aux métiers de l'informatique est en train de voir le jour, pour aller plus loin que la réparation et former davantage de jeunes. Découvrez ce projet sur notre page [Nos services](/services#formation).

## Ce que cela change pour les donateurs

Si vous êtes une entreprise, même votre matériel en panne peut avoir une utilité : ce qui se répare part en atelier. Indiquez simplement l'état de chaque lot quand vous nous contactez. Nous vous dirons sous 72 heures ce qui est réemployable, réparable, ou à orienter vers le recyclage.

[Proposer du matériel](/contact?profil=entreprise) · [En savoir plus sur la réparation](/services#reparation)$art$
where slug = 'reparer-devient-un-metier' and titre = $art$À Kinshasa, réparer devient un métier$art$;

-- 3. Nouveaux articles ------------------------------------------------------
insert into public.articles (slug, titre, extrait, contenu, statut, date_publication, auteur)
values
  (
    'que-faire-des-vieux-ordinateurs-de-son-entreprise',
    $art$Que faire des vieux ordinateurs de son entreprise ?$art$,
    $art$Revente, recyclage, don à une association… Voici les solutions pour se séparer des ordinateurs de votre entreprise en toute légalité, sans risque pour vos données et sans les jeter.$art$,
    $art$Un renouvellement de parc, un déménagement, des postes qui s'accumulent dans un placard : tôt ou tard, chaque entreprise doit décider quoi faire de ses anciens ordinateurs. Les jeter n'est pas une option, ni légalement ni écologiquement. Il existe plusieurs solutions, qui ne se valent pas.

## Peut-on jeter les ordinateurs d'une entreprise ?

Non. Un ordinateur en fin de vie est un déchet d'équipement électrique et électronique (DEEE). Il ne peut pas partir avec les ordures ou les encombrants : l'entreprise qui le détient doit s'assurer qu'il rejoint une filière de traitement adaptée. Nous détaillons ces règles dans notre article sur [les obligations des entreprises face aux DEEE](/actualites/deee-obligations-entreprises).

Surtout, un ordinateur jeté avec son disque dur, c'est aussi un risque : celui de voir des données de l'entreprise, de ses clients ou de ses salariés tomber entre de mauvaises mains.

## Les quatre solutions possibles

- **La revente** à un racheteur spécialisé ou à vos salariés. Elle rapporte un peu, mais demande du temps (inventaire, effacement, logistique) et ne vaut que pour du matériel récent.
- **La reprise par le fournisseur** lors de l'achat d'un nouveau parc. Pratique, mais le matériel repris est souvent recyclé plutôt que réemployé.
- **Le recyclage** via une filière agréée. C'est la bonne solution pour le matériel hors d'usage, mais un ordinateur qui fonctionne encore perd alors toute sa valeur d'usage.
- **Le don à une association**, qui remet le matériel en service auprès de structures qui en ont besoin. C'est la solution qui prolonge le plus la durée de vie des équipements.

## Pourquoi le don est souvent la meilleure option

La plus grande partie de l'impact environnemental d'un ordinateur vient de sa fabrication, pas de son utilisation. Faire durer un poste quelques années de plus évite donc d'en fabriquer un neuf ailleurs. Nous l'expliquons en détail dans [réemploi ou recyclage : pourquoi donner plutôt que jeter](/actualites/pourquoi-donner-plutot-que-jeter).

Le don a aussi des avantages très concrets pour l'entreprise :

- l'enlèvement est pris en charge, sans frais ;
- les données sont effacées ou les disques détruits, avec un certificat à la clé ;
- vous recevez un inventaire et une attestation de don, utiles pour votre [rapport RSE](/actualites/don-de-materiel-rapport-rse) ;
- vous savez ce que devient votre matériel, au lieu de le perdre de vue.

## Comment se passe un don avec Respusse

Respusse collecte le matériel des entreprises partout en France et le redistribue à des écoles, mairies et associations, en France et au Congo. Concrètement :

- vous nous envoyez une liste, même approximative, du matériel ;
- sous 72 heures, nous vous disons ce qui est réemployable et ce qui part au recyclage ;
- notre équipe vient enlever le lot sur place, étage compris, sans rien à préparer de votre côté ;
- chaque support de stockage est effacé par écrasement multi-passes, ou détruit à votre demande ;
- quelques mois plus tard, vous recevez des photos et un compte rendu : qui a reçu votre matériel et à quoi il sert.

Le détail de chaque étape est présenté sur notre page [Comment ça marche](/comment-ca-marche).

## Et le matériel trop ancien ou en panne ?

Tout ne peut pas être réemployé. Nous ne prenons pas le matériel hors d'usage, les écrans cathodiques ni les batteries gonflées. Ce qui se répare part en atelier, et ce qui ne peut pas l'être est orienté vers une filière de recyclage agréée : vous n'êtes jamais laissé sans solution.

Vous avez des postes, des écrans ou des imprimantes dont vous voulez vous séparer ? [Décrivez-nous votre lot](/contact?profil=entreprise) : nous vous répondons sous 72 heures.$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'don-materiel-informatique-entreprise-association',
    $art$Don de matériel informatique d'entreprise : mode d'emploi$art$,
    $art$Comment une entreprise peut-elle donner ses ordinateurs à une association ? Les étapes, les documents à obtenir, les précautions à prendre pour les données et les questions à poser avant de choisir.$art$,
    $art$Donner son matériel informatique à une association est une démarche simple, à condition de bien la préparer. Voici comment procéder, étape par étape, et ce qu'il faut vérifier avant de confier votre parc.

## Une entreprise a-t-elle le droit de donner son matériel ?

Oui. Une entreprise peut librement céder gratuitement des biens qui lui appartiennent, y compris du matériel déjà amorti. Le don est même encouragé : il prolonge la vie des équipements, conformément à la priorité donnée au réemploi par le Code de l'environnement.

Deux points demandent toutefois de l'attention : la sécurité des données présentes sur les machines, et la traçabilité du don (ce qui a été donné, à qui, et ce qu'il est devenu).

## Étape 1 : faire l'inventaire du matériel

Listez ce dont vous voulez vous séparer : type d'équipement, quantité, âge approximatif et état (fonctionnel, en panne, incomplet). Une liste approximative suffit pour un premier contact. L'association vous dira ce qu'elle peut reprendre. Pour savoir à quoi vous attendre, consultez notre article [quel matériel peut-on donner ?](/actualites/quel-materiel-informatique-donner).

## Étape 2 : régler la question des données

C'est le point le plus important. Un simple formatage ne suffit pas : les données restent récupérables. Les supports doivent être effacés de façon sécurisée, ou détruits. Avant de choisir une association, demandez-lui :

- quelle méthode d'effacement elle applique ;
- si elle peut détruire physiquement les disques à votre demande ;
- si elle vous remet un certificat d'effacement.

Nous détaillons les obligations et les bonnes pratiques dans [effacer les données avant de donner ses ordinateurs](/actualites/effacement-des-donnees).

## Étape 3 : organiser l'enlèvement

Selon les associations, vous devrez déposer le matériel ou elles viendront le chercher. Vérifiez qui assure la manutention, si l'intervention en étage est possible et s'il y a des frais. Chez Respusse, l'enlèvement est gratuit, partout en France, et notre équipe assure le chargement.

## Étape 4 : obtenir les bons documents

Pour garder une trace du don et pouvoir le valoriser, demandez :

- un **inventaire signé** à l'enlèvement, qui liste précisément le matériel remis ;
- une **attestation de don** ;
- le **certificat d'effacement** des données ;
- si l'association y est habilitée, un **reçu fiscal**. Le don peut alors ouvrir droit à une réduction d'impôt au titre du mécénat en nature : faites valider le calcul par votre expert-comptable.

## Étape 5 : suivre ce que devient le matériel

Un don sérieux ne s'arrête pas à l'enlèvement. Demandez à l'association comment elle vous rendra compte de l'usage du matériel. Respusse vous envoie, quelques mois après la livraison, des photos et un compte rendu indiquant quelle structure a reçu votre matériel et à quoi il sert. Nos projets terminés sont aussi publiés dans nos [réalisations](/realisations).

## Comment choisir l'association ?

Posez-vous ces questions :

- l'association remet-elle vraiment le matériel en service, ou le revend-elle en lot ?
- a-t-elle une procédure d'effacement des données documentée ?
- que fait-elle du matériel qu'elle ne peut pas réemployer ?
- vous tiendra-t-elle informé de l'usage final ?

Chez Respusse, le matériel est testé, effacé puis redistribué à des écoles, mairies et associations, en France et au Congo. Ce qui se répare est confié à des ateliers où des jeunes apprennent le métier, et ce qui ne peut pas être réemployé part dans une filière de recyclage agréée.

Votre entreprise renouvelle son parc ? [Proposez-nous votre matériel](/contact?profil=entreprise) : nous vous répondons sous 72 heures.$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'deee-obligations-entreprises',
    $art$DEEE : quelles obligations pour les entreprises ?$art$,
    $art$Ordinateurs, écrans, imprimantes en fin de vie sont des DEEE. Ce que la loi impose à l'entreprise qui les détient, la place du réemploi et les preuves à conserver.$art$,
    $art$Ordinateurs, écrans, imprimantes, onduleurs, câbles : dès qu'une entreprise s'en sépare, ces équipements relèvent des règles sur les déchets d'équipements électriques et électroniques, les DEEE. Voici l'essentiel à connaître pour rester dans les clous.

## Qu'est-ce qu'un DEEE professionnel ?

Un DEEE est un équipement fonctionnant à l'électricité ou avec des piles et batteries, devenu un déchet. On parle de DEEE professionnels pour ceux qui ont été utilisés dans un cadre professionnel : parc informatique, matériel de bureau, équipements techniques.

Ces déchets contiennent à la fois des matières valorisables (métaux, plastiques) et des composants polluants. C'est pourquoi ils ne doivent jamais finir avec les ordures ou dans une benne de chantier.

## Quelles sont les obligations de l'entreprise ?

L'entreprise qui détient des équipements usagés en est responsable jusqu'à leur traitement final. Concrètement, elle doit :

- ne pas jeter ses équipements avec les déchets ordinaires ;
- les confier à une filière capable de les traiter : éco-organisme agréé, collecteur ou prestataire spécialisé ;
- conserver une preuve de leur prise en charge (bordereau, attestation de collecte) ;
- s'assurer, avant de s'en séparer, que les données qu'ils contiennent ont été effacées.

Les éco-organismes agréés pour les DEEE professionnels organisent des solutions de collecte, souvent sans frais pour l'entreprise selon les volumes et les équipements concernés. Renseignez-vous auprès d'eux ou de votre fournisseur de matériel.

## Le réemploi passe avant le recyclage

Le Code de l'environnement fixe une hiérarchie : on doit d'abord éviter de produire des déchets, puis préparer les équipements en vue de leur réemploi, et seulement ensuite les recycler. Un ordinateur qui fonctionne encore n'a donc rien à faire au recyclage : le donner pour qu'il serve à nouveau est la voie que la réglementation encourage.

Un équipement donné en état de marche, pour être utilisé tel quel ou après remise en état, continue sa vie d'équipement. C'est seulement le matériel réellement hors d'usage qui doit partir dans la filière de traitement.

## Comment rester en règle en donnant son matériel

Le don à une association qui fait du réemploi permet de respecter la hiérarchie des déchets, à condition de choisir une structure sérieuse. Vérifiez qu'elle :

- trie le matériel et vous dit clairement ce qu'elle reprend ;
- oriente vers une filière agréée ce qui ne peut pas être réemployé ;
- vous remet un inventaire signé du matériel enlevé ;
- efface les données et vous en donne la preuve.

C'est exactement le fonctionnement de Respusse. Sous 72 heures, nous vous disons ce qui est réemployable et ce qui part au recyclage. Nous ne prenons ni les écrans cathodiques, ni les batteries gonflées, ni le matériel hors d'usage : dans ce cas, nous vous orientons vers une filière agréée plutôt que de vous laisser sans solution. Le matériel réemployable est testé, effacé, puis redistribué à des écoles et associations, en France et au Congo.

## En résumé

- Les équipements informatiques usagés d'une entreprise sont des DEEE professionnels.
- L'entreprise reste responsable de leur devenir et doit pouvoir le prouver.
- Le réemploi est prioritaire sur le recyclage : un matériel qui fonctionne doit d'abord servir à nouveau.

Pour aller plus loin, lisez [que faire des vieux ordinateurs de son entreprise ?](/actualites/que-faire-des-vieux-ordinateurs-de-son-entreprise), ou [proposez-nous directement votre lot](/contact?profil=entreprise).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'don-de-materiel-rapport-rse',
    $art$Don de matériel informatique : le valoriser dans votre rapport RSE$art$,
    $art$Un don d'ordinateurs est une action RSE concrète, à la fois environnementale et sociale. Comment la documenter, quels indicateurs suivre et quelles pièces demander à l'association.$art$,
    $art$Donner son matériel informatique plutôt que le recycler ou le stocker est l'une des actions RSE les plus concrètes qu'une entreprise puisse mener. Encore faut-il pouvoir la documenter. Voici comment en faire un élément solide de votre démarche de responsabilité sociétale.

## Pourquoi un don de matériel compte en RSE

Un don de matériel touche plusieurs piliers de la RSE en même temps :

- **l'environnement** : prolonger la durée de vie d'un ordinateur évite d'en fabriquer un neuf, et c'est la fabrication qui pèse le plus dans l'empreinte du numérique (voir [pourquoi donner plutôt que jeter](/actualites/pourquoi-donner-plutot-que-jeter)) ;
- **le social et le sociétal** : le matériel équipe des écoles, des mairies et des associations qui n'auraient pas pu l'acheter ;
- **la gouvernance** : la gestion de fin de vie du parc, la sécurité des données et la traçabilité montrent une gestion responsable des actifs.

## Les pièces à obtenir pour documenter le don

Une action RSE n'a de valeur que si elle est vérifiable. Demandez à l'association qui reçoit votre matériel :

- un **inventaire signé** du lot enlevé (types d'équipements, quantités) ;
- une **attestation de don** ;
- le **certificat d'effacement** des données ;
- un **compte rendu d'usage** : quelle structure a reçu le matériel, où, et à quoi il sert ;
- si possible, des **photos** du matériel en service.

Chez Respusse, vous recevez l'inventaire signé et l'attestation de don à l'enlèvement. Quelques mois après la livraison, nous vous adressons des photos et un compte rendu indiquant qui a reçu votre matériel et à quoi il sert. Ces pièces sont directement exploitables dans votre rapport.

## Quels indicateurs suivre ?

Quelques indicateurs simples suffisent à rendre l'action lisible d'une année sur l'autre :

- nombre d'équipements donnés, par type (portables, fixes, écrans…) ;
- part du parc renouvelé qui part en réemploi plutôt qu'au recyclage ;
- nombre de structures bénéficiaires et pays concernés ;
- nombre de supports de stockage effacés ou détruits, avec certificat.

Pour l'impact environnemental, restez prudent : n'annoncez pas de chiffres d'émissions évitées que vous ne pouvez pas justifier. Mieux vaut un indicateur simple et vérifiable (nombre d'équipements réemployés) qu'un calcul fragile.

## Comment le présenter dans le rapport

Racontez l'action comme une chaîne complète, de la collecte à l'usage :

- le contexte : renouvellement du parc, déménagement, fin de projet ;
- la démarche : choix d'une association de réemploi, effacement certifié des données ;
- le résultat : nombre d'équipements, structures équipées, témoignages ou photos ;
- la suite : un partenariat sur la durée, à chaque renouvellement.

Un récit concret, appuyé par des pièces, convainc bien plus qu'une mention générale du type « nous recyclons notre matériel ».

## Faire du don une démarche régulière

L'impact est plus fort quand le don devient systématique. Si votre entreprise renouvelle son parc régulièrement, Respusse met en place un calendrier d'enlèvements et un interlocuteur unique : chaque renouvellement alimente directement votre démarche RSE.

Envie de donner votre prochain lot ? [Contactez-nous](/contact?profil=entreprise), ou découvrez [nos services aux entreprises](/services).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'don-materiel-reduction-impot-mecenat-en-nature',
    $art$Don de matériel et réduction d'impôt : le mécénat en nature expliqué$art$,
    $art$Une entreprise qui donne du matériel à une association peut-elle réduire son impôt ? Conditions, taux, plafonds, valorisation du matériel et reçu fiscal : l'essentiel du mécénat en nature.$art$,
    $art$Une entreprise qui donne du matériel informatique à une association peut, sous conditions, bénéficier d'une réduction d'impôt : c'est le mécénat en nature. Voici comment il fonctionne et les points à vérifier avant de compter dessus.

## Qu'est-ce que le mécénat en nature ?

Le mécénat d'entreprise ne se limite pas aux dons d'argent. Une entreprise peut aussi donner des biens (matériel, mobilier, marchandises) ou mettre à disposition des compétences. Ces dons ouvrent droit à la même réduction d'impôt que les dons financiers, prévue par l'article 238 bis du Code général des impôts.

## Quelles conditions pour bénéficier de la réduction ?

- **L'organisme bénéficiaire doit être éligible** : en pratique, un organisme d'intérêt général, à but non lucratif, à gestion désintéressée, dont l'activité entre dans le champ prévu par la loi.
- **Le don doit être fait sans contrepartie**, ou avec une contrepartie très disproportionnée par rapport à sa valeur.
- **L'entreprise doit pouvoir justifier le don**, notamment par un reçu fiscal délivré par l'organisme.

Toutes les associations ne peuvent pas délivrer de reçu fiscal : vérifiez-le avant le don, et non après.

## Combien peut-on déduire ?

La réduction d'impôt est en principe égale à 60 % de la valeur du don, dans la limite de 20 000 € ou de 0,5 % du chiffre d'affaires hors taxe lorsque ce montant est plus élevé. Au-delà de 2 millions d'euros de dons dans l'année, le taux passe à 40 % pour la fraction qui dépasse. La part qui excède le plafond peut être reportée sur les cinq exercices suivants.

Ces règles évoluent : vérifiez les taux et plafonds en vigueur pour l'année de votre don.

## Comment valoriser du matériel donné ?

C'est le point le plus technique. La valeur à retenir dépend de la façon dont le bien figure dans vos comptes :

- **pour un bien inscrit en stock**, la valeur retenue est en principe sa valeur en comptabilité ;
- **pour un bien immobilisé**, comme les ordinateurs du parc de l'entreprise, le don est en principe valorisé à sa valeur vénale au jour du don, ce qui constate dans le même temps une plus- ou moins-value de cession.

Pour du matériel ancien, la valeur vénale peut être faible. Les règles comportent des subtilités et la doctrine fiscale (BOFiP) les détaille : faites valider la valorisation par votre expert-comptable avant de déclarer la réduction.

## Les justificatifs à conserver

- le reçu fiscal délivré par l'organisme bénéficiaire ;
- l'inventaire détaillé du matériel donné ;
- la méthode de valorisation retenue et ses justificatifs ;
- la convention de don, si vous en avez signé une.

## Et avec Respusse ?

Chez Respusse, vous recevez à l'enlèvement un inventaire détaillé signé et une attestation de don. [À COMPLÉTER : préciser si l'association délivre des reçus fiscaux ouvrant droit à la réduction d'impôt.] Posez-nous la question lors de votre premier contact : nous vous dirons quels documents nous pouvons vous remettre pour votre lot.

[Proposez-nous votre matériel](/contact?profil=entreprise), ou lisez notre [mode d'emploi du don de matériel informatique](/actualites/don-materiel-informatique-entreprise-association).

Cet article donne des informations générales et ne remplace pas l'avis d'un expert-comptable.$art$,
    'brouillon',
    null,
    $art$L'équipe Respusse$art$
  ),
  (
    'renouvellement-parc-informatique-seconde-vie',
    $art$Renouvellement du parc informatique : que faire de l'ancien matériel ?$art$,
    $art$Vous renouvelez vos postes de travail ? Comment anticiper la sortie de l'ancien matériel, sécuriser les données et lui offrir une seconde vie plutôt que de le stocker ou de le recycler.$art$,
    $art$Le renouvellement du parc informatique se prépare souvent avec soin du côté du nouveau matériel : choix des modèles, commande, déploiement. La sortie de l'ancien matériel est plus souvent oubliée. Résultat : des postes qui s'entassent dans un local pendant des mois. Voici comment l'anticiper.

## Anticiper la sortie de l'ancien parc dès le projet

Intégrez la fin de vie de l'ancien matériel au planning du renouvellement :

- **listez les équipements qui sortent** : nombre, modèles, âge, état ;
- **fixez une date de libération** des locaux ou des espaces de stockage ;
- **choisissez la filière** (don, revente, recyclage) avant l'arrivée du nouveau matériel ;
- **prévoyez l'effacement des données** dans le processus de migration.

Plus la décision est prise tôt, plus le matériel a de valeur d'usage : un ordinateur stocké deux ans dans un placard n'intéresse plus grand monde.

## Ne pas oublier la question des données

La migration vers les nouveaux postes est le bon moment pour traiter les anciens supports. Une fois les données transférées et vérifiées, les anciens disques doivent être effacés de façon sécurisée, ou détruits. Un simple formatage ne suffit pas. Nous détaillons les méthodes fiables dans [effacer les données avant de donner ses ordinateurs](/actualites/effacement-des-donnees).

## Donner, revendre ou recycler ?

- **Le matériel récent et de bonne gamme** peut se revendre, si vous avez le temps de gérer la vente.
- **Le matériel fonctionnel mais déprécié**, qui ne se revend presque plus, est idéal pour le don : il garde toute sa valeur pour une école ou une association.
- **Le matériel hors d'usage** doit rejoindre une filière de recyclage agréée.

Le don a un avantage particulier dans un projet de renouvellement : il ne demande presque aucune charge de travail à vos équipes. L'association vient chercher le matériel, l'efface et vous remet les documents.

## Faire du don une routine à chaque renouvellement

Beaucoup d'entreprises renouvellent leurs postes par vagues, tous les trois à cinq ans, ou en continu au fil des remplacements. Dans les deux cas, un partenariat durable simplifie tout.

Chez Respusse, si votre entreprise renouvelle son parc régulièrement, nous mettons en place un calendrier d'enlèvements et un interlocuteur unique. Notre équipe intervient partout en France, étage compris, et assure le chargement : rien à préparer de votre côté. Chaque lot fait l'objet d'un inventaire signé, d'un certificat d'effacement et d'une attestation de don.

## Ce que devient votre ancien parc

Le matériel est testé, effacé, puis redistribué à des écoles, mairies et associations, en France et au Congo. Ce qui se répare part en atelier, où des jeunes apprennent le métier. Quelques mois après la livraison, vous recevez des photos et un compte rendu d'usage : de quoi illustrer votre [rapport RSE](/actualites/don-de-materiel-rapport-rse).

Vous préparez un renouvellement ? [Parlez-nous de votre projet](/contact?profil=entreprise) dès maintenant : nous vous répondons sous 72 heures.$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'demenagement-bureaux-que-faire-du-materiel',
    $art$Déménagement de bureaux : que faire du mobilier et du matériel ?$art$,
    $art$Un déménagement ou une fermeture de site laisse souvent derrière lui ordinateurs, écrans et mobilier. Comment trier, à qui donner, et quoi faire pour libérer les locaux à temps.$art$,
    $art$Un déménagement d'entreprise, un regroupement de sites ou une fin de bail laissent presque toujours derrière eux du matériel dont personne ne veut dans les nouveaux locaux : ordinateurs, écrans, imprimantes, mobilier. Avec une contrainte forte : les anciens locaux doivent être libérés à une date précise. Voici comment s'organiser.

## Trier tôt : ce qui part, ce qui reste

Faites l'inventaire dès que le déménagement est décidé, et classez chaque équipement :

- **ce qui déménage** avec vous ;
- **ce qui peut servir ailleurs** : matériel fonctionnel, mobilier en bon état ;
- **ce qui est hors d'usage** et doit partir au recyclage.

Ce tri précoce est la clé : il laisse le temps de trouver un repreneur pour le matériel réemployable, au lieu de tout envoyer à la benne la dernière semaine.

## Le matériel informatique : attention aux données

Les ordinateurs, serveurs, copieurs et disques qui ne déménagent pas contiennent souvent des données de l'entreprise. Avant de vous en séparer, faites-les effacer de façon sécurisée, ou détruire les supports. Exigez un certificat. Tout est expliqué dans [effacer les données avant de donner ses ordinateurs](/actualites/effacement-des-donnees).

Le matériel informatique hors d'usage est un déchet électronique (DEEE) : il doit rejoindre une filière agréée, pas une benne de chantier. Voir [les obligations des entreprises face aux DEEE](/actualites/deee-obligations-entreprises).

## Le mobilier : réemploi d'abord

Bureaux, chaises, armoires et caissons en bon état peuvent être donnés à des associations, des ressourceries ou des structures du réemploi de mobilier professionnel. Le mobilier hors d'usage relève lui aussi d'une filière de collecte spécifique : renseignez-vous auprès de votre fournisseur ou de l'éco-organisme compétent.

Respusse accepte notamment le mobilier scolaire. Pour le mobilier de bureau, décrivez-nous ce que vous avez : nous vous dirons sous 72 heures ce que nous pouvons reprendre.

## Respecter la date de libération des locaux

C'est souvent la vraie difficulté. Pour ne pas être pris de court :

- contactez les repreneurs plusieurs semaines avant la date butoir ;
- donnez-leur la date limite de libération dès le premier échange ;
- vérifiez qui assure la manutention et si l'intervention en étage est possible ;
- prévoyez une solution de recyclage pour ce qui ne sera pas repris.

Chez Respusse, notre équipe se déplace partout en France, étage compris, au créneau convenu avec vous. Elle assure la manutention et le chargement : rien à préparer de votre côté.

## Les documents à garder

- l'inventaire signé de ce qui a été enlevé ;
- les certificats d'effacement des supports de stockage ;
- l'attestation de don ;
- les preuves de prise en charge du matériel parti au recyclage.

## Donner du sens à un déménagement

Un déménagement est souvent vécu comme une contrainte logistique. Le matériel laissé derrière peut pourtant équiper une salle de classe ou une association. Chez Respusse, il est redistribué à des écoles, mairies et associations, en France et au Congo, et vous recevez quelques mois plus tard des photos et un compte rendu d'usage.

Vous préparez un déménagement ? [Indiquez-nous la nature du matériel et la date de libération des locaux](/contact?profil=entreprise).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'quel-materiel-informatique-donner',
    $art$Quel matériel informatique peut-on donner à une association ?$art$,
    $art$Ordinateurs portables et fixes, écrans, imprimantes, matériel réseau, onduleurs, mobilier scolaire… Ce qui est accepté, ce qui ne l'est pas, et comment savoir avant de se déplacer.$art$,
    $art$Avant de proposer un don, une question revient toujours : est-ce que mon matériel intéresse encore quelqu'un ? Souvent, oui, même s'il n'est plus tout jeune. Voici ce qui est généralement accepté, ce qui ne l'est pas, et comment le savoir sans perdre de temps.

## Le matériel le plus recherché

- **Ordinateurs portables et fixes** : c'est le cœur des besoins des écoles et des associations. Même un poste de quelques années reste très utile pour la bureautique, l'initiation à l'informatique ou la recherche documentaire.
- **Écrans** : indispensables pour équiper une salle avec des ordinateurs fixes.
- **Claviers, souris, câbles et chargeurs** : souvent oubliés, ils font pourtant la différence entre un poste utilisable et un poste inutilisable. Donnez les portables avec leur chargeur.

## Les autres équipements utiles

- **Imprimantes** en état de marche ;
- **tablettes** ;
- **matériel réseau** : switchs, routeurs, points d'accès ;
- **onduleurs**, très précieux là où l'électricité est instable ;
- **mobilier scolaire et fournitures**.

## Ce qui n'est généralement pas accepté

Certains équipements coûteraient plus cher à remettre en service qu'à remplacer, ou posent des problèmes de sécurité. Chez Respusse, nous ne prenons pas :

- le matériel hors d'usage et irréparable à coût raisonnable ;
- les écrans cathodiques ;
- les batteries gonflées.

Dans ces cas, nous vous orientons vers une filière de recyclage agréée plutôt que de vous laisser sans solution.

## Et le matériel en panne ?

Une panne n'est pas forcément éliminatoire. Ce qui se répare part en atelier : au Congo, des jeunes apprennent le métier en remettant en état le matériel endommagé. Indiquez simplement l'état de chaque lot lors de votre demande.

## Faut-il que le matériel soit récent ?

Il n'y a pas d'âge limite strict : tout dépend de l'état et de l'usage possible. Un ordinateur trop lent pour une entreprise peut parfaitement servir dans une salle de classe. C'est pour cela que nous préférons regarder votre liste plutôt que d'appliquer une règle générale.

## Comment savoir si votre matériel sera repris ?

Le plus simple est de demander. Envoyez une liste, même approximative : type d'équipement, quantité, état. Sous 72 heures, nous vous disons ce qui est réemployable, ce qui part au recyclage et ce que nous ne pouvons pas prendre. Vous savez exactement à quoi vous en tenir avant tout déplacement.

Dans tous les cas, les données sont effacées ou les disques détruits avant tout réemploi, avec un certificat joint à l'inventaire.

[Décrivez-nous votre matériel](/contact?profil=entreprise), ou consultez notre [mode d'emploi du don de matériel informatique](/actualites/don-materiel-informatique-entreprise-association).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'equiper-une-ecole-en-ordinateurs',
    $art$Comment équiper une école en ordinateurs gratuitement ?$art$,
    $art$Pas de budget pour une salle informatique ? Les solutions pour obtenir des ordinateurs reconditionnés gratuitement, préparer une demande solide et réussir l'installation.$art$,
    $art$Équiper une école en ordinateurs coûte cher, et beaucoup d'établissements n'en ont pas les moyens. Il existe pourtant une solution : le matériel donné par des entreprises puis remis en état par des associations. Voici comment en bénéficier.

## D'où viennent les ordinateurs gratuits ?

Les entreprises renouvellent régulièrement leurs postes de travail. Les anciens ordinateurs, trop lents pour leurs logiciels, restent largement suffisants pour une salle de classe : traitement de texte, recherche documentaire, initiation à l'informatique, exercices en ligne.

Des associations collectent ce matériel, le testent, effacent les données et le redistribuent à des écoles, des mairies et des associations. C'est ce que fait Respusse, en France et au Congo.

## Quelles écoles peuvent en bénéficier ?

Chaque association a ses critères. Chez Respusse, les demandes sont examinées au fil des collectes et des arrivages. La priorité va aux structures qui :

- accueillent un public scolaire ;
- disposent d'un local qui ferme à clé ;
- ont une alimentation électrique stable.

Ces conditions ne sont pas là pour compliquer les choses : elles garantissent que le matériel servira longtemps, sans être volé ni abîmé.

## Préparer une demande solide

Plus votre demande est précise, plus elle a de chances d'aboutir rapidement. Préparez :

- le nom, l'adresse et le statut de l'école (publique, privée, conventionnée) ;
- le nombre d'élèves et d'enseignants concernés ;
- le matériel souhaité, par ordre de priorité, et l'usage prévu ;
- l'état du local : surface, fermeture, stabilité de l'électricité ;
- le nom et le contact d'une personne référente sur place.

Le formulaire de contact de Respusse vous guide pas à pas : [déposer une demande d'équipement](/contact?profil=beneficiaire).

## Penser à l'installation dès le départ

Recevoir des ordinateurs ne suffit pas : il faut une salle prête à les accueillir. Électricité, protection contre les coupures, sécurité, organisation des postes : nous avons réuni les points clés dans [créer une salle informatique dans une école](/actualites/creer-salle-informatique-ecole).

Chez Respusse, l'installation et la première prise en main sont accompagnées par notre équipe en France et par nos partenaires locaux au Congo, pour que le matériel serve dès la première semaine.

## Le matériel est-il fiable ?

Oui : chaque équipement est testé avant de partir. Il est ensuite installé et testé avec la personne référente. Quelques mois plus tard, nous revenons constater l'usage réel, recenser les éventuelles pannes et, si besoin, compléter la dotation lors d'une livraison suivante.

## Combien de temps faut-il compter ?

En France, quelques semaines suffisent généralement. Pour le Congo, il faut compter trois à quatre mois entre l'enlèvement du matériel et son installation, à cause de la traversée maritime et du dédouanement. Le détail est expliqué sur notre page [Comment ça marche](/comment-ca-marche).

Votre école a besoin d'ordinateurs ? [Déposez votre demande](/contact?profil=beneficiaire) : nous vous répondons sous 72 heures ouvrées.$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'association-materiel-informatique-gratuit',
    $art$Association : comment obtenir du matériel informatique gratuit$art$,
    $art$Votre association a besoin d'ordinateurs mais n'a pas de budget ? Où trouver du matériel reconditionné gratuit, comment formuler votre demande et ce qu'il faut prévoir pour le faire durer.$art$,
    $art$Pour une association, l'informatique n'est pas un luxe : gestion des adhérents, comptabilité, communication, accompagnement du public. Mais le budget manque souvent. Bonne nouvelle : il existe des moyens d'obtenir du matériel sans l'acheter.

## Les sources de matériel gratuit

- **Les associations de réemploi informatique**, qui collectent le matériel des entreprises, le remettent en état et le redistribuent. C'est la solution la plus simple : le matériel est testé et les données effacées.
- **Les entreprises de votre territoire**, directement. Certaines donnent volontiers leurs anciens postes, mais il faudra alors gérer vous-même l'enlèvement et vérifier l'effacement des données.
- **Les collectivités**, qui renouvellent aussi leur matériel et peuvent, dans certains cas, le céder gratuitement à des associations.

## Comment fonctionne Respusse

Respusse collecte le matériel des entreprises partout en France, le teste, efface les données et le redistribue à des écoles, mairies et associations, en France et au Congo. Le matériel disponible varie selon les arrivages : postes informatiques, écrans, onduleurs, mobilier scolaire, fournitures.

Les demandes sont examinées au fil des collectes. La priorité va aux structures qui accueillent un public scolaire et disposent d'un local sécurisable et alimenté en électricité.

## Formuler une demande qui aboutit

Une demande claire est traitée plus vite. Indiquez :

- le nom, l'adresse et le statut de votre association ;
- le public concerné et le nombre de personnes ;
- le matériel souhaité, par ordre de priorité, et l'usage prévu ;
- le lieu où le matériel sera installé : surface, fermeture, électricité ;
- une personne référente, avec ses coordonnées.

[Déposer une demande d'équipement](/contact?profil=beneficiaire)

## Bien choisir : gratuit ne veut pas dire n'importe quoi

Avant d'accepter du matériel, posez quelques questions :

- **a-t-il été testé ?** Un ordinateur qui ne démarre pas vous coûtera du temps et de l'argent ;
- **les données ont-elles été effacées ?** Vous ne voulez pas hériter des fichiers d'une autre structure ;
- **qui installe ?** Un accompagnement à l'installation et à la prise en main fait gagner beaucoup de temps ;
- **que faire en cas de panne ?** Un suivi après livraison est un vrai plus.

Chez Respusse, chaque équipement est testé avant de partir, installé avec la personne référente, et nous repassons quelques mois plus tard pour constater l'usage et recenser les pannes.

## Faire durer le matériel

- Installez-le dans un local qui ferme et à l'abri de l'humidité.
- Protégez-le des coupures et surtensions avec un onduleur ou au moins une multiprise parafoudre.
- Désignez une personne responsable du matériel.
- Gardez les chargeurs et câbles avec les appareils.

Pour une installation complète, lisez [créer une salle informatique dans une école](/actualites/creer-salle-informatique-ecole) : les conseils valent aussi pour une association. Et pour comprendre ce qu'est un ordinateur remis en état, voir [ordinateur reconditionné : définition et fiabilité](/actualites/ordinateur-reconditionne-definition-fiabilite).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'creer-salle-informatique-ecole',
    $art$Créer une salle informatique dans une école : le guide pratique$art$,
    $art$Local, électricité, onduleurs, sécurité, disposition des postes, personne référente : tout ce qu'il faut prévoir pour qu'une salle informatique fonctionne dès le premier jour et dure.$art$,
    $art$Une salle informatique réussie ne dépend pas seulement des ordinateurs. Un local mal choisi, une électricité instable ou l'absence de responsable suffisent à rendre le meilleur matériel inutilisable en quelques mois. Voici les points à préparer avant l'arrivée des postes.

## Choisir le bon local

- **Une pièce qui ferme à clé**, idéalement avec des fenêtres protégées : le vol est la première cause de disparition du matériel.
- **Un endroit sec et aéré** : l'humidité, la poussière et la chaleur abîment les composants. Évitez les pièces sous un toit en tôle sans ventilation.
- **Une surface suffisante** pour circuler entre les postes et installer les élèves à deux par poste si besoin.

## Sécuriser l'alimentation électrique

C'est le point le plus important, en particulier là où le courant est instable.

- **Vérifiez l'installation** : prises en nombre suffisant, câblage en bon état, mise à la terre.
- **Protégez chaque poste des coupures et surtensions** avec un onduleur. Il laisse le temps d'enregistrer et d'éteindre proprement, et protège le matériel des pics de tension.
- **À défaut d'onduleur**, utilisez au minimum des multiprises avec protection contre les surtensions.
- **Évitez de multiplier les rallonges en cascade**, source de surchauffe.

## Organiser les postes

- Disposez les postes le long des murs, écrans visibles depuis le bureau de l'enseignant : c'est plus facile à surveiller.
- Fixez les câbles et regroupez-les pour éviter que les élèves ne les arrachent.
- Prévoyez une place pour l'imprimante et, si possible, pour un équipement réseau.
- Étiquetez chaque poste : cela facilite l'inventaire et le suivi des pannes.

## Prévoir les usages et les logiciels

Pour une initiation à l'informatique, la bureautique et la recherche documentaire, des ordinateurs de quelques années suffisent largement. Pensez à :

- des logiciels de bureautique et éducatifs adaptés à l'âge des élèves ;
- des sessions utilisateurs séparées pour les élèves et les enseignants ;
- un fonctionnement possible sans connexion internet, si elle est absente ou instable.

## Désigner une personne référente

Une salle informatique sans responsable se dégrade vite. Désignez une personne qui :

- ouvre et ferme la salle ;
- tient un inventaire simple et un cahier des pannes ;
- est l'interlocuteur de l'association qui fournit le matériel.

## Comment Respusse accompagne l'installation

Chez Respusse, avant toute livraison, nous vérifions avec vous, ou avec notre relais local au Congo, les conditions d'accueil : local sécurisé, alimentation électrique, personne référente. Le matériel est installé, raccordé et testé en sa présence, avec une première prise en main pour les enseignants. Quelques mois plus tard, nous revenons constater l'usage et recenser les pannes.

Selon les arrivages, une dotation peut comprendre des postes informatiques, des onduleurs, du mobilier scolaire et des fournitures.

Vous préparez une salle ? [Déposez votre demande d'équipement](/contact?profil=beneficiaire), ou lisez [comment équiper une école en ordinateurs gratuitement](/actualites/equiper-une-ecole-en-ordinateurs).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'mairie-materiel-informatique-reconditionne',
    $art$Mairies : s'équiper en matériel informatique reconditionné$art$,
    $art$Budget serré, obligations d'achat responsable, écoles communales à équiper : pourquoi le matériel reconditionné ou donné est une vraie solution pour les communes, et comment en bénéficier.$art$,
    $art$Les communes doivent équiper leurs services, leurs écoles et parfois des espaces publics numériques, avec des budgets contraints. Le matériel informatique reconditionné, acheté ou reçu en don, est une solution de plus en plus utilisée. Voici pourquoi, et comment s'y prendre.

## Pourquoi le reconditionné intéresse les communes

- **Le coût** : un poste reconditionné coûte bien moins cher qu'un poste neuf, et un poste donné ne coûte rien.
- **L'environnement** : la fabrication est la première source d'impact du numérique ; faire durer le matériel existant est le levier le plus efficace.
- **La réglementation** : les acheteurs publics sont tenus, depuis 2021, de consacrer une part minimale de leurs achats de certains produits, dont les équipements informatiques, à des biens issus du réemploi ou intégrant des matières recyclées.

## Pour quels usages ?

Des ordinateurs reconditionnés conviennent parfaitement à :

- l'équipement des écoles communales ;
- les postes en libre accès d'une médiathèque ou d'un espace numérique ;
- les postes administratifs d'usage courant ;
- le prêt de matériel à des associations locales.

## Acheter ou recevoir en don ?

- **L'achat de reconditionné** auprès d'un professionnel donne accès à des volumes réguliers et à une garantie. C'est adapté aux besoins récurrents des services. Pour comprendre ce qu'implique la mention « reconditionné », voir [ordinateur reconditionné : définition et fiabilité](/actualites/ordinateur-reconditionne-definition-fiabilite).
- **Le don par une association** convient aux besoins ponctuels et aux structures sans budget : écoles, associations, petites communes.

## Comment Respusse peut aider une commune

Respusse redistribue le matériel collecté auprès des entreprises à des écoles, mairies et associations, en France et au Congo. Les demandes sont examinées au fil des collectes et des arrivages, en donnant la priorité aux structures qui accueillent un public scolaire.

Pour une demande, indiquez :

- la structure concernée (école, service, espace public) et son adresse ;
- le nombre de personnes qui utiliseront le matériel ;
- le matériel souhaité et son usage ;
- l'état du local : fermeture, électricité ;
- une personne référente.

Le matériel est testé, les données effacées, puis il est installé et testé avec la personne référente. Nous revenons quelques mois plus tard pour constater l'usage réel.

## Et le matériel dont la commune se sépare ?

Les communes renouvellent aussi leurs postes. Plutôt que de les stocker ou de les envoyer au recyclage, elles peuvent les orienter vers le réemploi, dans le respect des règles applicables à la cession de biens publics. Renseignez-vous auprès de vos services juridiques, et pensez à l'effacement des données, qui s'impose aussi aux collectivités : voir [effacer les données avant de donner ses ordinateurs](/actualites/effacement-des-donnees).

[Déposer une demande d'équipement pour votre commune](/contact?profil=beneficiaire)$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'informatique-ecoles-rdc',
    $art$Informatique dans les écoles en RD Congo : état des lieux$art$,
    $art$Électricité, connexion, équipement : où en sont les écoles congolaises face au numérique ? Les obstacles concrets, les initiatives en cours et ce que change un don de matériel.$art$,
    $art$En République démocratique du Congo, l'accès des élèves à l'informatique reste l'exception plutôt que la règle. Le pays affiche pourtant des ambitions numériques, et les initiatives se multiplient. Voici un état des lieux des obstacles et des leviers.

## Des obstacles d'abord matériels

- **L'électricité** : seule une minorité de la population, de l'ordre d'un Congolais sur cinq, a accès à l'électricité, et beaucoup moins en zone rurale. Une école sans courant stable ne peut pas faire fonctionner de salle informatique.
- **La connexion internet** : moins d'un tiers de la population y a accès, et souvent de manière irrégulière.
- **L'équipement** : dans la plupart des écoles, il n'y a tout simplement pas d'ordinateurs. Les établissements qui en ont manquent souvent de matériel en état de marche et de personnel formé pour l'entretenir.

## Des ambitions et des initiatives

Les autorités congolaises ont engagé des réformes pour faire entrer le numérique à l'école et former davantage de jeunes aux métiers de la tech. Des fondations d'entreprise ont équipé des écoles de Kinshasa en salles numériques, et des programmes de formation au numérique visent les jeunes.

Ces initiatives montrent que la demande est forte. Mais elles restent loin de couvrir les besoins de milliers d'établissements.

## Ce qu'un don de matériel change concrètement

Pour une école, recevoir une dizaine d'ordinateurs en état de marche, c'est :

- permettre aux élèves de toucher un clavier pour la première fois, et d'apprendre la bureautique ;
- donner aux enseignants un outil pour préparer leurs cours ;
- faciliter la gestion administrative de l'établissement ;
- souvent, ouvrir la salle à la communauté en dehors des heures de cours.

Un ordinateur trop lent pour une entreprise française reste parfaitement adapté à ces usages.

## Les conditions pour que ça marche

Le matériel ne suffit pas. Pour qu'une salle informatique dure, il faut :

- un local qui ferme et une alimentation électrique la plus stable possible, avec des onduleurs ;
- une personne référente sur place ;
- un accompagnement à l'installation et un suivi dans le temps ;
- des personnes capables de réparer le matériel localement.

C'est la logique de Respusse : nous vérifions sur place les conditions d'accueil avec notre relais local, nos partenaires accompagnent l'installation et la prise en main, et nous revenons constater l'usage quelques mois plus tard. Le matériel endommagé est confié à des recycleries de Kinshasa, où des jeunes apprennent à le réparer : voir [Kinshasa : des jeunes formés à la réparation informatique](/actualites/reparer-devient-un-metier).

## Pour aller plus loin

- [Fracture numérique en RDC : quels enjeux pour l'éducation ?](/actualites/fracture-numerique-rdc-education)
- [Envoyer du matériel informatique au Congo : les étapes](/actualites/envoyer-materiel-informatique-congo)
- [Comment aider les écoles du Congo depuis la France ?](/actualites/aider-ecoles-congo-depuis-la-france)

Une école congolaise a besoin d'équipement ? [Déposez une demande](/contact?profil=beneficiaire).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'envoyer-materiel-informatique-congo',
    $art$Envoyer du matériel informatique au Congo : les étapes$art$,
    $art$Préparation, conteneur maritime, arrivée à Matadi, dédouanement, route jusqu'à Kinshasa : comment se déroule l'envoi de matériel informatique vers la RD Congo, et combien de temps il faut prévoir.$art$,
    $art$Envoyer des ordinateurs de France vers la République démocratique du Congo est un vrai projet logistique. Entre la préparation du matériel et son installation dans une école, plusieurs mois peuvent s'écouler. Voici les grandes étapes, et pourquoi chacune compte.

## Étape 1 : préparer le matériel avant le départ

On n'envoie pas n'importe quoi à des milliers de kilomètres. Chaque équipement doit être :

- **testé** : il serait absurde de payer le transport d'un ordinateur en panne ;
- **effacé** : les données de l'ancien propriétaire ne doivent pas voyager avec la machine ;
- **complété** : chargeurs, câbles, claviers, souris, pour que chaque poste soit utilisable à l'arrivée ;
- **inventorié** : la liste précise du contenu est indispensable pour le dédouanement.

## Étape 2 : regrouper et palettiser

Le matériel est regroupé, emballé, filmé et palettisé pour résister aux manutentions et à l'humidité. Pour les volumes importants, le conteneur maritime est la solution la plus économique par équipement transporté.

## Étape 3 : la traversée jusqu'à Matadi

Le principal port d'entrée de la RD Congo est Matadi, sur le fleuve Congo, en aval de Kinshasa. La traversée depuis l'Europe dure environ cinq semaines.

## Étape 4 : le dédouanement

C'est souvent l'étape la plus longue et la plus incertaine. Il faut présenter les documents d'expédition, l'inventaire du contenu et les justificatifs du caractère de don du matériel. Les délais au port de Matadi peuvent être importants. Un partenaire sur place qui connaît les procédures fait toute la différence.

## Étape 5 : l'acheminement jusqu'à la structure

Une fois dédouané, le matériel rejoint Kinshasa, puis la structure destinataire par la route. Pour les écoles en dehors de la capitale, cette dernière étape peut prendre du temps selon l'état des routes.

## Étape 6 : l'installation et le suivi

L'arrivée n'est pas la fin. Le matériel doit être installé, raccordé et testé dans le local prévu, avec une première prise en main pour les enseignants. Et un suivi dans les mois qui suivent permet de vérifier l'usage réel et de traiter les pannes.

## Combien de temps prévoir ?

Avec Respusse, il faut compter trois à quatre mois entre l'enlèvement du matériel en France et son installation dans une salle de classe au Congo. La traversée maritime et le dédouanement représentent à eux seuls une grande partie de ce délai. Nous préférons annoncer un calendrier réaliste plutôt qu'une promesse impossible à tenir.

## Pourquoi passer par une association ?

Organiser seul l'envoi de quelques ordinateurs coûte cher et expose à de mauvaises surprises au dédouanement. Une association qui regroupe les dons et travaille avec des partenaires locaux mutualise les coûts et maîtrise les procédures.

Respusse s'appuie sur un relais local à Kinshasa, qui vérifie les conditions d'accueil, prend en charge l'arrivée du matériel et accompagne l'installation. Le parcours complet est décrit sur notre page [Comment ça marche](/comment-ca-marche).

Vous êtes une entreprise et souhaitez que votre matériel serve au Congo ? [Proposez-nous un don](/contact?profil=entreprise). Vous représentez une école congolaise ? [Déposez une demande](/contact?profil=beneficiaire).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'fracture-numerique-rdc-education',
    $art$Fracture numérique en RDC : quels enjeux pour l'éducation ?$art$,
    $art$Accès à l'électricité, à internet et aux équipements : la fracture numérique pèse lourd sur l'éducation en RD Congo. Pourquoi elle compte, qui en souffre le plus, et comment la réduire concrètement.$art$,
    $art$La fracture numérique désigne les inégalités d'accès aux outils numériques et de capacité à s'en servir. En République démocratique du Congo, elle est particulièrement marquée, et elle pèse directement sur l'éducation des jeunes.

## Une fracture à plusieurs niveaux

- **L'accès à l'énergie** : environ un Congolais sur cinq seulement a accès à l'électricité, avec de fortes différences entre les villes et les campagnes.
- **L'accès à internet** : moins d'un tiers de la population est connecté, souvent par le téléphone mobile et avec des coûts élevés.
- **L'accès aux équipements** : un ordinateur reste un bien rare, hors de portée de la plupart des familles et des écoles.
- **Les compétences** : sans matériel à l'école, les élèves n'apprennent pas à s'en servir, et les enseignants non plus.

## Pourquoi c'est un enjeu éducatif majeur

- **L'accès au savoir** : ressources éducatives en ligne, encyclopédies, cours : tout un pan de la connaissance passe aujourd'hui par le numérique.
- **L'emploi** : la bureautique et les compétences numériques de base sont demandées pour de nombreux emplois, y compris hors du secteur technologique.
- **L'égalité des chances** : les élèves des écoles déjà équipées prennent de l'avance, ceux des autres restent en arrière.
- **Les métiers techniques** : installer, entretenir et réparer le matériel informatique est un débouché à part entière pour les jeunes.

## Les dynamiques en cours

Le pays affiche des ambitions numériques : réformes éducatives intégrant les technologies, programmes de formation des jeunes, salles numériques ouvertes dans des écoles de Kinshasa par des fondations. La téléphonie mobile progresse aussi rapidement.

Mais l'ampleur des besoins dépasse largement ces initiatives, surtout hors des grandes villes.

## Comment réduire la fracture concrètement

Il n'y a pas de solution unique, mais plusieurs leviers complémentaires :

- **équiper les écoles** avec du matériel fiable et adapté, plutôt que des équipements coûteux qui ne seront pas entretenus ;
- **sécuriser l'énergie** : onduleurs, et à terme solutions solaires ;
- **former** les enseignants et les élèves à l'usage du matériel ;
- **développer la réparation locale**, pour que le matériel dure et que des jeunes en fassent un métier.

## La contribution de Respusse

Respusse agit sur plusieurs de ces leviers à la fois. Nous collectons en France le matériel dont les entreprises n'ont plus l'usage et nous l'acheminons vers des écoles, mairies et associations au Congo, où il est installé avec nos partenaires locaux. Le matériel endommagé est confié à des recycleries de Kinshasa, où des jeunes apprennent la réparation, et un centre de formation aux métiers de l'informatique est en train de voir le jour.

Pour aller plus loin : [l'informatique dans les écoles en RD Congo](/actualites/informatique-ecoles-rdc) et [comment aider les écoles du Congo depuis la France](/actualites/aider-ecoles-congo-depuis-la-france).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'aider-ecoles-congo-depuis-la-france',
    $art$Comment aider les écoles du Congo depuis la France ?$art$,
    $art$Donner du matériel par son entreprise, relayer une collecte, mettre en relation une école : les moyens concrets d'aider les écoles congolaises depuis la France, et les pièges à éviter.$art$,
    $art$Beaucoup de personnes en France, membres de la diaspora congolaise ou non, souhaitent aider les écoles du Congo. Encore faut-il que l'aide arrive, serve et dure. Voici des moyens concrets d'agir, et quelques conseils pour que votre geste soit vraiment utile.

## Aider par le don de matériel

Les écoles congolaises manquent d'abord d'équipement : ordinateurs, onduleurs, mobilier scolaire, fournitures. Or des milliers d'ordinateurs encore fonctionnels quittent chaque année les entreprises françaises.

- **Si vous travaillez dans une entreprise** qui renouvelle son parc, proposez à votre direction ou au service informatique de donner l'ancien matériel plutôt que de le recycler. Respusse se charge de l'enlèvement, de l'effacement des données et de l'acheminement. Voir [que faire des vieux ordinateurs de son entreprise ?](/actualites/que-faire-des-vieux-ordinateurs-de-son-entreprise)
- **Si vous connaissez un responsable RSE**, parlez-lui du don de matériel : c'est une action concrète et documentée pour son [rapport RSE](/actualites/don-de-materiel-rapport-rse).

## Aider en mettant en relation une école

Vous connaissez une école, une mairie ou une association au Congo qui a besoin d'équipement ? Vous pouvez l'aider à déposer une demande. Il nous faut :

- le nom, l'adresse et le statut de la structure ;
- le nombre d'élèves ou de personnes concernées ;
- le matériel souhaité et l'usage prévu ;
- l'état du local : fermeture, électricité ;
- une personne référente sur place, avec ses coordonnées.

[Déposer une demande pour une structure](/contact?profil=beneficiaire)

## Aider en faisant connaître

Partager une collecte, parler de l'association autour de vous, relayer nos [actualités](/actualites) : chaque entreprise qui découvre qu'elle peut donner son matériel, c'est potentiellement une salle de classe équipée.

## Les pièges à éviter

- **Envoyer soi-même quelques ordinateurs par colis** : le coût du transport et les frais à l'arrivée dépassent souvent la valeur du matériel.
- **Envoyer du matériel non testé** : un ordinateur en panne à l'arrivée est un poids, pas une aide.
- **Oublier l'électricité et la sécurité** : sans local qui ferme ni courant stable, le matériel ne dure pas.
- **Livrer sans suivi** : sans personne référente ni accompagnement, une salle informatique se dégrade en quelques mois.

## Comment Respusse fait le lien

Respusse fait le pont entre les deux rives : collecte du matériel auprès des entreprises partout en France, test et effacement des données, acheminement vers Kinshasa, installation avec nos partenaires locaux, puis suivi sur place. Nos projets menés à leur terme sont publiés dans nos [réalisations](/realisations).

Pour comprendre le trajet du matériel : [envoyer du matériel informatique au Congo, les étapes](/actualites/envoyer-materiel-informatique-congo).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'donner-ordinateur-association-particulier',
    $art$Particulier : où donner son vieil ordinateur à une association ?$art$,
    $art$Vous avez un ordinateur dont vous ne vous servez plus ? Les solutions pour le donner à une association, les précautions à prendre pour vos données et que faire s'il ne fonctionne plus.$art$,
    $art$Un vieil ordinateur qui dort dans un placard peut encore rendre service. Avant de le jeter, pensez au don. Voici où le donner, comment le préparer et que faire s'il ne fonctionne plus.

## Avant de donner : sauvegarder et effacer

Votre ordinateur contient vos photos, vos documents, vos mots de passe enregistrés, parfois vos coordonnées bancaires. Avant de vous en séparer :

- **sauvegardez** ce que vous voulez garder sur un disque externe ou un service en ligne ;
- **déconnectez vos comptes** (messagerie, navigateur, services en ligne) ;
- **réinitialisez l'ordinateur** en choisissant l'option qui efface complètement le disque, pas seulement vos fichiers.

La CNIL publie une fiche pratique pour [effacer ses données avant de se séparer d'un appareil](https://cnil.fr/fr/effacer-ses-donnees-dun-ordinateur-dun-telephone-ou-dune-tablette-avant-de-sen-separer).

## À qui donner son ordinateur ?

- **Aux associations de réemploi informatique** de votre région, qui remettent le matériel en état et le redistribuent à des personnes ou des structures qui en ont besoin.
- **Aux ressourceries et recycleries**, qui acceptent souvent le petit matériel électronique.
- **À une école ou une association de votre quartier**, si elle en a l'usage : demandez-lui avant.

Vérifiez toujours les conditions d'acceptation avant de vous déplacer : âge du matériel, état, présence du chargeur.

## Et avec Respusse ?

Respusse collecte principalement le matériel des entreprises. [À COMPLÉTER : préciser si l'association accepte les dons de particuliers, et selon quelles modalités (dépôt, envoi, quantité minimale).] [Contactez-nous](/contact?profil=entreprise) pour en parler.

## Votre ordinateur ne marche plus ?

Un ordinateur en panne ou trop ancien ne doit pas finir à la poubelle : c'est un déchet électronique. Vous pouvez :

- le rapporter en magasin : les vendeurs d'équipements électriques reprennent gratuitement l'ancien appareil lors de l'achat d'un équipement équivalent, et les grandes surfaces spécialisées reprennent aussi les petits appareils sans obligation d'achat ;
- le déposer en déchèterie, dans la zone dédiée aux appareils électriques et électroniques ;
- le confier à une ressourcerie, qui récupérera ce qui peut l'être.

## Pourquoi c'est utile

Faire durer un ordinateur est le geste le plus efficace pour réduire l'impact du numérique, car c'est sa fabrication qui pèse le plus. Pour comprendre pourquoi, lisez [réemploi ou recyclage : pourquoi donner plutôt que jeter](/actualites/pourquoi-donner-plutot-que-jeter).

Vous travaillez dans une entreprise qui renouvelle son parc ? Parlez-lui de nous : [que faire des vieux ordinateurs de son entreprise ?](/actualites/que-faire-des-vieux-ordinateurs-de-son-entreprise)$art$,
    'brouillon',
    null,
    $art$L'équipe Respusse$art$
  ),
  (
    'don-materiel-informatique-ile-de-france',
    $art$Don de matériel informatique en Île-de-France (Val-de-Marne)$art$,
    $art$Entreprise à Paris, en petite ou grande couronne ? Respusse, association basée à L'Haÿ-les-Roses (94), vient enlever gratuitement votre matériel informatique, efface les données et lui donne une seconde vie.$art$,
    $art$Vous êtes une entreprise en Île-de-France et vous cherchez à qui donner vos ordinateurs, écrans ou imprimantes ? Respusse, association dont le siège est à L'Haÿ-les-Roses, dans le Val-de-Marne, collecte le matériel informatique des entreprises et le redistribue à des écoles, mairies et associations, en France et au Congo.

## Un enlèvement gratuit sur votre site

Que vos bureaux soient à Paris, dans le Val-de-Marne, les Hauts-de-Seine, la Seine-Saint-Denis ou ailleurs en Île-de-France, notre équipe se déplace :

- l'enlèvement est gratuit ;
- nous intervenons étage compris, au créneau convenu avec vous ;
- le chargement est assuré par notre équipe : rien à préparer de votre côté.

Et si vous avez des sites ailleurs, nous collectons partout en France.

## Quel matériel donner ?

Ordinateurs portables et fixes, écrans, imprimantes, tablettes, matériel réseau, onduleurs, mobilier scolaire et fournitures. Envoyez-nous une liste, même approximative : sous 72 heures, nous vous disons ce qui est réemployable et ce qui part au recyclage. Le détail est dans [quel matériel peut-on donner ?](/actualites/quel-materiel-informatique-donner)

## Vos données protégées

Chaque support de stockage est effacé par écrasement multi-passes, ou détruit physiquement si vous le demandez. Un certificat d'effacement est joint à l'inventaire signé lors de l'enlèvement. Voir [effacer les données avant de donner ses ordinateurs](/actualites/effacement-des-donnees).

## Des documents pour votre démarche RSE

- un inventaire détaillé, signé à l'enlèvement ;
- une attestation de don ;
- quelques mois après la livraison, des photos et un compte rendu : qui a reçu votre matériel et à quoi il sert.

## Ce que devient votre matériel

Le matériel est testé, effacé puis redistribué à des écoles, mairies et associations, en France et au Congo, notamment à Kinshasa. Ce qui se répare est confié à des ateliers où des jeunes apprennent le métier. Ce qui ne peut pas être réemployé part dans une filière de recyclage agréée.

## Une collecte régulière pour les entreprises franciliennes

Votre entreprise renouvelle son parc régulièrement ? Nous mettons en place un calendrier d'enlèvements et un interlocuteur unique. C'est particulièrement simple pour les entreprises proches de notre base du Val-de-Marne.

[Proposer un don de matériel](/contact?profil=entreprise) · [Voir le parcours d'un don](/comment-ca-marche)$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'ordinateur-reconditionne-definition-fiabilite',
    $art$Ordinateur reconditionné : définition, garanties et fiabilité$art$,
    $art$Qu'est-ce qu'un ordinateur reconditionné, quelle différence avec l'occasion, quelles garanties s'appliquent et est-il fiable ? Ce que dit la loi et ce qu'il faut vérifier.$art$,
    $art$Le matériel reconditionné a gagné en popularité, pour des raisons d'économie comme d'environnement. Mais le terme recouvre-t-il une réalité précise ? Oui, depuis 2022. Voici ce qu'il faut savoir.

## Qu'est-ce qu'un ordinateur reconditionné ?

Depuis un décret de février 2022, le terme « reconditionné » a une définition légale en France. Un produit reconditionné est un bien d'occasion qui a subi des tests portant sur toutes ses fonctionnalités, afin d'établir qu'il répond aux obligations légales de sécurité et à l'usage que l'acheteur peut en attendre. Il a été, si nécessaire, remis en état, et ses données ont été effacées.

Le ministère de l'Économie détaille [les garanties applicables aux objets d'occasion et reconditionnés](https://www.economie.gouv.fr/particuliers/objet-occasion-reconditionne-garantie).

## Quelle différence avec un ordinateur d'occasion ?

- **Un ordinateur d'occasion** est vendu tel quel, après un ou plusieurs utilisateurs, sans contrôle obligatoire de son fonctionnement.
- **Un ordinateur reconditionné** a été testé dans toutes ses fonctionnalités et remis en état si besoin. Le vendeur ne peut pas le présenter comme « neuf » ou « comme neuf ».

## Quelles garanties ?

Un ordinateur reconditionné vendu par un professionnel bénéficie de la garantie légale de conformité, comme un produit d'occasion. Beaucoup de reconditionneurs ajoutent une garantie commerciale. Lisez bien les conditions : durée, pièces couvertes, batterie.

## Un ordinateur reconditionné est-il fiable ?

En général, oui, à condition de bien le choisir :

- **privilégiez les modèles professionnels**, conçus pour durer et faciles à réparer ;
- **regardez l'état de la batterie** pour un portable, souvent la pièce la plus usée ;
- **vérifiez la configuration** au regard de vos usages : la bureautique et la navigation ne demandent pas une machine récente ;
- **préférez un SSD**, qui redonne une vraie rapidité à un ordinateur de quelques années.

## Pourquoi c'est bon pour l'environnement

L'essentiel de l'impact environnemental d'un ordinateur se joue à sa fabrication. Prolonger sa vie évite d'en produire un neuf : c'est le levier le plus efficace pour réduire l'empreinte du numérique. Voir [réemploi ou recyclage : pourquoi donner plutôt que jeter](/actualites/pourquoi-donner-plutot-que-jeter).

## Reconditionné, réemployé, donné : la démarche de Respusse

Respusse ne vend pas d'ordinateurs aux particuliers : nous collectons le matériel des entreprises, nous le testons, effaçons les données et le redistribuons gratuitement à des écoles, mairies et associations, en France et au Congo. Seul le matériel qu'aucune structure n'a demandé est revendu, pour financer le transport et le fonctionnement de l'association.

Vous représentez une école ou une association ? [Déposez une demande d'équipement](/contact?profil=beneficiaire). Vous êtes une entreprise ? [Donnez votre matériel](/contact?profil=entreprise).$art$,
    'publie',
    current_date,
    $art$L'équipe Respusse$art$
  ),
  (
    'respusse-qui-sommes-nous',
    $art$Respusse : qui sommes-nous ?$art$,
    $art$Qui est derrière Respusse ? D'où vient le projet, comment l'association fonctionne entre la France et Kinshasa, et ce qu'elle a déjà accompli.$art$,
    $art$Respusse est une association qui collecte du matériel informatique, électrique et scolaire auprès des entreprises, partout en France, et le redistribue à des écoles, mairies et associations, en France comme au Congo.

## D'où vient le projet ?

[À COMPLÉTER : l'histoire de la création de l'association, la personne ou le groupe à l'origine du projet, l'année de création, le déclic.]

## Ce que nous faisons

- **Collecter** le matériel dont les entreprises n'ont plus l'usage, partout en France, avec un enlèvement gratuit sur site.
- **Sécuriser** les données : chaque support est effacé ou détruit, avec un certificat.
- **Équiper** des écoles, mairies et associations, en France et au Congo, avec du matériel testé et fonctionnel.
- **Réparer** : le matériel endommagé est confié à des recycleries à Kinshasa, où des jeunes apprennent le métier.
- **Former** : un centre de formation aux métiers de l'informatique est en train de voir le jour.

## Entre deux rives

L'association a son siège à L'Haÿ-les-Roses, dans le Val-de-Marne, et une adresse à Kinshasa, dans la commune de Mont-Ngafula. Nos partenaires locaux au Congo vérifient les conditions d'accueil, accompagnent l'installation du matériel et le suivi sur place.

## Comment l'association est financée

Respusse ne reçoit aucun financement public. L'association vit des cotisations des écoles adhérentes et de ses adhérents privés, ainsi que de la revente du seul matériel qu'aucune structure n'a demandé, qui finance le transport, l'acheminement et le fonctionnement.

## Ce que nous avons déjà accompli

[À COMPLÉTER : nombre de collectes, d'équipements redistribués, de structures équipées, avec des exemples concrets.] Nos projets menés à leur terme sont publiés dans nos [réalisations](/realisations).

## Nous rejoindre

Entreprise, école, association ou particulier : il y a plusieurs façons de soutenir le projet. Voir [adhérer, devenir bénévole ou partenaire](/actualites/adherer-benevole-partenaire-respusse), ou [contactez-nous](/contact).$art$,
    'brouillon',
    null,
    $art$L'équipe Respusse$art$
  ),
  (
    'adherer-benevole-partenaire-respusse',
    $art$Soutenir Respusse : adhérer, devenir bénévole ou partenaire$art$,
    $art$Entreprise, école, particulier : les façons de soutenir Respusse, de l'adhésion au partenariat d'entreprise en passant par le bénévolat.$art$,
    $art$Respusse fonctionne grâce à celles et ceux qui donnent du matériel, du temps ou leur soutien. Voici les différentes façons de nous rejoindre.

## Entreprises : devenir partenaire

La façon la plus directe de soutenir l'association est de nous confier votre matériel informatique à chaque renouvellement de parc. Nous mettons en place un calendrier d'enlèvements et un interlocuteur unique, avec à chaque fois un inventaire signé, un certificat d'effacement des données et une attestation de don.

[À COMPLÉTER : autres formes de partenariat proposées (mécénat financier, mécénat de compétences, prise en charge d'un conteneur…).]

[Proposer un partenariat](/contact?profil=entreprise)

## Écoles : adhérer

L'association vit notamment des cotisations des écoles adhérentes. [À COMPLÉTER : ce que comprend l'adhésion pour une école, son montant ou son mode de calcul, et comment adhérer.]

[Nous contacter pour adhérer](/contact?profil=beneficiaire)

## Particuliers : adhérer ou donner de son temps

Les adhérents privés contribuent aussi au fonctionnement de Respusse. [À COMPLÉTER : montant de l'adhésion, ce qu'elle permet, missions bénévoles possibles (collectes, tri, tests, communication, logistique), en France et au Congo.]

## Faire connaître l'association

Vous pouvez aussi nous aider simplement en parlant de Respusse à votre entreprise, à votre responsable RSE ou à une école qui aurait besoin d'équipement. Pour comprendre notre démarche, lisez [Respusse : qui sommes-nous ?](/actualites/respusse-qui-sommes-nous).

[Nous contacter](/contact)$art$,
    'brouillon',
    null,
    $art$L'équipe Respusse$art$
  )
on conflict (slug) do nothing;

commit;

-- 4. Vérification -----------------------------------------------------------
select statut, count(*) from public.articles group by statut;
