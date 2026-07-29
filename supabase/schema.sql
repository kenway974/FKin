-- =============================================================================
--  Schéma de la base — Dons solidaires Île-de-France ↔ Congo
-- =============================================================================
--
--  CE FICHIER N'A PAS ÉTÉ APPLIQUÉ. Il est fourni tel quel, à exécuter
--  vous-même dans votre propre projet Supabase.
--
--  Comment l'appliquer :
--    1. Ouvrez votre projet sur https://supabase.com
--    2. Menu de gauche > « SQL Editor » > « New query »
--    3. Collez l'intégralité de ce fichier, puis cliquez sur « Run »
--
--  Le script est idempotent : vous pouvez le rejouer sans casser l'existant.
--
--  Ordre du fichier :
--    1. Extensions
--    2. Fonctions utilitaires
--    3. Table `admins` (qui a accès au back-office)
--    4. Table `articles`
--    5. Table `projets`
--    6. Table `messages`
--    7. Politiques RLS
--    8. Bucket de stockage des images
-- =============================================================================


-- -----------------------------------------------------------------------------
--  1. Extensions
-- -----------------------------------------------------------------------------

-- `gen_random_uuid()` sert d'identifiant par défaut à toutes les tables.
create extension if not exists pgcrypto;


-- -----------------------------------------------------------------------------
--  2. Fonctions utilitaires
-- -----------------------------------------------------------------------------

-- Tient `updated_at` à jour automatiquement à chaque UPDATE.
--
-- `search_path` est figé : sans cela, un rôle disposant d'un schéma temporaire
-- pourrait y placer sa propre fonction `now()` et détourner l'appel.
create or replace function public.maj_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, pg_temp
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;


-- -----------------------------------------------------------------------------
--  3. Table `admins`
-- -----------------------------------------------------------------------------
--  Qui peut administrer le site.
--
--  Le droit d'administration n'est PAS codé en dur dans l'application : il
--  correspond à la présence d'une ligne dans cette table. Pour ajouter un
--  second administrateur plus tard, il suffit de créer l'utilisateur dans
--  Supabase Auth puis d'insérer son identifiant ici — aucun changement de code.

create table if not exists public.admins (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  email         text,
  nom_affichage text,
  created_at    timestamptz not null default now()
);

comment on table public.admins is
  'Comptes autorisés à accéder au back-office. Une ligne = un administrateur.';


-- Vérifie que l'utilisateur courant est administrateur.
--
-- `security definer` est indispensable : la fonction est appelée depuis les
-- politiques RLS de `admins` elle-même, ce qui provoquerait une récursion
-- infinie si elle était soumise à ces mêmes politiques.
-- `search_path` est figé pour empêcher toute substitution de schéma.
create or replace function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

comment on function public.est_admin() is
  'Vrai si l''utilisateur authentifié figure dans la table admins.';

-- Ferme l'accès RPC (/rest/v1/rpc/est_admin) aux visiteurs non authentifiés.
--
-- `authenticated` doit en revanche conserver EXECUTE : une expression de
-- politique RLS est évaluée avec les droits du rôle qui interroge la base.
-- Révoquer ce droit rendrait tout le back-office inaccessible.
revoke execute on function public.est_admin() from public;
revoke execute on function public.est_admin() from anon;
grant  execute on function public.est_admin() to authenticated;


-- -----------------------------------------------------------------------------
--  4. Table `articles` — blog / actualités
-- -----------------------------------------------------------------------------

create table if not exists public.articles (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  titre            text not null,
  extrait          text,
  contenu          text not null,
  image_couverture text,
  image_alt        text,
  statut           text not null default 'brouillon',
  date_publication date,
  auteur           text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint articles_statut_valide check (statut in ('brouillon', 'publie')),
  constraint articles_slug_format   check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint articles_titre_non_vide check (length(trim(titre)) > 0)
);

comment on column public.articles.contenu is
  'Texte brut. Les lignes vides séparent les paragraphes ; aucun HTML n''est interprété au rendu.';

-- Index de la requête la plus fréquente du site : les articles publiés, du plus
-- récent au plus ancien.
create index if not exists articles_publies_idx
  on public.articles (date_publication desc)
  where statut = 'publie';

drop trigger if exists articles_maj_updated_at on public.articles;
create trigger articles_maj_updated_at
  before update on public.articles
  for each row execute function public.maj_updated_at();


