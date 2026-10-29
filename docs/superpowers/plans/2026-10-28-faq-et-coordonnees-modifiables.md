# FAQ et coordonnées modifiables — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** l'admin modifie la FAQ et les coordonnées (e-mail, téléphone, adresse, WhatsApp) depuis le back-office ; le site public suit sans redéploiement.

**Architecture :** deux tables Supabase (`faq`, `coordonnees` à ligne unique) sur le modèle de `chiffres_cles`. Des fonctions pures (repli sur le contenu du code, priorité WhatsApp, destinataires des notifications) sont testées à part ; des lectures serveur mises en cache les alimentent. Deux pages admin sur le modèle de `src/app/admin/chiffres/`.

**Tech Stack :** Next.js 15 App Router, React 19, TypeScript strict, Supabase (RLS), zod 4, Vitest.

**Spec :** `docs/superpowers/specs/2026-10-28-faq-et-coordonnees-modifiables-design.md`

## Global Constraints

- Code, noms, commentaires et textes en **français**, comme le reste du dépôt.
- Aucune nouvelle dépendance.
- Imports via `@/` ; tests à côté du fichier testé.
- `supabase/schema.sql` reste **idempotent** : le relancer n'écrase jamais une donnée saisie par l'admin.
- Le numéro de téléphone provisoire de `site.ts` (`+33 1 00 00 00 00`) ne s'affiche jamais.
- Base vide, absente ou injoignable → le site affiche le contenu du code, sans erreur.
- Fin de chaque tâche : `npm test`, `npm run typecheck`, `npm run lint` passent ; `npm run build` en fin de plan.

## Review Focus

1. **Tables pas encore créées** (schéma non relancé) : le site rend la FAQ et les coordonnées du code ; l'enregistrement admin renvoie un message d'erreur lisible, pas une exception. → test de `questionsFaq([])` et `fusionnerCoordonnees(null)` (tâche 2).
2. **Texte saisi contenant `</script>`** dans une question ou une réponse : le JSON-LD ne doit pas pouvoir fermer la balise `<script>`. → test `jsonLdSur` (tâche 2).
3. **Téléphone saisi avec espaces, points, parenthèses** : affiché tel quel, lien `tel:` sans séparateurs. → test `lienTelephone` (tâche 2).
4. **Ligne de coordonnées partielle** (une colonne `null`) : chaque champ retombe sur sa valeur du code, sauf téléphone et rue (vides). → test `fusionnerCoordonnees` (tâche 2).
5. **E-mail en base absent** : les notifications repartent vers `CONTACT_NOTIFICATION_EMAIL` ; aucun des deux → pas d'envoi, avertissement console. → test `destinatairesNotification` (tâche 2).

---

### Task 1 : schéma SQL et types

**Files :**
- Modify : `supabase/schema.sql` (sommaire en tête + sections 13 et 14 à la fin)
- Modify : `src/types/database.ts`

**Interfaces :**
- Produces : types `LigneFaq`, `LigneCoordonnees`, entrées `faq` et `coordonnees` dans `Database["public"]["Tables"]`.

- [ ] **Step 1 : section 13 `faq`** : colonnes `id uuid pk default gen_random_uuid()`, `question text not null`, `reponse text not null`, `public text not null default 'tous'` (`check (public in ('donateurs','beneficiaires','tous'))`), `essentielle boolean not null default false`, `ordre integer not null default 0`, `created_at`, `updated_at`. Contraintes : question 3–200 caractères, réponse 3–2000 (après `trim`). Trigger `maj_updated_at`, RLS et politiques recopiées de `chiffres_cles` (lecture `anon, authenticated` ; insert/update/delete via `est_admin()`).
- [ ] **Step 2 : contenu de départ FAQ** : `insert into public.faq (question, reponse, public, essentielle, ordre) select … where not exists (select 1 from public.faq)` avec les 11 questions de `src/lib/faq.ts`, `ordre` 0 à 10 dans l'ordre du fichier (apostrophes doublées).
- [ ] **Step 3 : section 14 `coordonnees`** : `id boolean primary key default true check (id)`, `email text`, `telephone text`, `rue text`, `code_postal text`, `ville text`, `adresse_rdc text`, `whatsapp text`, `updated_at`. Trigger `maj_updated_at`. RLS : `select` pour `anon, authenticated` ; `update` et `insert` pour les admins ; pas de `delete`. Ligne de départ : `insert into public.coordonnees (id, email, telephone, rue, code_postal, ville, adresse_rdc, whatsapp) values (true, 'respusse@gmail.com', null, null, '94240', 'L''Haÿ-les-Roses', 'Avenue Soki n° 20, commune de Mont-Ngafula, Kinshasa', null) on conflict (id) do nothing`.
- [ ] **Step 4 : types** : `LigneFaq` (`public: "donateurs" | "beneficiaires" | "tous"`) et `LigneCoordonnees` (toutes colonnes texte `string | null`), entrées `Row/Insert/Update/Relationships` sur le modèle de `chiffres_cles`.
- [ ] **Step 5 : vérifier** : `npm run typecheck` passe ; relire le SQL : chaque `create` est précédé de `if not exists` ou d'un `drop … if exists`.
- [ ] **Step 6 : commit** `Base : tables faq et coordonnees, avec le contenu actuel du site`

