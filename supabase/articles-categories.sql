-- =============================================================================
--  Rubriques des articles (filtre de la page Actualités)
-- =============================================================================
--
--  À exécuter UNE fois, APRÈS la mise en ligne de la PR « filtre et recherche
--  des actualités » : Dashboard Supabase > SQL Editor > New query > Run.
--
--  1. ajoute la colonne « categorie » à la table des articles ;
--  2. range chacun des 24 articles dans sa rubrique.
--
--  Sans risque si vous le rejouez : un article déjà rangé (ici ou dans le
--  back-office) n'est jamais déplacé.
-- =============================================================================

begin;

-- 1. Colonne (identique à la section 16 de supabase/schema.sql) -------------
alter table public.articles add column if not exists categorie text;

alter table public.articles drop constraint if exists articles_categorie_valide;
alter table public.articles
  add constraint articles_categorie_valide check (
    categorie is null or categorie in ('entreprises', 'beneficiaires', 'congo', 'association')
  );

-- 2. Rubrique de chaque article ---------------------------------------------
update public.articles as a
set categorie = r.categorie
from (values
    ('que-faire-des-vieux-ordinateurs-de-son-entreprise', 'entreprises'),
    ('don-materiel-informatique-entreprise-association', 'entreprises'),
    ('effacement-des-donnees', 'entreprises'),
    ('deee-obligations-entreprises', 'entreprises'),
    ('don-de-materiel-rapport-rse', 'entreprises'),
    ('don-materiel-reduction-impot-mecenat-en-nature', 'entreprises'),
    ('renouvellement-parc-informatique-seconde-vie', 'entreprises'),
    ('demenagement-bureaux-que-faire-du-materiel', 'entreprises'),
    ('pourquoi-donner-plutot-que-jeter', 'entreprises'),
    ('quel-materiel-informatique-donner', 'entreprises'),
    ('don-materiel-informatique-ile-de-france', 'entreprises'),
    ('equiper-une-ecole-en-ordinateurs', 'beneficiaires'),
    ('association-materiel-informatique-gratuit', 'beneficiaires'),
    ('creer-salle-informatique-ecole', 'beneficiaires'),
    ('mairie-materiel-informatique-reconditionne', 'beneficiaires'),
    ('ordinateur-reconditionne-definition-fiabilite', 'beneficiaires'),
    ('informatique-ecoles-rdc', 'congo'),
    ('envoyer-materiel-informatique-congo', 'congo'),
    ('fracture-numerique-rdc-education', 'congo'),
    ('reparer-devient-un-metier', 'congo'),
    ('aider-ecoles-congo-depuis-la-france', 'congo'),
    ('donner-ordinateur-association-particulier', 'association'),
    ('respusse-qui-sommes-nous', 'association'),
    ('adherer-benevole-partenaire-respusse', 'association')
) as r (slug, categorie)
where a.slug = r.slug and a.categorie is null;

commit;

-- 3. Vérification -----------------------------------------------------------
select coalesce(categorie, '(non classé)') as rubrique, statut, count(*)
from public.articles group by 1, 2 order by 1, 2;
