"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Armchair,
  ArrowLeft,
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
  Send,
  TabletSmartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Blob } from "@/components/formes";
import { AideChamp, Champ, Input, Label, MessageErreur, Textarea } from "@/components/ui/field";
import {
  CHAMPS_PAR_ETAPE,
  DELAIS,
  EFFECTIFS,
  ETATS,
  MATERIELS,
  PAYS,
  QUANTITES,
  STRUCTURES,
  schemaContact,
  type ChampsContact,
} from "@/lib/validation/contact";
import { envoyerMessageContact } from "./actions";
import {
  ChoixPastilles,
  Progression,
  SelecteurPhotos,
  type PhotoJointe,
} from "./elements-formulaire";
import type { ResultatContact } from "@/lib/actions-types";
import { cn } from "@/lib/utils";

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

const TITRES = {
  entreprise: ["Vous", "Le matériel", "L'enlèvement", "Vos coordonnées"],
  beneficiaire: ["Vous", "Vos besoins", "Le lieu", "Vos coordonnées"],
};

const QUESTIONS = {
  entreprise: [
    "Qui êtes-vous ?",
    "Quel matériel souhaitez-vous donner ?",
    "Où et quand venir le chercher ?",
    "Comment vous joindre ?",
  ],
  beneficiaire: [
    "Qui êtes-vous ?",
    "De quoi avez-vous besoin ?",
    "Où se trouve votre structure ?",
    "Comment vous joindre ?",
  ],
};

/** Clé du brouillon conservé le temps de la visite (hors photos). */
const CLE_BROUILLON = "brouillon-contact";

/**
 * Formulaire de contact en quatre étapes : profil, matériel (ou besoins),
 * lieu, coordonnées. Une question à la fois, en pastilles plutôt qu'en
 * champs libres : moins d'effort pour le visiteur, et des demandes
 * directement exploitables pour l'association.
 *
 * - Le schéma zod est partagé avec la Server Action : la validation affichée
 *   et celle appliquée côté serveur ne peuvent pas diverger. Chaque étape
 *   valide uniquement ses propres champs avant de passer à la suivante.
 * - `?profil=entreprise|beneficiaire` pré-sélectionne le profil et ouvre
 *   directement la deuxième étape (liens « Proposer un don », « Demander un
 *   équipement » des autres pages).
 * - Les réponses sont gardées en brouillon le temps de la visite : quitter la
 *   page puis revenir ne fait rien perdre.
 * - Photos facultatives, compressées dans le navigateur avant l'envoi.
 */
