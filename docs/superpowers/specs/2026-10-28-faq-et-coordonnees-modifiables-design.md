# FAQ et coordonnées modifiables depuis le back-office

Date : 2026-10-28 · Statut : à valider

## Pourquoi

Le propriétaire du site (l'administrateur de l'association) gère déjà seul
les projets, les articles et les chiffres d'impact. En revanche, la FAQ et
les coordonnées sont écrites dans le code (`src/lib/faq.ts`,
`src/lib/site.ts`, et le numéro WhatsApp dans une variable d'environnement
Vercel). Le moindre changement, comme sa dernière demande d'ajouter une
question sur la revente du matériel, passe donc par le développeur.

Objectif : il modifie lui-même la FAQ et les coordonnées depuis le
back-office, et le site public se met à jour sans redéploiement.

## Objectifs

1. **FAQ** : une page « FAQ » dans le back-office pour ajouter, modifier,
   supprimer et réordonner les questions.
2. **Coordonnées** : une page « Coordonnées » dans le back-office, sous la
   forme d'un formulaire unique : e-mail, téléphone, adresse (rue, code
   postal, ville), numéro WhatsApp.
3. Le jour de la bascule, le site affiche exactement le même contenu
   qu'avant : les 11 questions actuelles (dont celle sur la revente) et les
   coordonnées actuelles sont recopiées en base.

## Non-objectifs

- Rendre modifiables les autres textes du site (pages, mentions légales,
  confidentialité, visuels, nom et description de l'association, menu).
- Mise en forme riche des réponses de la FAQ (gras, liens, listes) : texte
  simple, comme aujourd'hui.
- Historique des modifications ou brouillons : un enregistrement est publié
  immédiatement, comme pour les chiffres d'impact.

## Anti-objectifs (échec même si « ça marche »)

- Le site public affiche une FAQ vide, un pied de page sans e-mail ou une
  erreur parce que la base est vide, pas encore mise à jour ou injoignable.
- Un visiteur non connecté peut modifier la FAQ ou les coordonnées.
- Une modification enregistrée n'apparaît sur une page qu'au prochain
  déploiement.

## Ce qui existe et sur quoi s'appuyer

Le modèle à suivre est celui des **chiffres d'impact** :

- table `chiffres_cles` dans `supabase/schema.sql` (section 10), RLS :
  lecture pour tous, écriture réservée aux admins ;
- lecture publique dans `src/lib/data.ts` (`listerChiffresCles`, avec repli
  si la table est vide ou absente) ;
- lecture admin dans `src/lib/admin-data.ts` ;
- page `src/app/admin/chiffres/` (page, éditeur client, `actions.ts` avec
  `accesAdmin`, `valider`, `revalidatePath`) ;
- schémas zod dans `src/lib/validation/contenu.ts` ;
- lien dans `src/components/admin/navigation-admin.tsx` ;
- types dans `src/types/database.ts`.

`supabase/schema.sql` est idempotent et appliqué à la main (SQL Editor de
Supabase). Une nouvelle version s'applique en relançant le fichier entier.

## Conception

### Données

**Table `faq`** : `id`, `question`, `reponse`, `public`
(`donateurs` | `beneficiaires` | `tous`), `essentielle` (booléen : la
question est aussi affichée sous le formulaire de contact), `ordre`,
`created_at`, `updated_at`. Contraintes de non-vide et de longueur,
cohérentes avec les schémas zod. RLS identique à `chiffres_cles`.

**Table `coordonnees`** : une seule ligne (clé forcée à une valeur unique,
par exemple `id boolean primary key default true check (id)`). Colonnes :
`email`, `telephone`, `rue`, `code_postal`, `ville`, `whatsapp`,
`updated_at`. RLS : lecture pour tous, mise à jour réservée aux admins ; pas
de création ni de suppression depuis le site.

**Contenu de départ** : `schema.sql` insère les 11 questions actuelles de
`src/lib/faq.ts` **uniquement si la table `faq` est vide**, et la ligne de
coordonnées avec les valeurs actuelles de `src/lib/site.ts`
(`on conflict do nothing`). Relancer le script ne doit jamais écraser les
modifications du propriétaire. Le WhatsApp de départ est vide : la valeur
réelle se trouve dans Vercel et doit être recopiée à la main une fois (voir
« Mise en service »). Le téléphone de départ est vide aussi : le numéro
provisoire de `site.ts` n'est pas recopié, pour qu'il ne s'affiche jamais.

### Site public

- **FAQ** (page « Comment ça marche » et FAQ courte de la page contact) :
  lue en base, dans l'ordre. Si la table est vide ou illisible, on affiche
  la FAQ du code (`src/lib/faq.ts`, conservé comme repli). Les données
  structurées FAQ (JSON-LD) suivent la même source.
- **Coordonnées** : lues en base partout où `site.email` et `site.adresse`
  sont utilisés aujourd'hui : pied de page, page contact, mentions légales,
  confidentialité, JSON-LD du layout du site. Repli : valeurs de
  `src/lib/site.ts` si la ligne est absente ou illisible, **champ par
  champ** (un champ vidé en base repasse à la valeur du code, sauf le
  téléphone et la rue qui peuvent rester vides).
- **Téléphone** (décidé par Kenny) : affiché dès que l'admin en a saisi un,
  en lien `tel:`, dans le pied de page et sur la page contact, et ajouté au
  JSON-LD (`telephone`). Champ vide → rien ne s'affiche. Le numéro
  provisoire du code n'est jamais utilisé comme repli.
- **E-mail de réception des messages** (décidé par Kenny) : les
  notifications du formulaire de contact partent vers l'e-mail des
  coordonnées. Repli : `CONTACT_NOTIFICATION_EMAIL` si la base est
  illisible. La condition « Resend configuré » (`resendConfigure` dans
  `lib/env.ts`) ne doit plus exiger `CONTACT_NOTIFICATION_EMAIL` quand un
  e-mail est en base. Le texte d'aide de la page Coordonnées le dit :
  « C'est aussi l'adresse qui reçoit les messages du formulaire. »
- **WhatsApp** : ordre de priorité : numéro en base, sinon variable
  `WHATSAPP_NUMERO`, sinon le numéro d'exemple hors production (comportement
  actuel conservé). Le numéro reste lu côté serveur.