-- -----------------------------------------------------------------------------
--  5. Table `projets` — galerie des réalisations
-- -----------------------------------------------------------------------------

create table if not exists public.projets (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  titre         text not null,
  description   text not null,
  lieu          text not null,
  date_projet   date,
  type_materiel text not null,
  resultat      text not null,
  image_url     text,
  image_alt     text,
  publie        boolean not null default true,
  ordre         integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint projets_slug_format    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projets_ordre_positif  check (ordre >= 0),
  constraint projets_titre_non_vide check (length(trim(titre)) > 0)
);

comment on column public.projets.ordre is
  'Ordre d''affichage dans la galerie. Les plus petites valeurs passent en premier.';
comment on column public.projets.resultat is
  'Ce que le matériel a concrètement permis de faire. C''est l''information la plus consultée par les entreprises donatrices.';

create index if not exists projets_publies_idx
  on public.projets (ordre asc, date_projet desc)
  where publie = true;

drop trigger if exists projets_maj_updated_at on public.projets;
create trigger projets_maj_updated_at
  before update on public.projets
  for each row execute function public.maj_updated_at();


-- -----------------------------------------------------------------------------
--  6. Table `messages` — formulaire de contact
-- -----------------------------------------------------------------------------

create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  nom           text not null,
  email         text not null,
  organisation  text,
  telephone     text,
  type_emetteur text not null,
  sujet         text not null,
  message       text not null,
  lu            boolean not null default false,
  created_at    timestamptz not null default now(),

  constraint messages_type_emetteur_valide
    check (type_emetteur in ('entreprise', 'beneficiaire')),
  constraint messages_email_plausible
    check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'),
  constraint messages_message_non_vide
    check (length(trim(message)) > 0)
);

comment on table public.messages is
  'Messages reçus via le formulaire de contact. Insérés uniquement par le serveur (clé service_role) : le rôle anonyme n''a aucun droit d''écriture.';

create index if not exists messages_recents_idx on public.messages (created_at desc);
create index if not exists messages_non_lus_idx on public.messages (created_at desc) where lu = false;


-- -----------------------------------------------------------------------------
--  7. Politiques RLS (Row Level Security)
-- -----------------------------------------------------------------------------
--  Principe : tout est interdit par défaut, on ouvre au cas par cas.
--
--    - `articles` : le public lit les articles publiés ; les admins font tout.
--    - `projets`  : le public lit les projets visibles ; les admins font tout.
--    - `messages` : aucun accès public. Seuls les admins lisent, mettent à jour
--                   et suppriment. Les insertions passent par la clé
--                   service_role, qui contourne la RLS côté serveur.
--    - `admins`   : chacun peut vérifier sa propre ligne ; seuls les admins
--                   voient la liste complète. La gestion des administrateurs se
--                   fait volontairement depuis le dashboard Supabase.

alter table public.articles enable row level security;
alter table public.projets  enable row level security;
alter table public.messages enable row level security;
alter table public.admins   enable row level security;

-- --- articles ----------------------------------------------------------------

drop policy if exists "Articles publiés visibles par tous" on public.articles;
create policy "Articles publiés visibles par tous"
  on public.articles for select
  to anon, authenticated
  using (statut = 'publie');

drop policy if exists "Les admins lisent tous les articles" on public.articles;
create policy "Les admins lisent tous les articles"
  on public.articles for select
  to authenticated
  using (public.est_admin());

drop policy if exists "Les admins créent des articles" on public.articles;
create policy "Les admins créent des articles"
  on public.articles for insert
  to authenticated
  with check (public.est_admin());

drop policy if exists "Les admins modifient les articles" on public.articles;
create policy "Les admins modifient les articles"
  on public.articles for update
  to authenticated
  using (public.est_admin())
  with check (public.est_admin());

drop policy if exists "Les admins suppriment les articles" on public.articles;
create policy "Les admins suppriment les articles"
  on public.articles for delete
  to authenticated
  using (public.est_admin());

-- --- projets -----------------------------------------------------------------

drop policy if exists "Projets visibles par tous" on public.projets;
create policy "Projets visibles par tous"
  on public.projets for select
  to anon, authenticated
  using (publie = true);

drop policy if exists "Les admins lisent tous les projets" on public.projets;
create policy "Les admins lisent tous les projets"
  on public.projets for select
  to authenticated
  using (public.est_admin());

