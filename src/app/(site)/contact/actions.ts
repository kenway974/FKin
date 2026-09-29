"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import {
  DELAI_MINIMAL_ENVOI_MS,
  PHOTO_POIDS_MAX,
  PHOTOS_MAX,
  resumerDemande,
  schemaContact,
} from "@/lib/validation/contact";
import type { DetailsDon } from "@/types/database";
import { creerClientService } from "@/lib/supabase/server";
import { cleDepuisEntetes, verifierLimite } from "@/lib/rate-limit";
import { env, resendConfigure } from "@/lib/env";
import { valider } from "@/lib/actions-serveur";
import type { ResultatContact } from "@/lib/actions-types";

/**
 * Traitement du formulaire de contact.
 *
 * Ordre des contrôles, du moins coûteux au plus coûteux :
 *   0. validation zod (le schéma partagé avec le client) ;
 *   1. honeypot et piège temporel — écartent les robots sans toucher au réseau ;
 *   2. photos : nombre, poids et format réel (signature des fichiers) ;
 *   3. limitation de débit par IP ;
 *   4. enregistrement : photos dans le bucket privé, puis message en base ;
 *   5. notification par e-mail.
 *
 * L'étape 4 fait autorité : si l'e-mail échoue, le message est malgré tout
 * conservé et consultable dans le back-office. On ne perd donc jamais une
 * demande à cause d'un problème chez Resend.
 */

