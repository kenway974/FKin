# Plan éditorial — Actualités Respusse

Document de travail vivant : on coche, on réordonne, on complète au fil des
publications. Rythme visé : **2 articles par semaine**, réguliers. Google ne
pénalise pas la fréquence en soi, mais un site neuf qui publie en masse des
articles moyens ressemble à du contenu produit à la chaîne (ce que ses règles
anti-spam visent). Mieux vaut 2 bons articles par semaine que 10 moyens.

Dernière mise à jour : 18 novembre 2026.

---

> Liste courte des sujets, une ligne par article, appuyée sur Google Trends :
> voir [`idees-publications.md`](./idees-publications.md).

## 1. Règles du jeu (à relire avant chaque article)

1. **Rien d'inventé.** Aucun projet, chiffre, témoignage, partenaire ou date
   qui ne soit réel et vérifiable. Un article sans exemple vaut mieux qu'un
   article avec un faux exemple. Les mentions `[À FOURNIR]` se remplacent par
   une info de l'association, ou la phrase se supprime.
2. **Une question réelle par article.** Chaque article répond à une recherche
   qu'une vraie personne tape dans Google (« que faire de mes vieux PC »), pas
   à un sujet qui nous intéresse nous (« notre convoi de septembre »). Les
   récits de terrain viennent **en plus**, quand il y a de vrais projets.
3. **Rester cohérent avec le site.** Les articles ne promettent rien que les
   pages Services, Comment ça marche et la FAQ ne promettent déjà :
   enlèvement gratuit partout en France, réponse sous 72 h, effacement des
   données avec certificat, inventaire signé, attestation de don, compte rendu
   d'usage quelques mois après.
4. **Le juridique et le fiscal se vérifient.** Toute affirmation marquée
   `[À VÉRIFIER]` est confirmée (service-public.fr, impots.gouv.fr,
   ecologie.gouv.fr, CNIL, ou expert-comptable) avant publication, et l'article
   cite sa source par un lien.
5. **Une réponse dès le premier paragraphe.** Le lecteur (et Google) doit
   trouver la réponse courte dans les 3 premières lignes, puis le détail.
6. **Un appel à l'action, un seul.** En fin d'article : « Proposer un don »
   (`/contact?profil=entreprise`) ou « Demander un équipement »
   (`/contact?profil=beneficiaire`), selon le public.

## 2. Format technique (back-office)