drop policy if exists "Les admins créent des projets" on public.projets;
create policy "Les admins créent des projets"
  on public.projets for insert
  to authenticated
  with check (public.est_admin());

drop policy if exists "Les admins modifient les projets" on public.projets;
create policy "Les admins modifient les projets"
  on public.projets for update
  to authenticated
  using (public.est_admin())
  with check (public.est_admin());

drop policy if exists "Les admins suppriment les projets" on public.projets;
create policy "Les admins suppriment les projets"
  on public.projets for delete
  to authenticated
  using (public.est_admin());

-- --- messages ----------------------------------------------------------------
-- Aucune politique d'insertion : c'est volontaire. Les messages entrants sont
-- écrits par le serveur avec la clé service_role, qui n'est pas soumise à la
-- RLS. Un visiteur ne peut donc pas insérer directement en base.

drop policy if exists "Les admins lisent les messages" on public.messages;
create policy "Les admins lisent les messages"
  on public.messages for select
  to authenticated
  using (public.est_admin());

drop policy if exists "Les admins marquent les messages comme lus" on public.messages;
create policy "Les admins marquent les messages comme lus"
  on public.messages for update
  to authenticated
  using (public.est_admin())
  with check (public.est_admin());

drop policy if exists "Les admins suppriment les messages" on public.messages;
create policy "Les admins suppriment les messages"
  on public.messages for delete
  to authenticated
  using (public.est_admin());

-- --- admins ------------------------------------------------------------------

drop policy if exists "Chacun voit sa propre fiche admin" on public.admins;
create policy "Chacun voit sa propre fiche admin"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Les admins voient toute l'équipe" on public.admins;
create policy "Les admins voient toute l'équipe"
  on public.admins for select
  to authenticated
  using (public.est_admin());


-- -----------------------------------------------------------------------------
--  8. Stockage des images
-- -----------------------------------------------------------------------------
--  Bucket public en lecture (les photos s'affichent sur le site) mais dont
--  l'écriture est réservée aux administrateurs.
--
--  Le nom « medias » doit correspondre à la variable NEXT_PUBLIC_SUPABASE_BUCKET.

insert into storage.buckets (id, name, public)
values ('medias', 'medias', true)
on conflict (id) do nothing;

-- Aucune politique SELECT : c'est volontaire.
--
-- Un bucket public sert déjà ses fichiers via /storage/v1/object/public/…
-- sans passer par la RLS. Une politique SELECT large n'aurait servi qu'à
-- l'API `list()` — que l'application n'utilise pas — et aurait permis
-- d'énumérer l'intégralité des fichiers téléversés.
--
-- Si un jour les images cessaient de s'afficher, c'est la première piste à
-- vérifier ; la politique à rétablir serait :
--   create policy "Images lisibles par tous"
--     on storage.objects for select
--     to anon, authenticated
--     using (bucket_id = 'medias');

drop policy if exists "Images lisibles par tous" on storage.objects;

drop policy if exists "Les admins téléversent des images" on storage.objects;
create policy "Les admins téléversent des images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'medias' and public.est_admin());

drop policy if exists "Les admins remplacent des images" on storage.objects;
create policy "Les admins remplacent des images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'medias' and public.est_admin())
  with check (bucket_id = 'medias' and public.est_admin());

drop policy if exists "Les admins suppriment des images" on storage.objects;
create policy "Les admins suppriment des images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'medias' and public.est_admin());


-- =============================================================================
--  ÉTAPE SUIVANTE — déclarer votre compte administrateur
-- =============================================================================
--
--  1. Créez d'abord l'utilisateur : dashboard Supabase > Authentication >
--     Users > « Add user » > « Create new user ». Cochez « Auto Confirm User ».
--
--  2. Puis exécutez la requête ci-dessous en remplaçant l'adresse e-mail.
--     Elle retrouve l'identifiant du compte et l'inscrit comme administrateur.
--
--     insert into public.admins (user_id, email, nom_affichage)
--     select id, email, 'Votre prénom'
--     from auth.users
--     where email = 'vous@votre-domaine.fr'
--     on conflict (user_id) do nothing;
--
--  3. Vérifiez :  select * from public.admins;
--
--  Pour ajouter un second administrateur plus tard, répétez ces deux étapes.
--  Pour en retirer un :  delete from public.admins where email = '…';
-- =============================================================================
