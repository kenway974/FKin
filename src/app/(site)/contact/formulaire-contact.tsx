"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm, type Resolver, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { CHAMPS_PAR_ETAPE, schemaContact, type ChampsContact } from "@/lib/validation/contact";
import type { ResultatContact } from "@/lib/actions-types";
import { envoyerMessageContact } from "./actions";
import { Progression, type PhotoJointe } from "./elements-formulaire";
import {
  EcranEnvoye,
  EtapeBesoins,
  EtapeCoordonnees,
  EtapeLieu,
  EtapeProfil,
} from "./etapes-contact";
import { TEXTES } from "./textes-contact";

type Profil = NonNullable<ChampsContact["typeEmetteur"]>;

const DERNIERE_ETAPE = 3;

/**
 * Formulaire de contact en quatre étapes : profil, matériel (ou besoins),
 * lieu, coordonnées. Une question à la fois, en pastilles plutôt qu'en
 * champs libres : moins d'effort pour le visiteur, et des demandes
 * directement exploitables pour l'association.
 *
 * - Le schéma zod est partagé avec la Server Action ; chaque étape ne valide
 *   que ses propres champs avant de passer à la suivante.
 * - `?profil=entreprise|beneficiaire` pré-sélectionne le profil et ouvre
 *   directement la deuxième étape.
 * - Les réponses sont gardées en brouillon le temps de la visite.
 * - Photos facultatives, compressées dans le navigateur avant l'envoi.
 *
 * Ce composant ne gère que l'enchaînement ; le contenu des étapes est dans
 * `etapes-contact.tsx`, les libellés par profil dans `textes-contact.ts`.
 */
