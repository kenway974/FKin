"use client";

import type * as React from "react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import {
  Armchair,
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Laptop,
  Monitor,
  Package,
  PcCase,
  Printer,
  Router,
  TabletSmartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blob } from "@/components/formes";
import { Surtitre } from "@/components/ui/surtitre";
import { ChampFormulaire, Input, Textarea } from "@/components/ui/field";
import {
  DELAIS,
  EFFECTIFS,
  ETATS,
  MATERIELS,
  PAYS,
  QUANTITES,
  STRUCTURES,
  type ChampsContact,
} from "@/lib/validation/contact";
import { ChoixPastilles, SelecteurPhotos, type PhotoJointe } from "./elements-formulaire";
import { TEXTES } from "./textes-contact";
import { cn } from "@/lib/utils";

/**
 * Les étapes du formulaire de contact. Chacune lit le formulaire par le
 * contexte de react-hook-form (`FormProvider` dans le parent) : pas de
 * props à faire descendre champ par champ.
 */

type Profil = NonNullable<ChampsContact["typeEmetteur"]>;

const ICONES_MATERIEL = {
  portables: Laptop,
  fixes: PcCase,
  ecrans: Monitor,
  imprimantes: Printer,
  tablettes: TabletSmartphone,
  reseau: Router,
  mobilier: Armchair,
  autre: Package,
};

/**
 * Groupe de pastilles branché sur le formulaire : une erreur affichée
 * disparaît dès qu'un choix est fait, sans attendre que le focus quitte le
 * groupe.
 */
function Pastilles({
  champ,
  ...proprietes
}: { champ: keyof ChampsContact } & Omit<
  React.ComponentProps<typeof ChoixPastilles>,
  "id" | "enregistrement" | "erreur"
>) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<ChampsContact>();
  return (
    <ChoixPastilles
      id={champ}
      enregistrement={register(champ, {
        onChange: () => {
          if (errors[champ]) void trigger(champ);
        },
      })}
      erreur={errors[champ]?.message}
      {...proprietes}
    />
  );
}

/* ------------------------------------------------------------- 1. Profil */

const PROFILS = [
  {
    valeur: "entreprise" as const,
    libelle: "Je donne du matériel",
    precision: "Entreprise ou organisation, partout en France.",
    icone: Building2,
    teinte: "text-rouge peer-focus-visible:ring-rouge",
    forme: "forme-blob-1 bg-rouge-voile group-hover:bg-rouge-vif group-has-[:checked]:bg-rouge-vif",
  },
  {
    valeur: "beneficiaire" as const,
    libelle: "Je cherche du matériel",
    precision: "École, mairie ou association, en France ou au Congo.",
    icone: GraduationCap,
    teinte: "text-bleu peer-focus-visible:ring-bleu",
    forme: "forme-blob-2 bg-bleu-voile group-hover:bg-bleu-vif group-has-[:checked]:bg-bleu-vif",
  },
];