- `site.nom`, `site.description` et les métadonnées SEO du layout racine
  restent dans le code (hors périmètre).

### Rafraîchissement

Chaque enregistrement appelle `revalidatePath` sur toutes les pages
concernées. Les coordonnées apparaissant dans le pied de page, on
revalide le layout du site entier (`revalidatePath("/", "layout")`). La
FAQ revalide `/comment-ca-marche`, `/contact` et `/admin/faq`.

### Back-office

- **Navigation** : deux entrées, « FAQ » et « Coordonnées », à côté de
  « Chiffres ».
- **Page FAQ** : liste des questions dans l'ordre d'affichage. Pour chacune
  : question, réponse, public visé, case « essentielle », position. Boutons
  ajouter / enregistrer / supprimer (avec confirmation), sur le modèle de
  l'éditeur des chiffres. Le changement d'ordre se fait par un champ
  « position » ou des boutons monter/descendre (choix du builder, au plus
  simple et cohérent avec l'éditeur des chiffres).
- **Page Coordonnées** : un formulaire, un bouton « Enregistrer », messages
  d'erreur en français sous chaque champ. Validation : e-mail valide,
  code postal à 5 chiffres, téléphone et WhatsApp au format international
  accepté par `lib/whatsapp.ts` (espaces et « + » tolérés).
- Textes d'aide courts sur chaque page, au ton de celle des chiffres
  (« Ces coordonnées s'affichent dans le pied de page, la page contact… »).

### Tests

Conformément à `CLAUDE.md` (test d'abord pour la logique) :

- schémas zod FAQ et coordonnées (`src/lib/validation/contenu.test.ts`) ;
- logique de repli (base vide → contenu du code ; champ vide → valeur du
  code) et priorité WhatsApp (base > variable > exemple), extraites en
  fonctions pures testables.

Une tâche n'est terminée que si `npm test`, `npm run typecheck`,
`npm run lint` et `npm run build` passent.

## Mise en service

À ajouter dans le README et `docs/admin.md` :

1. Relancer `supabase/schema.sql` dans le SQL Editor (crée les tables et
   recopie le contenu actuel).
2. Saisir une fois le numéro WhatsApp dans « Coordonnées » ; la variable
   Vercel `WHATSAPP_NUMERO` peut ensuite être supprimée ou gardée en
   secours.
3. Remplacer le téléphone provisoire par le vrai numéro.

Tant que l'étape 1 n'est pas faite, le site continue d'afficher le contenu
du code (repli), sans erreur.

## Laissé au builder

- Découpage exact des composants et des fonctions de lecture.
- Forme du réordonnancement de la FAQ (voir ci-dessus).
- Mise en cache des lectures (une seule lecture des coordonnées par rendu,
  par exemple avec `cache` de React).

## Points tranchés par Claude (à vérifier par Kenny)

- Les **zones d'intervention** (`site.zones`) ne sont affichées nulle part
  sur le site : elles sortent du périmètre.
- Repli sur le contenu du code plutôt que page vide.
- Réponses de la FAQ en texte simple.
- Vider le champ WhatsApp fait revenir au numéro de la variable Vercel s'il
  existe ; pour masquer complètement le bouton, il faut aussi supprimer la
  variable. Pas de case « pas de WhatsApp » à ce stade.