export function FormulaireContact() {
  const parametres = useSearchParams();
  const profilUrl = parametres.get("profil");
  const profilInitial =
    profilUrl === "entreprise" || profilUrl === "beneficiaire" ? profilUrl : undefined;

  const [etape, setEtape] = React.useState(profilInitial ? 1 : 0);
  const [photos, setPhotos] = React.useState<PhotoJointe[]>([]);
  const [resultat, setResultat] = React.useState<ResultatContact | null>(null);
  const [envoye, setEnvoye] = React.useState(false);
  const referenceHaut = React.useRef<HTMLDivElement>(null);
  const referenceTitre = React.useRef<HTMLHeadingElement>(null);
  const premierRendu = React.useRef(true);

  // Horodatage d'affichage : sert de piège temporel côté serveur.
  const [charge] = React.useState(() => Date.now());

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    setValue,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ChampsContact>({
    resolver: zodResolver(schemaContact) as unknown as Resolver<ChampsContact>,
    mode: "onTouched",
    defaultValues: {
      typeEmetteur: profilInitial,
      materiel: [],
      ville: "",
      nom: "",
      email: "",
      organisation: "",
      telephone: "",
      precisions: "",
      siteWeb: "",
    },
  });

  // Groupes de pastilles : une erreur affichée disparaît dès qu'un choix est
  // fait (sans attendre que le focus quitte le groupe).
  const pastilles = (champ: keyof ChampsContact) =>
    register(champ, {
      onChange: () => {
        if (errors[champ]) void trigger(champ);
      },
    });

  const profil = watch("typeEmetteur");
  const parcours = profil ?? "entreprise";

  // Brouillon : restauré à l'ouverture, enregistré à chaque modification.
  React.useEffect(() => {
    try {
      const brouillon = sessionStorage.getItem(CLE_BROUILLON);
      if (brouillon) {
        const valeurs = JSON.parse(brouillon) as Partial<ChampsContact>;
        reset({
          ...getValues(),
          ...valeurs,
          typeEmetteur: profilInitial ?? valeurs.typeEmetteur,
        });
      }
    } catch {
      /* stockage indisponible : on continue sans brouillon */
    }
    const abonnement = watch((valeurs) => {
      try {
        const aGarder = { ...valeurs };
        delete aGarder.siteWeb;
        delete aGarder.charge;
        sessionStorage.setItem(CLE_BROUILLON, JSON.stringify(aGarder));
      } catch {
        /* idem */
      }
    });
    return () => abonnement.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule fois, à l'ouverture
  }, []);

  // À chaque changement d'étape : on remonte en haut du formulaire et on
  // place le focus sur le titre de l'étape (clavier, lecteurs d'écran).
  React.useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    referenceHaut.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    referenceTitre.current?.focus({ preventScroll: true });
  }, [etape, envoye]);

  async function suivant() {
    if (!profil) return;
    const valide = await trigger(CHAMPS_PAR_ETAPE[profil][etape]);
    if (valide) setEtape((courante) => courante + 1);
  }

  function choisirProfil(valeur: "entreprise" | "beneficiaire") {
    setValue("typeEmetteur", valeur, { shouldDirty: true });
    setEtape(1);
  }

  async function auEnvoi(donnees: ChampsContact) {
    const formulaire = new FormData();
    formulaire.set("donnees", JSON.stringify({ ...donnees, charge }));
    for (const photo of photos) formulaire.append("photos", photo.fichier);

    const reponse = await envoyerMessageContact(formulaire);
    setResultat(reponse);

    if (reponse.statut === "succes") {
      try {
        sessionStorage.removeItem(CLE_BROUILLON);
      } catch {
        /* rien à faire */
      }
      photos.forEach((photo) => URL.revokeObjectURL(photo.apercu));
      setEnvoye(true);
      return;
    }

    if (reponse.erreursChamps && profil) {
      // Remonte les erreurs du serveur dans les champs, et revient à la
      // première étape qui en contient.
      const champs = Object.keys(reponse.erreursChamps) as (keyof ChampsContact)[];
      for (const champ of champs) {
        const message = reponse.erreursChamps[champ]?.[0];
        if (message) setError(champ, { type: "server", message });
      }
      const etapeFautive = CHAMPS_PAR_ETAPE[profil].findIndex((liste) =>
        liste.some((champ) => champs.includes(champ)),
      );
      if (etapeFautive >= 0) setEtape(etapeFautive);
    }
  }

  /* ------------------------------------------------------------ Envoyé */
  if (envoye && resultat) {
    return (
      <div ref={referenceHaut} className="anim-entree scroll-mt-28 py-6">
        <Blob anime={false} teinte="bg-bleu-vif" variante={2} className="size-24 text-white">
          <Check className="size-11" strokeWidth={3} aria-hidden="true" />
        </Blob>
        <h2
          ref={referenceTitre}
          tabIndex={-1}
          className="mt-6 text-3xl font-bold outline-none md:text-4xl"
        >
          C&apos;est envoyé !
        </h2>
        <p role="status" className="text-doux mt-3 max-w-xl text-lg">
          {resultat.message}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button asChild>
            <Link href="/realisations">
              Voir nos réalisations
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            type="button"
            variante="courbe"
            onClick={() => {
              reset({ ...getValues(), materiel: [], precisions: "" });
              setPhotos([]);
              setResultat(null);
              setEnvoye(false);
              setEtape(1);
            }}
          >
            Envoyer une autre demande
          </Button>
        </div>
      </div>
    );
  }

  const profils = [
    {
      valeur: "entreprise" as const,
      libelle: "Je donne du matériel",
      precision: "Entreprise ou organisation, partout en France.",
      icone: Building2,
    },
    {
      valeur: "beneficiaire" as const,
      libelle: "Je cherche du matériel",
      precision: "École, mairie ou association, en France ou au Congo.",
      icone: GraduationCap,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(auEnvoi)}
      noValidate
      className="space-y-10"
      aria-labelledby="titre-etape"
    >
      <div ref={referenceHaut} className="scroll-mt-28">
        <Progression titres={TITRES[parcours]} etape={etape} />
      </div>

      {resultat?.statut === "erreur" ? (
        <Alert ton="erreur" titre="Envoi impossible">
          <p>{resultat.message}</p>
        </Alert>
      ) : null}

      {/* Chaque étape entre en glissant depuis la droite. */}
      <div key={etape} className="anim-entree-laterale space-y-8">
        <h2
          id="titre-etape"
          ref={referenceTitre}
          tabIndex={-1}
          className="text-2xl font-bold outline-none md:text-3xl"
        >
          {QUESTIONS[parcours][etape]}
        </h2>

        {/* ------------------------------------------------ 1. Profil */}
        {etape === 0 ? (
          <fieldset>
            <legend className="sr-only">Votre profil</legend>
            {/* Pas de cartes : chaque profil est un grand pictogramme posé sur
                une forme souple. Choisir un profil ouvre l'étape suivante. */}
            <div className="grid gap-6 sm:grid-cols-2">
              {profils.map((element, index) => (
                <label
                  key={element.valeur}
                  className="group flex cursor-pointer items-center gap-4"
                >
                  <input
                    type="radio"
                    name="profil"
                    value={element.valeur}
                    checked={profil === element.valeur}
                    onChange={() => choisirProfil(element.valeur)}
                    onClick={() => choisirProfil(element.valeur)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "relative isolate inline-grid size-20 shrink-0 place-items-center rounded-full ring-offset-4 transition-colors duration-300 peer-focus-visible:ring-3",
                      index === 0
                        ? "text-rouge peer-focus-visible:ring-rouge group-hover:text-white group-has-[:checked]:text-white"
                        : "text-bleu peer-focus-visible:ring-bleu group-hover:text-white group-has-[:checked]:text-white",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "blob-anime absolute inset-0 -z-10 transition-colors duration-300",
                        index === 0
                          ? "forme-blob-1 bg-rouge-voile group-hover:bg-rouge-vif group-has-[:checked]:bg-rouge-vif"
                          : "forme-blob-2 bg-bleu-voile group-hover:bg-bleu-vif group-has-[:checked]:bg-bleu-vif",
                      )}
                    />
                    <element.icone className="size-8" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="text-encre block text-xl font-semibold">
                      {element.libelle}
                    </span>
                    <span className="text-doux mt-0.5 block text-sm">{element.precision}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* ------------------------------------ 2. Matériel ou besoins */}
        {etape === 1 && profil ? (
          <>
            <ChoixPastilles
              id="materiel"
              multiple
              legende={profil === "entreprise" ? "Type de matériel" : "Matériel recherché"}
              aide="Plusieurs choix possibles."
              options={MATERIELS}
              icones={ICONES_MATERIEL}
              enregistrement={pastilles("materiel")}
              erreur={errors.materiel?.message}
            />
            <ChoixPastilles
              id="quantite"
              legende={
                profil === "entreprise" ? "Nombre d'appareils, à peu près" : "Quantité souhaitée"
              }
              options={QUANTITES}
              enregistrement={pastilles("quantite")}
              erreur={errors.quantite?.message}
            />
            {profil === "entreprise" ? (
              <ChoixPastilles
                id="etat"
                legende="État général"
                aide="Même hors service, du matériel peut être réparé ou recyclé proprement."
                options={ETATS}
                enregistrement={pastilles("etat")}
                erreur={errors.etat?.message}
              />
            ) : (
              <>
                <ChoixPastilles
                  id="structure"
                  legende="Votre structure"
                  options={STRUCTURES}
                  enregistrement={pastilles("structure")}
                  erreur={errors.structure?.message}
                />
                <ChoixPastilles
                  id="effectifs"
                  legende="Personnes concernées (élèves, usagers)"
                  options={EFFECTIFS}
                  enregistrement={pastilles("effectifs")}
                  erreur={errors.effectifs?.message}
                />
              </>
            )}
            <SelecteurPhotos
              photos={photos}
              onChange={setPhotos}
              legende={profil === "entreprise" ? "Photos du lot" : "Photos de votre local"}
              aide={
                profil === "entreprise"
                  ? "Deux ou trois photos suffisent pour évaluer le lot plus vite. 5 au maximum."
                  : "La salle qui accueillera le matériel nous aide à préparer le bon lot. 5 au maximum."
              }
            />
          </>
        ) : null}

        {/* ------------------------------------------------- 3. Lieu */}
        {etape === 2 && profil ? (
          <>
            {profil === "beneficiaire" ? (
              <ChoixPastilles
                id="pays"
                legende="Pays"
                options={PAYS}
                enregistrement={pastilles("pays")}
                erreur={errors.pays?.message}
              />
            ) : null}
            <Champ className="max-w-md">
              <Label htmlFor="ville">
                {profil === "entreprise" ? "Ville de l'enlèvement" : "Ville"}{" "}
                <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="ville"
                autoComplete="address-level2"
                aria-required="true"
                aria-invalid={errors.ville ? true : undefined}
                aria-describedby={errors.ville ? "erreur-ville" : undefined}
                placeholder={profil === "entreprise" ? "Ex. : Lyon" : "Ex. : Kinshasa"}
                {...register("ville")}
              />
              <MessageErreur id="erreur-ville">{errors.ville?.message}</MessageErreur>
            </Champ>
            {profil === "entreprise" ? (
              <ChoixPastilles
                id="delai"
                legende="Le matériel est disponible…"
                options={DELAIS}
                enregistrement={pastilles("delai")}
                erreur={errors.delai?.message}
              />
            ) : null}
          </>
        ) : null}

        {/* ------------------------------------------- 4. Coordonnées */}
        {etape === 3 && profil ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Champ>
                <Label htmlFor="nom">
                  Nom et prénom <span aria-hidden="true">*</span>
                </Label>
                <Input
                  id="nom"
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={errors.nom ? true : undefined}
                  aria-describedby={errors.nom ? "erreur-nom" : undefined}
                  {...register("nom")}
                />
                <MessageErreur id="erreur-nom">{errors.nom?.message}</MessageErreur>
              </Champ>

              <Champ>
                <Label htmlFor="email">
                  Adresse e-mail <span aria-hidden="true">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "erreur-email" : undefined}
                  {...register("email")}
                />
                <MessageErreur id="erreur-email">{errors.email?.message}</MessageErreur>
              </Champ>

              <Champ>
                <Label htmlFor="organisation">
                  {profil === "entreprise" ? "Entreprise" : "Nom de la structure"}
                </Label>
                <Input
                  id="organisation"
                  autoComplete="organization"
                  {...register("organisation")}
                />
              </Champ>

              <Champ>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-describedby="aide-telephone"
                  {...register("telephone")}
                />
                <AideChamp id="aide-telephone">
                  Facultatif, utile pour{" "}
                  {profil === "entreprise" ? "organiser l'enlèvement" : "vous rappeler"}.
                </AideChamp>
              </Champ>
            </div>

            <Champ>
              <Label htmlFor="precisions">Quelque chose à ajouter ?</Label>
              <Textarea
                id="precisions"
                rows={4}
                aria-describedby={errors.precisions ? "erreur-precisions" : "aide-precisions"}
                {...register("precisions")}
              />
              {errors.precisions ? (
                <MessageErreur id="erreur-precisions">{errors.precisions.message}</MessageErreur>
              ) : (
                <AideChamp id="aide-precisions">
                  Facultatif : accès au local, contraintes d&apos;horaires, précisions sur le lot…
                </AideChamp>
              )}
            </Champ>

            <Recapitulatif valeurs={getValues()} photos={photos.length} allerA={setEtape} />

            {/*
              Honeypot : masqué visuellement et retiré du parcours au clavier
              comme de l'arbre d'accessibilité. Seul un robot remplissant tous
              les champs le renseignera.
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
        ) : null}
      </div>

      {/* -------------------------------------------------- Navigation */}
      {etape > 0 ? (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {etape < 3 ? (
            <Button type="button" taille="lg" onClick={suivant}>
              Continuer
              <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" taille="lg" disabled={isSubmitting}>
              {isSubmitting
                ? "Envoi en cours…"
                : profil === "entreprise"
                  ? "Envoyer ma proposition"
                  : "Envoyer ma demande"}
              <Send aria-hidden="true" />
            </Button>
          )}
          <Button
            type="button"
            variante="courbe"
            onClick={() => setEtape((courante) => courante - 1)}
          >
            <ArrowLeft aria-hidden="true" />
            Retour
          </Button>
        </div>
      ) : null}

      {etape === 3 ? (
        <p className="text-doux text-xs leading-relaxed">
          Vos informations servent uniquement à traiter votre demande. Ni revendues, ni transmises à
          des tiers. Suppression possible à tout moment.
        </p>
      ) : null}
    </form>
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
  const entreprise = valeurs.typeEmetteur === "entreprise";
  const lignes: { libelle: string; valeur: string; etape: number }[] = [
    {
      libelle: entreprise ? "Matériel" : "Besoins",
      valeur: valeurs.materiel.map((cle) => MATERIELS[cle]).join(", "),
      etape: 1,
    },
    {
      libelle: "Quantité",
      valeur: valeurs.quantite ? QUANTITES[valeurs.quantite] : "",
      etape: 1,
    },
    entreprise
      ? { libelle: "État", valeur: valeurs.etat ? ETATS[valeurs.etat] : "", etape: 1 }
      : {
          libelle: "Structure",
          valeur: [
            valeurs.structure ? STRUCTURES[valeurs.structure] : "",
            valeurs.effectifs ? `${EFFECTIFS[valeurs.effectifs].toLowerCase()} personnes` : "",
          ]
            .filter(Boolean)
            .join(", "),
          etape: 1,
        },
    {
      libelle: entreprise ? "Enlèvement" : "Lieu",
      valeur: entreprise
        ? [valeurs.ville, valeurs.delai ? DELAIS[valeurs.delai].toLowerCase() : ""]
            .filter(Boolean)
            .join(", ")
        : [valeurs.ville, valeurs.pays ? PAYS[valeurs.pays] : ""].filter(Boolean).join(", "),
      etape: 2,
    },
  ];
  if (photos) {
    lignes.push({
      libelle: "Photos",
      valeur: `${photos} jointe${photos > 1 ? "s" : ""}`,
      etape: 1,
    });
  }

  return (
    <div>
      <p className="text-rouge mb-3 flex items-center gap-2 text-sm font-extrabold tracking-[0.14em] uppercase">
        <span className="bg-rouge-vif inline-block h-2 w-6 rounded-full" aria-hidden="true" />
        Votre demande
      </p>
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