/** Choisir un profil ouvre directement l'étape suivante. */
export function EtapeProfil({ onChoisir }: { onChoisir: (profil: Profil) => void }) {
  const profil = useFormContext<ChampsContact>().watch("typeEmetteur");
  return (
    <fieldset>
      <legend className="sr-only">Votre profil</legend>
      <div className="grid gap-6 sm:grid-cols-2">
        {PROFILS.map((element) => (
          <label key={element.valeur} className="group flex cursor-pointer items-center gap-4">
            <input
              type="radio"
              name="profil"
              value={element.valeur}
              checked={profil === element.valeur}
              onChange={() => onChoisir(element.valeur)}
              onClick={() => onChoisir(element.valeur)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "relative isolate inline-grid size-20 shrink-0 place-items-center rounded-full ring-offset-4 transition-colors duration-300 group-hover:text-white group-has-[:checked]:text-white peer-focus-visible:ring-3",
                element.teinte,
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "blob-anime absolute inset-0 -z-10 transition-colors duration-300",
                  element.forme,
                )}
              />
              <element.icone className="size-8" aria-hidden="true" />
            </span>
            <span>
              <span className="text-encre block text-xl font-semibold">{element.libelle}</span>
              <span className="text-doux mt-0.5 block text-sm">{element.precision}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ----------------------------------------------- 2. Matériel ou besoins */

export function EtapeBesoins({
  profil,
  photos,
  onPhotos,
}: {
  profil: Profil;
  photos: PhotoJointe[];
  onPhotos: React.Dispatch<React.SetStateAction<PhotoJointe[]>>;
}) {
  const textes = TEXTES[profil];
  return (
    <>
      <Pastilles
        champ="materiel"
        multiple
        legende={textes.materiel}
        aide="Plusieurs choix possibles."
        options={MATERIELS}
        icones={ICONES_MATERIEL}
      />
      <Pastilles champ="quantite" legende={textes.quantite} options={QUANTITES} />
      {profil === "entreprise" ? (
        <Pastilles
          champ="etat"
          legende="État général"
          aide="Même hors service, du matériel peut être réparé ou recyclé proprement."
          options={ETATS}
        />
      ) : (
        <>
          <Pastilles champ="structure" legende="Votre structure" options={STRUCTURES} />
          <Pastilles
            champ="effectifs"
            legende="Personnes concernées (élèves, usagers)"
            options={EFFECTIFS}
          />
        </>
      )}
      <SelecteurPhotos
        photos={photos}
        onChange={onPhotos}
        legende={textes.photos}
        aide={textes.aidePhotos}
      />
    </>
  );
}

/* ------------------------------------------------------------- 3. Lieu */

export function EtapeLieu({ profil }: { profil: Profil }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ChampsContact>();
  const textes = TEXTES[profil];
  return (
    <>
      {profil === "beneficiaire" ? <Pastilles champ="pays" legende="Pays" options={PAYS} /> : null}
      <ChampFormulaire
        id="ville"
        libelle={textes.ville}
        requis
        className="max-w-md"
        erreur={errors.ville?.message}
      >
        {(aria) => (
          <Input
            {...aria}
            autoComplete="address-level2"
            placeholder={textes.exempleVille}
            {...register("ville")}
          />
        )}
      </ChampFormulaire>
      {profil === "entreprise" ? (
        <Pastilles champ="delai" legende="Le matériel est disponible…" options={DELAIS} />
      ) : null}
    </>
  );
}

/* ------------------------------------------------------ 4. Coordonnées */

export function EtapeCoordonnees({
  profil,
  photos,
  allerA,
}: {
  profil: Profil;
  photos: number;
  allerA: (etape: number) => void;
}) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<ChampsContact>();
  const textes = TEXTES[profil];
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <ChampFormulaire id="nom" libelle="Nom et prénom" requis erreur={errors.nom?.message}>
          {(aria) => <Input {...aria} autoComplete="name" {...register("nom")} />}
        </ChampFormulaire>
        <ChampFormulaire id="email" libelle="Adresse e-mail" requis erreur={errors.email?.message}>
          {(aria) => (
            <Input
              {...aria}
              type="email"
              inputMode="email"
              autoComplete="email"
              {...register("email")}
            />
          )}
        </ChampFormulaire>
        <ChampFormulaire id="organisation" libelle={textes.organisation}>
          {(aria) => <Input {...aria} autoComplete="organization" {...register("organisation")} />}
        </ChampFormulaire>
        <ChampFormulaire
          id="telephone"
          libelle="Téléphone"
          aide={`Facultatif, utile pour ${textes.usageTelephone}.`}
        >
          {(aria) => (
            <Input
              {...aria}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...register("telephone")}
            />
          )}
        </ChampFormulaire>
      </div>

      <ChampFormulaire
        id="precisions"
        libelle="Quelque chose à ajouter ?"
        aide="Facultatif : accès au local, contraintes d'horaires, précisions sur le lot…"
        erreur={errors.precisions?.message}
      >
        {(aria) => <Textarea {...aria} rows={4} {...register("precisions")} />}
      </ChampFormulaire>

      <Recapitulatif valeurs={getValues()} photos={photos} allerA={allerA} />

      {/*
        Honeypot : masqué visuellement et retiré du parcours au clavier comme
        de l'arbre d'accessibilité. Seul un robot remplissant tous les champs
        le renseignera.
      */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="site-web">Ne pas remplir ce champ</label>
        <input
          id="site-web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("siteWeb")}
        />
      </div>
    </>
  );
}

/** Rappel des réponses avant l'envoi, chaque ligne menant à son étape. */
function Recapitulatif({
  valeurs,
  photos,
  allerA,
}: {
  valeurs: ChampsContact;
  photos: number;
  allerA: (etape: number) => void;
}) {
  const profil = valeurs.typeEmetteur ?? "entreprise";
  const textes = TEXTES[profil];
  const liste = (...elements: (string | undefined)[]) => elements.filter(Boolean).join(", ");
  const minuscule = (texte?: string) => texte?.toLowerCase();

  const lignes = [
    {
      libelle: textes.recapMateriel,
      valeur: liste(...valeurs.materiel.map((cle) => MATERIELS[cle])),
      etape: 1,
    },
    {
      libelle: "Quantité",
      valeur: liste(valeurs.quantite && QUANTITES[valeurs.quantite]),
      etape: 1,
    },
    profil === "entreprise"
      ? { libelle: "État", valeur: liste(valeurs.etat && ETATS[valeurs.etat]), etape: 1 }
      : {
          libelle: "Structure",
          valeur: liste(
            valeurs.structure && STRUCTURES[valeurs.structure],
            valeurs.effectifs && `${minuscule(EFFECTIFS[valeurs.effectifs])} personnes`,
          ),
          etape: 1,
        },
    {
      libelle: textes.recapLieu,
      valeur:
        profil === "entreprise"
          ? liste(valeurs.ville, minuscule(valeurs.delai && DELAIS[valeurs.delai]))
          : liste(valeurs.ville, valeurs.pays && PAYS[valeurs.pays]),
      etape: 2,
    },
    ...(photos
      ? [{ libelle: "Photos", valeur: `${photos} jointe${photos > 1 ? "s" : ""}`, etape: 1 }]
      : []),
  ];

  return (
    <div>
      <Surtitre className="mb-3">Votre demande</Surtitre>
      <dl className="divide-bordure divide-y">
        {lignes.map((ligne) => (
          <div key={ligne.libelle} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
            <dt className="text-doux w-28 shrink-0 text-sm font-semibold">{ligne.libelle}</dt>
            <dd className="text-encre min-w-0 flex-1">{ligne.valeur}</dd>
            <dd>
              <button
                type="button"
                onClick={() => allerA(ligne.etape)}
                className="text-bleu hover:text-bleu-fonce text-sm font-semibold underline underline-offset-4"
              >
                Modifier<span className="sr-only"> : {ligne.libelle.toLowerCase()}</span>
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------- Envoyé */

export function EcranEnvoye({
  message,
  titre,
  onRecommencer,
}: {
  message: string;
  titre: React.Ref<HTMLHeadingElement>;
  onRecommencer: () => void;
}) {
  return (
    <div className="anim-entree py-6">
      <Blob anime={false} teinte="bg-bleu-vif" variante={2} className="size-24 text-white">
        <Check className="size-11" strokeWidth={3} aria-hidden="true" />
      </Blob>
      <h2 ref={titre} tabIndex={-1} className="mt-6 text-3xl font-bold outline-none md:text-4xl">
        C&apos;est envoyé !
      </h2>
      <p role="status" className="text-doux mt-3 max-w-xl text-lg">
        {message}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Button asChild>
          <Link href="/realisations">
            Voir nos réalisations
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button type="button" variante="courbe" onClick={onRecommencer}>
          Envoyer une autre demande
        </Button>
      </div>
    </div>
  );
}