export async function envoyerMessageContact(formulaire: FormData): Promise<ResultatContact> {
  // Les réponses arrivent en JSON (champ `donnees`), les photos en fichiers.
  let donneesBrutes: unknown;
  try {
    donneesBrutes = JSON.parse(String(formulaire.get("donnees") ?? ""));
  } catch {
    return { statut: "erreur", message: "Formulaire illisible. Merci de réessayer." };
  }

  const validation = valider(schemaContact, donneesBrutes);
  if (validation.erreur) return validation.erreur;
  const donnees = validation.donnees;

  // --- 1. Anti-spam ---------------------------------------------------------
  // Le honeypot est déjà refusé par le schéma ; ce garde-fou couvre le cas où
  // le champ arriverait rempli malgré tout. La réponse reste volontairement
  // identique à un succès pour ne rien apprendre à un robot.
  if (donnees.siteWeb) {
    return { statut: "succes", message: "Merci, votre message a bien été transmis." };
  }

  if (donnees.charge && Date.now() - donnees.charge < DELAI_MINIMAL_ENVOI_MS) {
    return {
      statut: "erreur",
      message: "Envoi trop rapide. Merci de patienter quelques secondes puis de réessayer.",
    };
  }

  // --- 2. Photos : nombre, poids et format réel ------------------------------
  const photos = formulaire
    .getAll("photos")
    .filter((valeur): valeur is File => valeur instanceof File);
  const controle = await controlerPhotos(photos);
  if (!controle.ok) return { statut: "erreur", message: controle.message };

  // --- 3. Limitation de débit ----------------------------------------------
  const entetes = await headers();
  const limite = verifierLimite(`contact:${cleDepuisEntetes(entetes)}`, 5, 60 * 60 * 1000);

  if (!limite.autorise) {
    const minutes = Math.ceil(limite.attenteSecondes / 60);
    return {
      statut: "erreur",
      message: `Vous avez déjà envoyé plusieurs messages. Merci de réessayer dans ${minutes} minute${minutes > 1 ? "s" : ""}, ou de nous écrire directement par e-mail.`,
    };
  }

  // --- 4. Enregistrement ----------------------------------------------------
  // Client « service_role » : le rôle anonyme n'a aucun droit d'écriture sur la
  // table `messages` ni sur le bucket des photos ; un visiteur ne peut donc rien
  // déposer en dehors de cette action.
  const supabase = creerClientService();

  if (!supabase) {
    console.error("[contact] Supabase n'est pas configuré : message non enregistré.");
    return {
      statut: "erreur",
      message:
        "Le formulaire n'est pas encore opérationnel. Merci de nous écrire directement par e-mail.",
    };
  }

  // Photos d'abord, dans le bucket privé ; en cas d'échec de l'enregistrement
  // du message, elles sont supprimées pour ne rien laisser d'orphelin.
  const chemins: string[] = [];
  for (const photo of controle.photos) {
    const chemin = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${photo.extension}`;
    const { error } = await supabase.storage
      .from(BUCKET_PHOTOS)
      .upload(chemin, photo.fichier, { contentType: photo.type, upsert: false });
    if (error) {
      console.error("[contact] Échec du téléversement d'une photo :", error);
      await supprimerPhotos(chemins);
      return {
        statut: "erreur",
        message:
          "Vos photos n'ont pas pu être envoyées. Réessayez, ou envoyez la demande sans photo.",
      };
    }
    chemins.push(chemin);
  }

  const { sujet, message } = resumerDemande(donnees);
  const details: DetailsDon =
    donnees.typeEmetteur === "entreprise"
      ? {
          materiel: donnees.materiel,
          quantite: donnees.quantite,
          etat: donnees.etat,
          ville: donnees.ville,
          delai: donnees.delai,
        }
      : {
          materiel: donnees.materiel,
          quantite: donnees.quantite,
          structure: donnees.structure,
          effectifs: donnees.effectifs,
          ville: donnees.ville,
          pays: donnees.pays,
        };

  const { error } = await supabase.from("messages").insert({
    nom: donnees.nom,
    email: donnees.email,
    organisation: donnees.organisation || null,
    telephone: donnees.telephone || null,
    type_emetteur: donnees.typeEmetteur,
    sujet,
    message,
    details,
    photos: chemins,
  });

  if (error) {
    console.error("[contact] Échec de l'enregistrement du message :", error);
    await supprimerPhotos(chemins);
    return {
      statut: "erreur",
      message:
        "Votre message n'a pas pu être enregistré. Merci de réessayer dans quelques minutes.",
    };
  }

  // --- 5. Notification par e-mail ------------------------------------------
  await notifierParEmail({ ...donnees, sujet, message, nombrePhotos: chemins.length });

  return {
    statut: "succes",
    message:
      donnees.typeEmetteur === "entreprise"
        ? "Merci ! Votre proposition de don est bien arrivée. Nous revenons vers vous sous 72 heures ouvrées."
        : "Merci ! Votre demande est bien arrivée. Nous revenons vers vous sous 72 heures ouvrées.",
  };

  async function supprimerPhotos(liste: string[]) {
    if (liste.length) await supabase!.storage.from(BUCKET_PHOTOS).remove(liste);
  }
}

/** Bucket privé des photos jointes (voir `supabase/schema.sql`, section 9). */
const BUCKET_PHOTOS = "photos-dons";

type PhotoControlee = { fichier: File; type: string; extension: string };

/**
 * Vérifie les photos reçues. Le type annoncé par le navigateur n'est pas
 * digne de confiance : le format est reconnu à partir des premiers octets du
 * fichier (« signature »), et seuls WebP, JPEG et PNG sont acceptés.
 */
async function controlerPhotos(
  photos: File[],
): Promise<{ ok: true; photos: PhotoControlee[] } | { ok: false; message: string }> {
  if (photos.length > PHOTOS_MAX) {
    return { ok: false, message: `${PHOTOS_MAX} photos au maximum.` };
  }

  const controlees: PhotoControlee[] = [];
  for (const photo of photos) {
    if (photo.size === 0 || photo.size > PHOTO_POIDS_MAX) {
      return { ok: false, message: "Une photo est trop lourde. Réessayez avec une autre photo." };
    }
    const octets = new Uint8Array(await photo.slice(0, 12).arrayBuffer());
    const format = reconnaitreFormat(octets);
    if (!format) {
      return { ok: false, message: "Seules les photos JPEG, PNG ou WebP sont acceptées." };
    }
    controlees.push({ fichier: photo, ...format });
  }
  return { ok: true, photos: controlees };
}

function reconnaitreFormat(o: Uint8Array) {
  if (o[0] === 0xff && o[1] === 0xd8 && o[2] === 0xff)
    return { type: "image/jpeg", extension: "jpg" };
  if (o[0] === 0x89 && o[1] === 0x50 && o[2] === 0x4e && o[3] === 0x47)
    return { type: "image/png", extension: "png" };
  const texte = String.fromCharCode(...o);
  if (texte.startsWith("RIFF") && texte.slice(8, 12) === "WEBP")
    return { type: "image/webp", extension: "webp" };
  return null;
}

/**
 * Envoie la notification à l'adresse de l'association.
 * Les erreurs sont journalisées mais jamais propagées : le message est déjà en
 * base, l'utilisateur n'a pas à subir un incident côté fournisseur d'e-mail.
 */
async function notifierParEmail(donnees: {
  nom: string;
  email: string;
  organisation?: string;
  telephone?: string;
  typeEmetteur: "entreprise" | "beneficiaire";
  sujet: string;
  message: string;
  nombrePhotos: number;
}) {
  if (!resendConfigure) {
    console.warn("[contact] Resend non configuré : notification e-mail ignorée.");
    return;
  }

  const profil =
    donnees.typeEmetteur === "entreprise" ? "Entreprise donatrice" : "Structure bénéficiaire";

  const corps = [
    `Profil : ${profil}`,
    `Nom : ${donnees.nom}`,
    `E-mail : ${donnees.email}`,
    donnees.organisation ? `Organisation : ${donnees.organisation}` : null,
    donnees.telephone ? `Téléphone : ${donnees.telephone}` : null,
    "",
    `Objet : ${donnees.sujet}`,
    "",
    donnees.message,
    "",
    donnees.nombrePhotos
      ? `${donnees.nombrePhotos} photo${donnees.nombrePhotos > 1 ? "s" : ""} jointe${donnees.nombrePhotos > 1 ? "s" : ""}, à consulter dans l'espace d'administration.`
      : null,
    "—",
    "Message envoyé depuis le formulaire de contact du site.",
  ]
    .filter((ligne) => ligne !== null)
    .join("\n");

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const destinataires = (env.CONTACT_NOTIFICATION_EMAIL as string)
      .split(",")
      .map((adresse) => adresse.trim())
      .filter(Boolean);

    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL as string,
      to: destinataires,
      // Répondre depuis la boîte mail renvoie directement vers le demandeur.
      replyTo: donnees.email,
      subject: `[${profil}] ${donnees.sujet}`,
      text: corps,
    });

    if (error) console.error("[contact] Resend a refusé l'envoi :", error);
  } catch (erreur) {
    console.error("[contact] Erreur lors de l'envoi de la notification :", erreur);
  }
}