### Task 2 : logique pure (repli, WhatsApp, téléphone, notifications, JSON-LD)

**Files :**
- Create : `src/lib/coordonnees.ts`, `src/lib/coordonnees.test.ts`
- Modify : `src/lib/faq.ts` (ajout de `questionsFaq`), create `src/lib/faq.test.ts`
- Modify : `src/lib/whatsapp.ts`, create `src/lib/whatsapp.test.ts`
- Modify : `src/lib/utils.ts` (ajout de `jsonLdSur`), `src/lib/utils.test.ts`

**Interfaces :**
- Consumes : `LigneFaq`, `LigneCoordonnees` (tâche 1), `site` (`src/lib/site.ts`).
- Produces :
  - `type Coordonnees = { email: string; telephone: string; rue: string; codePostal: string; ville: string; pays: string; adresseRdc: string; whatsapp: string }`
  - `fusionnerCoordonnees(ligne: LigneCoordonnees | null): Coordonnees`
  - `lienTelephone(telephone: string): string | null`
  - `destinatairesNotification(emailBase: string | null | undefined, variable: string | undefined): string[]`
  - `questionsFaq(lignes: LigneFaq[]): QuestionFaq[]`
  - `resoudreWhatsApp(base: string, variable: string, horsProduction: boolean): { numero: string; exemple: boolean }`
  - `lienWhatsApp(numero: string, message?: string): string | null`
  - `jsonLdSur(donnees: unknown): string`