export function FormulaireContact() {
  const parametres = useSearchParams();
  const profilUrl = parametres.get("profil");
  const profilInitial =
    profilUrl === "entreprise" || profilUrl === "beneficiaire" ? profilUrl : undefined;

  const [etape, setEtape] = React.useState(profilInitial ? 1 : 0);
  const [photos, setPhotos] = React.useState<PhotoJointe[]>([]);
  const [resultat, setResultat] = React.useState<ResultatContact | null>(null);
  // Horodatage d'affichage : sert de piège temporel côté serveur.
  const [charge] = React.useState(() => Date.now());
  const referenceHaut = React.useRef<HTMLDivElement>(null);
  const referenceTitre = React.useRef<HTMLHeadingElement>(null);

  const formulaire = useForm<ChampsContact>({
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
  const { handleSubmit, trigger, watch, reset, setValue, setError, getValues } = formulaire;
  const profil = watch("typeEmetteur");
  const textes = TEXTES[profil ?? "entreprise"];
  const envoye = resultat?.statut === "succes";

  const oublierBrouillon = useBrouillon(formulaire, profilInitial);
  useFocusSurEtape(referenceHaut, referenceTitre, [etape, envoye]);

  async function suivant() {
    if (profil && (await trigger(CHAMPS_PAR_ETAPE[profil][etape]))) setEtape(etape + 1);
  }

  function choisirProfil(valeur: Profil) {
    setValue("typeEmetteur", valeur, { shouldDirty: true });
    setEtape(1);
  }

  async function auEnvoi(donnees: ChampsContact) {
    const envoi = new FormData();
    envoi.set("donnees", JSON.stringify({ ...donnees, charge }));
    for (const photo of photos) envoi.append("photos", photo.fichier);

    const reponse = await envoyerMessageContact(envoi);
    setResultat(reponse);

    if (reponse.statut === "succes") {
      oublierBrouillon();
      photos.forEach((photo) => URL.revokeObjectURL(photo.apercu));
      return;
    }

    // Erreurs renvoyées par le serveur : affichées dans leurs champs, et
    // retour à la première étape qui en contient.
    if (reponse.erreursChamps && profil) {
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

  function recommencer() {
    reset({ ...getValues(), materiel: [], precisions: "" });
    setPhotos([]);
    setResultat(null);
    setEtape(1);
  }

  return (
    <div ref={referenceHaut} className="scroll-mt-28">
      {envoye ? (
        <EcranEnvoye
          message={resultat.message}
          titre={referenceTitre}
          onRecommencer={recommencer}
        />
      ) : (
        <FormProvider {...formulaire}>
          <form
            onSubmit={handleSubmit(auEnvoi)}
            noValidate
            className="space-y-10"
            aria-labelledby="titre-etape"
          >
            <Progression titres={textes.etapes} etape={etape} />

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
                {textes.questions[etape]}
              </h2>
              {etape === 0 ? <EtapeProfil onChoisir={choisirProfil} /> : null}
              {profil && etape === 1 ? (
                <EtapeBesoins profil={profil} photos={photos} onPhotos={setPhotos} />
              ) : null}
              {profil && etape === 2 ? <EtapeLieu profil={profil} /> : null}
              {profil && etape === 3 ? (
                <EtapeCoordonnees profil={profil} photos={photos.length} allerA={setEtape} />
              ) : null}
            </div>

            {etape > 0 ? (
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {etape < DERNIERE_ETAPE ? (
                  <Button type="button" taille="lg" onClick={suivant}>
                    Continuer
                    <ArrowRight aria-hidden="true" />
                  </Button>
                ) : (
                  <Button type="submit" taille="lg" disabled={formulaire.formState.isSubmitting}>
                    {formulaire.formState.isSubmitting ? "Envoi en cours…" : textes.envoyer}
                    <Send aria-hidden="true" />
                  </Button>
                )}
                <Button type="button" variante="courbe" onClick={() => setEtape(etape - 1)}>
                  <ArrowLeft aria-hidden="true" />
                  Retour
                </Button>
              </div>
            ) : null}

            {etape === DERNIERE_ETAPE ? (
              <p className="text-doux text-xs leading-relaxed">
                Vos informations servent uniquement à traiter votre demande. Ni revendues, ni
                transmises à des tiers. Suppression possible à tout moment.
              </p>
            ) : null}
          </form>
        </FormProvider>
      )}
    </div>
  );
}

/** Clé du brouillon conservé le temps de la visite (hors photos). */
const CLE_BROUILLON = "brouillon-contact";

/**
 * Brouillon : restauré à l'ouverture, enregistré à chaque modification (sans
 * le piège à robots ni l'horodatage). Renvoie la fonction qui l'efface.
 */
function useBrouillon(formulaire: UseFormReturn<ChampsContact>, profilInitial?: Profil) {
  React.useEffect(() => {
    const { reset, getValues, watch } = formulaire;
    try {
      const brouillon = sessionStorage.getItem(CLE_BROUILLON);
      if (brouillon) {
        const valeurs = JSON.parse(brouillon) as Partial<ChampsContact>;
        reset({ ...getValues(), ...valeurs, typeEmetteur: profilInitial ?? valeurs.typeEmetteur });
      }
    } catch {
      /* stockage indisponible : on continue sans brouillon */
    }
    const abonnement = watch((valeurs) => {
      const aGarder = { ...valeurs };
      delete aGarder.siteWeb;
      delete aGarder.charge;
      try {
        sessionStorage.setItem(CLE_BROUILLON, JSON.stringify(aGarder));
      } catch {
        /* idem */
      }
    });
    return () => abonnement.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule fois, à l'ouverture
  }, []);

  return () => {
    try {
      sessionStorage.removeItem(CLE_BROUILLON);
    } catch {
      /* rien à faire */
    }
  };
}

/**
 * À chaque changement d'étape (pas au premier affichage) : remonte en haut du
 * formulaire et place le focus sur le titre, pour le clavier et les lecteurs
 * d'écran.
 */
function useFocusSurEtape(
  haut: React.RefObject<HTMLElement | null>,
  titre: React.RefObject<HTMLElement | null>,
  dependances: unknown[],
) {
  const premierRendu = React.useRef(true);
  React.useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    haut.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    titre.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dépendances fournies par l'appelant
  }, dependances);
}