| Champ        | Règle                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| **Titre**    | 45 à 60 caractères idéalement (Google coupe au-delà ; « · Respusse » s'ajoute)       |
| **Slug**     | Minuscules, tirets, sans accent, 80 car. max. **Ne plus le changer** une fois publié |
| **Extrait**  | 140 à 160 caractères idéalement (300 max) : sert de description dans Google          |
| **Rubrique** | `Entreprises`, `Écoles & associations`, `Congo`, `L'association`                     |
| **Contenu**  | 700 à 1 500 mots. Syntaxe ci-dessous                                                 |
| **Image**    | Facultative. Vraie photo ou rien ; texte alternatif descriptif                       |

Syntaxe reconnue dans le contenu :

```
## Un intertitre
- un élément de liste
**texte en gras**
[texte du lien](/services)
[source officielle](https://www.service-public.fr/...)
```

Une ligne vide sépare deux paragraphes.

**Maillage interne** : chaque article fait au moins 2 liens vers d'autres
pages du site (une page « service » + un autre article), et reçoit un lien
depuis un article existant quand on le publie (penser à mettre à jour l'ancien).

## 3. Les publics et leurs intentions

| Public                                                      | Ce qu'il cherche                                                                                                                                    | Rubrique              |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **Entreprise (DSI, office manager, RSE, dirigeant de PME)** | Se débarrasser du matériel légalement, sans risque pour les données, avec une preuve, si possible avec un avantage fiscal et une belle histoire RSE | Entreprises           |
| **École, mairie, association en France**                    | Obtenir des ordinateurs gratuits ou peu chers, savoir à qui demander et comment                                                                     | Écoles & associations |
| **Structure ou diaspora côté Congo**                        | Équiper une école à Kinshasa, envoyer du matériel, trouver un partenaire fiable                                                                     | Congo                 |
| **Grand public, partenaires, presse**                       | Savoir qui est Respusse, si c'est sérieux, comment aider                                                                                            | L'association         |

Priorité : **Entreprises** d'abord (ce sont elles qui fournissent le
matériel), puis **Écoles & associations**, puis **Congo**.

## 4. Infos à demander à l'association (bloquant pour certains articles)

Réponses à noter directement sous chaque question.

**Statut et fiscalité** — bloque A6, A7, A8

- [ ] Forme juridique exacte, date de création, numéro RNA / SIREN.
- [ ] L'association est-elle **d'intérêt général** ? A-t-elle obtenu un
      **rescrit fiscal** ? Peut-elle émettre des **reçus fiscaux** (dons des
      entreprises) ? Si non : ne **jamais** évoquer de réduction d'impôt.
- [ ] Le document remis aujourd'hui est-il une « attestation de don » simple
      ou un reçu fiscal ?

**Données** — bloque A3, A4

- [ ] Méthode d'effacement réelle : quel logiciel, quelle norme
      (ex. NIST 800-88, DoD 5220.22-M), combien de passes ?
- [ ] Destruction physique : qui la fait, avec quel outil ?
- [ ] Contenu exact du certificat remis (numéros de série ? signature ?).

**Filières et recyclage** — bloque A5, A10

- [ ] Vers quel éco-organisme ou recycleur agréé part le matériel non
      réemployable (Ecosystem, Ecologic, autre) ?
- [ ] Un bordereau ou justificatif de traitement est-il remis à l'entreprise ?

**Logistique** — bloque A11, C1, C2, C3

- [ ] Qui fait les enlèvements (bénévoles, salariés, transporteur) ?
      Y a-t-il un volume minimum ?
- [ ] Port de départ réel (Le Havre, Anvers ?), fréquence des conteneurs,
      partenaires à Kinshasa, délais réels constatés.

**Projets réels** — bloque toutes les Réalisations et les récits
Pour chaque projet mené : structure (type + ville), date, matériel exact avec
quantités, origine du matériel (entreprise, si elle accepte d'être citée),
**résultat concret chiffré**, 1 à 3 photos (autorisations), une citation d'un
responsable sur place.

**Chiffres d'ensemble** — pour la page d'accueil et l'article association

- [ ] Nombre d'équipements collectés / remis depuis la création.
- [ ] Nombre de structures équipées, en France et au Congo.
- [ ] Nombre de jeunes passés par l'atelier de réparation à Kinshasa.

---

## 5. Le catalogue d'articles

Légende :

- **Priorité** : P1 = à publier en premier ; P2 = semaines 2-3 ; P3 = ensuite.
- **Bloquant** : info à obtenir de l'association avant publication.
- **Requête principale** : la recherche visée. Les volumes ne sont **pas
  vérifiés** (pas d'outil de mots-clés connecté) : à valider avec la saisie
  semi-automatique de Google, le bloc « Autres questions posées », puis
  l'onglet Requêtes de Search Console une fois les impressions arrivées.
- Les slugs marqués ♻︎ **reprennent une adresse déjà connue de Google** : on
  les réutilise pour que les anciennes adresses servent à nouveau du contenu.

### Rubrique Entreprises

#### A1 — Que faire des vieux ordinateurs de son entreprise ? · P1

- **Slug** ♻︎ `que-faire-des-vieux-ordinateurs-de-son-entreprise`
- **Requête principale** : que faire des vieux ordinateurs entreprise
- **Secondaires** : se débarrasser ordinateurs entreprise · ordinateurs obsolètes entreprise · reprise matériel informatique entreprise
- **Intention** : comparer les options. Lecteur : office manager, DSI de PME.
- **Titre** : Que faire des vieux ordinateurs de son entreprise ?
- **Extrait** : Revente, recyclage, don à une association : les solutions pour se séparer des ordinateurs de l'entreprise légalement, sans risque pour les données.
- **Plan** :
  - Réponse courte : 4 options (revente, reprise fournisseur, recyclage DEEE, don)
  - Ce que la loi impose dans tous les cas (lien A5)
  - Option par option : avantages, limites, coût, preuve obtenue
  - Le point commun obligatoire : l'effacement des données (lien A3)
  - Tableau comparatif
  - Comment choisir selon la quantité et l'âge du parc
- **Liens** : A3, A5, A2, `/services#entreprises`
- **CTA** : Proposer un don · **Bloquant** : aucun

#### A2 — Don de matériel informatique d'entreprise : mode d'emploi · P1

- **Slug** ♻︎ `don-materiel-informatique-entreprise-association`
- **Requête principale** : don matériel informatique entreprise
- **Secondaires** : donner ordinateurs association entreprise · don pc entreprise association · mécénat matériel informatique
- **Intention** : passer à l'action, savoir comment ça se passe.
- **Titre** : Don de matériel informatique d'entreprise : mode d'emploi
- **Extrait** : Comment une entreprise donne ses ordinateurs à une association : les étapes, les documents à obtenir, les précautions pour les données.
- **Plan** :
  - En bref : 5 étapes, de l'inventaire à l'attestation
  - Quel matériel est accepté (et lequel ne l'est pas)
  - Avant le don : inventaire, sortie de l'actif, données
  - Le jour de l'enlèvement : ce qui doit être signé
  - Après : attestation, compte rendu d'usage, communication RSE
  - Les 6 questions à poser à l'association avant de choisir
- **Liens** : A3, A9, `/comment-ca-marche`, `/contact?profil=entreprise`
- **CTA** : Proposer un don · **Bloquant** : aucun (rester sur les engagements du site)

#### A3 — Donner ses ordinateurs sans risque pour ses données · P1

- **Slug** ♻︎ `effacement-des-donnees`
- **Requête principale** : effacement données ordinateur avant don
- **Secondaires** : effacer disque dur entreprise · effacement sécurisé disque dur · certificat d'effacement des données
- **Intention** : lever la peur n° 1 des entreprises.
- **Titre** : Donner ses ordinateurs sans risque pour ses données
- **Extrait** : Formater ne suffit pas. Ce qu'est un effacement sécurisé, quand détruire un disque, et quelle preuve exiger avant de donner son matériel.
- **Plan** :
  - Pourquoi un formatage ou une remise à zéro ne suffit pas
  - Effacement logiciel, cryptographique (SSD), destruction physique : différences
  - Le cas des SSD et des téléphones
  - Le certificat d'effacement : ce qu'il doit contenir
  - Ce que fait Respusse, concrètement `[À FOURNIR : méthode, norme]`
  - Checklist avant de remettre un appareil
- **Liens** : A4, A2, `/services`
- **CTA** : Proposer un don · **Bloquant** : méthode d'effacement réelle (partie Respusse)

#### A4 — RGPD et fin de vie du matériel : ce que l'entreprise doit prouver · P2

- **Slug** `rgpd-fin-de-vie-materiel-informatique`
- **Requête principale** : rgpd destruction données matériel informatique
- **Secondaires** : rgpd disque dur fin de vie · obligation effacement données rgpd
- **Intention** : DPO, juristes, DSI : la conformité.
- **Titre** : RGPD : ce que l'entreprise doit prouver en fin de vie du matériel
- **Plan** : principe de sécurité (art. 32) `[À VÉRIFIER]` · responsabilité même après le don · recommandations CNIL `[À VÉRIFIER, citer]` · documents à archiver · sous-traitant ou non ?
- **Liens** : A3, A2 · **CTA** : Proposer un don · **Bloquant** : A3 publié

#### A5 — DEEE : quelles obligations pour les entreprises ? · P1

- **Slug** ♻︎ `deee-obligations-entreprises`
- **Requête principale** : deee obligations entreprise
- **Secondaires** : deee professionnels · recyclage deee entreprise · déchets informatiques entreprise
- **Titre** : DEEE : quelles obligations pour les entreprises ?
- **Extrait** : Ordinateurs, écrans, imprimantes en fin de vie sont des DEEE. Ce que la loi impose à l'entreprise, la place du réemploi et les preuves à garder.
- **Plan** :
  - Qu'est-ce qu'un DEEE professionnel `[À VÉRIFIER]`
  - Qui est responsable : producteur, détenteur `[À VÉRIFIER]`
  - Interdit : la benne, la déchetterie municipale `[À VÉRIFIER]`
  - Le réemploi passe avant le recyclage (hiérarchie des déchets, loi AGEC) `[À VÉRIFIER]`
  - Les justificatifs à conserver
- **Liens** : A1, A10, `/services` · **CTA** : Proposer un don · **Bloquant** : aucun (sources officielles)

#### A6 — Don de matériel : quelle réduction d'impôt pour l'entreprise ? · P2

- **Slug** `don-materiel-reduction-impot-entreprise`
- **Requête principale** : don matériel informatique réduction d'impôt
- **Secondaires** : mécénat en nature entreprise · don en nature défiscalisation · valorisation don matériel amorti
- **Intention** : forte. Angle honnête qui fera la différence : un PC **amorti**
  a une valeur comptable proche de zéro, donc la réduction est souvent faible ;
  le vrai gain est ailleurs (coût d'enlèvement évité, RSE, données).
- **Titre** : Don de matériel informatique : quelle réduction d'impôt ?
- **Plan** : principe du mécénat (60 %, plafonds) `[À VÉRIFIER]` · comment valoriser un bien donné (valeur nette comptable) `[À VÉRIFIER]` · exemple chiffré fictif **présenté comme exemple** · conditions côté association (intérêt général, reçu fiscal) · ce qu'il faut demander à l'association
- **Liens** : A2, A9 · **CTA** : Proposer un don
- **Bloquant** : statut fiscal de Respusse. **Si Respusse ne peut pas émettre de reçu fiscal, l'article le dit clairement** (et reste utile : il explique les conditions).

#### A7 — Mécénat en nature : le guide pour les PME · P3

- **Slug** `mecenat-en-nature-pme`
- **Requête principale** : mécénat en nature
- **Plan** : définition, différence avec le sponsoring, biens/compétences/temps, déclaration, cas du matériel informatique
- **Liens** : A6, A9 · **Bloquant** : comme A6

#### A8 — Sortir du matériel donné de la comptabilité · P3

- **Slug** `comptabiliser-don-materiel-informatique`
- **Requête principale** : comptabiliser don matériel amorti
- **Intention** : comptables, dirigeants de TPE. Contenu très technique : faire relire par un expert-comptable.
- **Bloquant** : relecture expert-comptable

#### A9 — RSE : valoriser le don de matériel dans son rapport · P2

- **Slug** `rse-don-materiel-informatique`
- **Requête principale** : rse matériel informatique
- **Secondaires** : action rse entreprise exemple · numérique responsable entreprise · rapport rse réemploi
- **Titre** : RSE : valoriser le don de matériel informatique
- **Plan** : pourquoi le réemploi compte en RSE (impact environnemental de la fabrication `[À VÉRIFIER, source ADEME]`) · quels indicateurs suivre (nombre d'équipements, kg évités, structures équipées) · quelles preuves demander · comment communiquer sans greenwashing · CSRD : ce qui change `[À VÉRIFIER]`
- **Liens** : A2, A12, `/realisations` · **CTA** : Proposer un don · **Bloquant** : aucun

#### A10 — Recyclage ou réemploi : quelle différence pour vos ordinateurs ? · P2

- **Slug** `recyclage-ou-reemploi-ordinateurs`
- **Requête principale** : recyclage ordinateur entreprise
- **Secondaires** : réemploi informatique · reconditionnement entreprise
- **Plan** : définitions · ce qui se passe réellement dans chaque filière · pourquoi le réemploi d'abord · ce qui ne peut pas être réemployé (lien FAQ : matériel refusé) · comment Respusse oriente le reste `[À FOURNIR : filière]`
- **Liens** : A5, A1 · **Bloquant** : filière de recyclage

#### A11 — Déménagement de bureaux : que faire du matériel informatique ? · P2

- **Slug** `demenagement-bureaux-materiel-informatique`
- **Requête principale** : déménagement entreprise matériel informatique
- **Secondaires** : débarras bureaux · que faire du mobilier de bureau
- **Intention** : moment déclencheur fréquent, urgence, gros volumes.
- **Plan** : rétroplanning (J-60 à J-0) · trier ce qui part, ce qui reste · mobilier scolaire et de bureau accepté ? `[À FOURNIR]` · enlèvement en une fois · délais à prévoir
- **Liens** : A2, A3, `/contact?profil=entreprise` · **Bloquant** : délais et volumes réels

#### A12 — Renouvellement de parc informatique : planifier la fin de vie · P3

- **Slug** `renouvellement-parc-informatique`
- **Requête principale** : renouvellement parc informatique
- **Plan** : cycles de renouvellement · allonger la durée de vie · organiser des enlèvements réguliers (lien FAQ) · indicateurs
- **Liens** : A9, A2

#### A13 — Quel matériel informatique peut-on donner ? · P1

- **Slug** `quel-materiel-informatique-donner`
- **Requête principale** : quel matériel informatique donner association
- **Secondaires** : don ordinateur ancien · don écran · don imprimante association
- **Intention** : lever le doute « mon matériel est trop vieux ».
- **Titre** : Quel matériel informatique peut-on donner ?
- **Plan** : accepté (repris de la FAQ) · refusé et pourquoi (cathodiques, batteries gonflées, hors d'usage) · âge et état : la règle simple · en panne : l'atelier de réparation (lien C4) · « envoyez une liste, même approximative »
- **Liens** : A2, C4, `/contact?profil=entreprise` · **Bloquant** : aucun

#### A14 — Don de mobilier de bureau et scolaire · P3

- **Slug** `don-mobilier-bureau-association`
- **Requête principale** : don mobilier bureau association
- **Bloquant** : confirmer que le mobilier est vraiment accepté et transporté

#### A15 — Don de matériel informatique en Île-de-France · P2 (local)

- **Slug** `don-materiel-informatique-ile-de-france`
- **Requête principale** : don matériel informatique île de france
- **Secondaires** : don ordinateur paris association · don matériel informatique val-de-marne · recyclage ordinateur 94
- **Intention** : requêtes locales, moins concurrencées. Respusse est à L'Haÿ-les-Roses.
- **Plan** : enlèvement en Île-de-France · délais · exemples d'interventions **réelles** `[À FOURNIR]` · contact
- **Liens** : A2, `/contact` · **Bloquant** : au moins une intervention réelle en IDF

### Rubrique Écoles & associations

#### B1 — Comment une école peut obtenir des ordinateurs gratuits · P1

- **Slug** `ecole-obtenir-ordinateurs-gratuits`
- **Requête principale** : ordinateurs gratuits pour école
- **Secondaires** : équiper une école en informatique · don ordinateur école primaire
- **Intention** : directeurs d'école, enseignants, APE.
- **Titre** : Comment une école peut obtenir des ordinateurs gratuits
- **Plan** : qui finance l'équipement d'une école en France (commune pour le primaire, département pour les collèges, région pour les lycées) `[À VÉRIFIER]` · dons d'entreprises via une association · ce qu'il faut préparer (repris FAQ « Que faut-il nous transmettre ») · les critères de priorité Respusse (local fermé, électricité stable) · délais
- **Liens** : B3, `/contact?profil=beneficiaire` · **CTA** : Demander un équipement · **Bloquant** : aucun

#### B2 — Association : où trouver des ordinateurs gratuits ou pas chers ? · P1

- **Slug** `association-ordinateurs-gratuits`
- **Requête principale** : association ordinateur gratuit
- **Secondaires** : don ordinateur association · ordinateur reconditionné association
- **Plan** : les pistes (dons d'entreprises, programmes de réemploi, reconditionneurs solidaires) · ce qu'il faut savoir avant d'accepter (licences, état, support) · comment formuler une demande convaincante · Respusse : pour qui, comment
- **Liens** : B3, `/contact?profil=beneficiaire` · **Bloquant** : aucun
- **Note** : citer d'autres acteurs est **une force** (crédibilité, utilité réelle), pas une fuite.

#### B3 — Demande d'équipement : constituer un bon dossier · P1

- **Slug** `demande-equipement-informatique-dossier`
- **Requête principale** : demande de don de matériel informatique lettre
- **Secondaires** : modèle lettre demande don ordinateur · demande matériel informatique association
- **Intention** : très concrète, recherche de modèle.
- **Titre** : Demander du matériel informatique : le dossier qui convainc
- **Plan** : les 6 informations indispensables (FAQ) · **modèle de message à copier** · erreurs fréquentes · après la demande : délais, visite, installation
- **Liens** : B1, B2, `/contact?profil=beneficiaire` · **Bloquant** : aucun

#### B4 — Mairie : équiper une salle informatique à petit budget · P2

- **Slug** `mairie-equiper-salle-informatique`
- **Requête principale** : équiper salle informatique mairie
- **Secondaires** : espace numérique commune · inclusion numérique mairie
- **Plan** : besoins types (France services, médiathèque, école) · budget vs réemploi · maintenance · exemples réels `[À FOURNIR]`

#### B5 — Réussir l'installation d'une salle informatique · P2

- **Slug** `installer-salle-informatique-ecole`
- **Requête principale** : installer une salle informatique école
- **Plan** : local, électricité, onduleurs, réseau, mobilier, sécurité, référent, premiers usages
- **Liens** : B6, C5 · **Bloquant** : aucun

#### B6 — Faire durer des ordinateurs reconditionnés · P3

- **Slug** `entretenir-ordinateurs-reconditionnes`
- **Requête principale** : entretien ordinateur école · ordinateur reconditionné durée de vie
- **Plan** : poussière, chaleur, onduleur, systèmes légers, comptes élèves, pannes fréquentes

#### B7 — Quels logiciels gratuits pour une salle informatique d'école ? · P3

- **Slug** `logiciels-gratuits-ecole`
- **Requête principale** : logiciels gratuits école
- **Intention** : très recherché, utile aux bénéficiaires, attire des liens. Libres : LibreOffice, GCompris, systèmes légers type Linux. `[À VÉRIFIER : ce qu'installe réellement Respusse]`

### Rubrique Congo

#### C1 — Envoyer des ordinateurs au Congo : ce qu'il faut savoir · P2

- **Slug** `envoyer-ordinateurs-congo`
- **Requête principale** : envoyer ordinateurs en afrique
- **Secondaires** : envoyer matériel informatique congo · conteneur kinshasa · don ordinateur afrique
- **Intention** : diaspora, associations, particuliers.
- **Plan** : conteneur vs colis · dédouanement à Matadi et droits `[À VÉRIFIER]` · délais réels (FAQ : 3 à 4 mois) · pourquoi un partenaire sur place est indispensable · le piège des envois de matériel hors d'usage (« e-déchets ») · comment Respusse procède `[À FOURNIR]`
- **Liens** : C2, `/comment-ca-marche` · **Bloquant** : logistique réelle

#### C2 — Le voyage d'un ordinateur, de Paris à une classe de Kinshasa · P2

- **Slug** `voyage-ordinateur-paris-kinshasa`
- **Requête principale** : (récit, peu de requêtes) — sert la confiance et le partage
- **Plan** : étape par étape avec photos réelles `[À FOURNIR]`
- **Bloquant** : photos et étapes réelles

#### C3 — L'informatique dans les écoles de Kinshasa : état des lieux · P3

- **Slug** `informatique-ecoles-kinshasa`
- **Requête principale** : écoles kinshasa informatique
- **Plan** : chiffres sourcés (UNESCO, Banque mondiale) `[À VÉRIFIER]` · électricité, coût, formation des enseignants · ce qui marche
- **Bloquant** : sources fiables

#### C4 — À Kinshasa, réparer devient un métier · P2

- **Slug** ♻︎ `reparer-devient-un-metier`
- **Requête principale** : formation réparation informatique kinshasa
- **Plan** : l'atelier de réparation (services#reparation) · qui sont les jeunes · ce qu'ils apprennent · débouchés **réels** `[À FOURNIR]`
- **Bloquant** : infos réelles sur l'atelier

#### C5 — Équiper une école sans électricité stable · P3

- **Slug** `ecole-electricite-instable-informatique`
- **Requête principale** : salle informatique solaire afrique
- **Plan** : onduleurs, solaire, portables vs fixes, consommation · ce que Respusse fournit `[À FOURNIR]`

#### C6 — Le centre de formation aux métiers de l'informatique · P3

- **Slug** `centre-formation-informatique-kinshasa`
- **Bloquant** : état réel du projet (le site l'annonce « Bientôt »)

### Rubrique L'association

#### D1 — Qui est Respusse ? · P1

- **Slug** `qui-est-respusse`
- **Requête principale** : respusse (requête de marque : quand les gens vous découvrent, ils vous cherchent)
- **Plan** : l'origine, les fondateurs (avec leur accord), la mission, le statut, comment l'association se finance (FAQ : cotisations, revente du matériel non demandé), les chiffres réels
- **Bloquant** : histoire et statut

#### D2 — Comment nous finançons-nous ? (transparence) · P2

- **Slug** `financement-association-respusse`
- **Intention** : confiance des entreprises. Reprend et développe la FAQ « Certains matériels sont-ils mis en vente ? ».
- **Bloquant** : chiffres réels (optionnels)

#### D3 — Devenir bénévole ou adhérent · P3

- **Slug** `devenir-benevole-respusse`
- **Bloquant** : existe-t-il un dispositif d'adhésion / bénévolat ?

### Récits de terrain (dès qu'on a de vrais projets)

Un récit par projet réel, **en plus** de la fiche Réalisation :

- **Slug** : `[type]-[ville]-[annee]`, ex. `salle-informatique-ecole-mont-ngafula-2026`
- **Plan** : le besoin de départ · le matériel et d'où il venait · l'installation · ce que ça change (chiffré) · la parole d'un responsable · photos
- La fiche Réalisation et le récit se lient l'un à l'autre.

---

## 6. Calendrier de départ (2 par semaine)

Ordre pensé pour publier d'abord ce qui **ne dépend de personne**, pendant que
l'association rassemble ses infos.

| Semaine | Article(s)                 | Bloquant ?                   |
| ------- | -------------------------- | ---------------------------- |
| S1      | A1 · A13                   | non                          |
| S2      | A2 · B1                    | non                          |
| S3      | A5 · B3                    | non                          |
| S4      | A3 · B2                    | méthode d'effacement (A3)    |
| S5      | A6 · A9                    | statut fiscal (A6)           |
| S6      | A10 · B5                   | filière de recyclage (A10)   |
| S7      | A11 · A15                  | délais, une intervention IDF |
| S8      | A4 · D1                    | histoire, statut (D1)        |
| S9+     | C1, C4, B4, D2, P3, récits | selon les réponses           |

Les récits de vrais projets passent **avant** le calendrier dès qu'ils sont prêts.

Si une info bloquante n'est pas arrivée, on passe au suivant non bloqué.

## 7. Checklist avant de publier

- [ ] La réponse courte est dans les 3 premières lignes
- [ ] Titre 45-60 car., extrait 140-160 car., slug définitif
- [ ] Aucun chiffre, projet ou témoignage inventé ; aucun `[À FOURNIR]` restant
- [ ] Chaque `[À VÉRIFIER]` est vérifié **et** sourcé par un lien
- [ ] Rien ne contredit les pages Services, Comment ça marche, FAQ
- [ ] 2 liens internes minimum + 1 appel à l'action
- [ ] Un article plus ancien pointe vers le nouveau
- [ ] Relu à voix haute une fois (fautes, phrases trop longues)
- [ ] Après publication : Search Console → Inspection de l'URL → Demander l'indexation

## 8. Mesurer

Toutes les 2 semaines, dans Search Console → Performances :

- **Impressions** par page (onglet Pages) : le premier signal qui bouge.
- **Requêtes** : les vraies recherches qui nous font apparaître. En tirer de
  nouveaux sujets et ajuster les titres.
- **Position moyenne** : une page entre la 8e et la 20e place mérite d'être
  enrichie (c'est là que les gains sont les plus rapides).

## 9. Suivi des publications

| Code | Titre | Publié le | Indexation demandée | Notes |
| ---- | ----- | --------- | ------------------- | ----- |
|      |       |           |                     |       |