- [ ] **Step 1 : tests qui échouent**
  - `fusionnerCoordonnees(null)` → `{ email: "respusse@gmail.com", telephone: "", rue: "", codePostal: "94240", ville: "L'Haÿ-les-Roses", pays: "FR", adresseRdc: "Avenue Soki n° 20, commune de Mont-Ngafula, Kinshasa", whatsapp: "" }` ;
  - ligne présente avec `adresse_rdc: null` → `adresseRdc: ""` (l'admin l'a vidée : on ne l'affiche plus) ;
  - ligne avec `ville: null`, `email: "  "`, `telephone: "06 12"` → ville et e-mail du code, téléphone `"06 12"` ;
  - `lienTelephone("+33 (0)6 12.34-56 78")` → `"tel:+330612345678"` ; `lienTelephone("")` → `null` ;
  - `destinatairesNotification("a@b.fr", "x@y.fr")` → `["a@b.fr"]` ; `(null, "x@y.fr, z@y.fr")` → `["x@y.fr", "z@y.fr"]` ; `(" ", undefined)` → `[]` ;
  - `questionsFaq([])` → `FAQ` ; une ligne → `[{ question, reponse, public, essentielle }]` dans l'ordre reçu ;
  - `resoudreWhatsApp("+243 81 000", "33611", false)` → `{ numero: "24381000", exemple: false }` ; `("", "33611", false)` → `{ numero: "33611", exemple: false }` ; `("", "", true)` → `{ numero: "33600000000", exemple: true }` ; `("", "", false)` → `{ numero: "", exemple: false }` ;
  - `lienWhatsApp("")` → `null` ;
  - `jsonLdSur({ a: "</script><b>" })` ne contient pas `<` (`<` à la place).
- [ ] **Step 2 : lancer `npm test`**, vérifier les échecs (fonctions absentes).
- [ ] **Step 3 : implémenter.** `fusionnerCoordonnees` : champ non vide après `trim`, sinon valeur de `site` ; téléphone et rue : valeur en base ou `""` (jamais `site.telephone`, jamais le `"—"` de `site.adresse.rue`). `whatsapp.ts` : remplacer les constantes calculées au chargement par `resoudreWhatsApp` et un `lienWhatsApp(numero, message)` à deux paramètres (message par défaut inchangé) ; garder `import "server-only"` hors des fonctions pures si cela gêne Vitest (déplacer alors les fonctions pures dans `coordonnees.ts`).
- [ ] **Step 4 : `npm test`** passe.
- [ ] **Step 5 : commit** `Coordonnées et FAQ : repli sur le contenu du code, WhatsApp et destinataires`

### Task 3 : lectures serveur et site public

**Files :**
- Modify : `src/lib/data.ts` (ajout `lireLigneCoordonnees`, `lireCoordonnees`, `lireFaq`)
- Modify : `src/components/whatsapp.tsx`, `src/components/layout/footer.tsx`, `src/components/deux-portes.tsx`
- Modify : `src/app/(site)/layout.tsx`, `contact/page.tsx`, `comment-ca-marche/page.tsx`, `mentions-legales/page.tsx`, `confidentialite/page.tsx`
- Modify : `src/app/(site)/contact/actions.ts`, `src/lib/env.ts`

**Interfaces :**
- Consumes : tout le bloc Produces de la tâche 2.
- Produces :
  - `lireLigneCoordonnees(): Promise<LigneCoordonnees | null>` (via `lire`, repli `null`)
  - `lireCoordonnees(): Promise<Coordonnees & { lienWhatsApp: string | null; whatsAppExemple: boolean }>` enveloppé dans `cache` de React
  - `lireFaq(): Promise<QuestionFaq[]>` (ordre `ordre` puis `created_at`, passe par `questionsFaq`)

- [ ] **Step 1 : lectures** dans `data.ts` sur le modèle de `listerChiffresCles`. `lireCoordonnees` calcule le WhatsApp avec `resoudreWhatsApp(ligne?.whatsapp ?? "", process.env.WHATSAPP_NUMERO ?? "", horsProduction)` (même définition de `horsProduction` qu'aujourd'hui).
- [ ] **Step 2 : composants** : `Footer`, `DeuxPortes`, `BoutonWhatsApp`, `LienWhatsApp` deviennent des composants serveur `async` qui appellent `lireCoordonnees()`. Pied de page et page contact : ligne téléphone (icône `Phone` de lucide, lien `lienTelephone`) seulement si `telephone` non vide ; la rue précède la ville quand elle est renseignée (pied de page et mentions légales). Pied de page : sous l'adresse de France, une seconde ligne `MapPin` « {adresseRdc} (RD Congo) » si `adresseRdc` est non vide, puis la phrase « Collecte partout en France · Distribution en France et au Congo ».
- [ ] **Step 3 : pages** : remplacer `site.email` / `site.adresse.*` par les coordonnées lues dans `contact`, `mentions-legales`, `confidentialite` et le JSON-LD de `(site)/layout.tsx` (ajouter `telephone` au JSON-LD s'il est renseigné, et `streetAddress` si la rue l'est). `comment-ca-marche` et la FAQ courte de `contact` utilisent `await lireFaq()` ; le JSON-LD FAQ passe par `jsonLdSur` et le commentaire « aucune donnée utilisateur » est corrigé. Le JSON-LD du layout passe aussi par `jsonLdSur`.
- [ ] **Step 4 : notifications** : `resendConfigure` n'exige plus `CONTACT_NOTIFICATION_EMAIL` (seulement clé et expéditeur). Dans `contact/actions.ts`, les destinataires viennent de `destinatairesNotification((await lireLigneCoordonnees())?.email, env.CONTACT_NOTIFICATION_EMAIL)` ; liste vide → `console.warn` et pas d'envoi.
- [ ] **Step 5 : vérifier** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` (sans Supabase configuré : le build passe et les pages rendent le contenu du code).
- [ ] **Step 6 : commit** `Site : FAQ et coordonnées lues en base, téléphone affiché`

### Task 4 : back-office FAQ

**Files :**
- Modify : `src/lib/validation/contenu.ts`, create `src/lib/validation/contenu.test.ts`
- Modify : `src/lib/admin-data.ts`, `src/components/admin/navigation-admin.tsx`
- Create : `src/app/admin/faq/page.tsx`, `src/app/admin/faq/editeur-faq.tsx`, `src/app/admin/faq/actions.ts`

**Interfaces :**
- Produces : `schemaQuestionFaq` (`question` 3–200, `reponse` 3–2000, `public` enum, `essentielle` booléen, `ordre` entier 0–99), `listerQuestionsFaq(): Promise<LigneFaq[]>`, actions `enregistrerQuestion(id: string | null, donneesBrutes: unknown): Promise<ResultatAction>` et `supprimerQuestion(id: string): Promise<ResultatAction>`.

- [ ] **Step 1 : tests qui échouent** pour `schemaQuestionFaq` : question valide acceptée ; question de 2 caractères refusée ; `public: "autre"` refusé ; réponse de 2001 caractères refusée.
- [ ] **Step 2 : `npm test`** échoue, puis implémenter le schéma ; `npm test` passe.
- [ ] **Step 3 : actions et page** : copier la structure de `src/app/admin/chiffres/` (contrôle `accesAdmin`, `valider`, `echec`). `rafraichir()` revalide `/comment-ca-marche`, `/contact` et `/admin/faq`. L'éditeur affiche, par question : question, réponse (zone de texte), public (liste : « Donateurs », « Bénéficiaires », « Tous »), case « Afficher aussi sous le formulaire de contact », position. Texte d'aide : « Les questions s'affichent dans cet ordre sur la page Comment ça marche. Celles cochées apparaissent aussi sous le formulaire de contact. »
- [ ] **Step 4 : navigation** : entrée « FAQ » (icône `CircleHelp`) après « Chiffres ».
- [ ] **Step 5 : vérifier** `npm test`, `npm run typecheck`, `npm run lint`.
- [ ] **Step 6 : commit** `Back-office : édition de la FAQ`

### Task 5 : back-office Coordonnées

**Files :**
- Modify : `src/lib/validation/contenu.ts`, `src/lib/validation/contenu.test.ts`, `src/lib/admin-data.ts`, `src/components/admin/navigation-admin.tsx`
- Create : `src/app/admin/coordonnees/page.tsx`, `src/app/admin/coordonnees/formulaire-coordonnees.tsx`, `src/app/admin/coordonnees/actions.ts`

**Interfaces :**
- Consumes : `lireLigneCoordonnees` (tâche 3), `fusionnerCoordonnees` (tâche 2) pour préremplir le formulaire.
- Produces : `schemaCoordonnees` ; action `enregistrerCoordonnees(donneesBrutes: unknown): Promise<ResultatAction>`.

- [ ] **Step 1 : tests qui échouent** pour `schemaCoordonnees` : e-mail invalide refusé ; code postal `"9424"` refusé, `"94240"` accepté ; téléphone vide accepté, `"+33 6 12 34 56 78"` accepté, `"abc"` refusé ; WhatsApp vide accepté, `"+243 81 234 5678"` accepté, `"12"` refusé (moins de 8 chiffres) ; ville d'un caractère refusée ; rue vide acceptée ; adresse RDC vide acceptée, 201 caractères refusée.
- [ ] **Step 2 : `npm test`** échoue, puis implémenter (téléphone : `^[+\d\s().-]{0,30}$` ; WhatsApp : vide ou 8 à 15 chiffres une fois les non-chiffres retirés) ; `npm test` passe.
- [ ] **Step 3 : action** : `upsert({ id: true, … }, { onConflict: "id" })` ; chaînes vides enregistrées en `null` ; `revalidatePath("/", "layout")` et `revalidatePath("/admin/coordonnees")`.
- [ ] **Step 4 : page** : formulaire unique prérempli, bouton « Enregistrer », erreurs sous chaque champ. Textes d'aide : « Ces coordonnées s'affichent dans le pied de page, la page contact et les mentions légales. » ; sous l'e-mail : « C'est aussi l'adresse qui reçoit les messages du formulaire de contact. » ; sous le téléphone : « Laissez vide pour ne pas afficher de téléphone. » ; sous l'adresse RDC : « Adresse postale de l'association à Kinshasa, affichée dans le pied de page. Laissez vide pour la masquer. » ; sous WhatsApp : « Format international, par exemple +33 6 12 34 56 78. »
- [ ] **Step 5 : navigation** : entrée « Coordonnées » (icône `Contact`) après « FAQ ».
- [ ] **Step 6 : vérifier** `npm test`, `npm run typecheck`, `npm run lint`.
- [ ] **Step 7 : commit** `Back-office : édition des coordonnées`

### Task 6 : documentation et vérification finale

**Files :**
- Modify : `README.md`, `docs/admin.md`, `src/lib/site.ts` (commentaire d'en-tête : les coordonnées se modifient désormais dans le back-office, ce fichier sert de repli)

- [ ] **Step 1 :** README et `docs/admin.md` : les trois étapes de « Mise en service » de la spec, et les deux nouvelles pages du back-office.
- [ ] **Step 2 :** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` passent.
- [ ] **Step 3 : commit** `Documentation : FAQ et coordonnées modifiables`
