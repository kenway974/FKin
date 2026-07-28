"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { DELAI_MINIMAL_ENVOI_MS, schemaContact } from "@/lib/validation/contact";
import { creerClientService } from "@/lib/supabase/server";
import { cleDepuisEntetes, verifierLimite } from "@/lib/rate-limit";
import { env, resendConfigure } from "@/lib/env";
import type { ResultatContact } from "@/lib/actions-types";

/**
 * Traitement du formulaire de contact.
 *
 * Ordre des contrôles, du moins coûteux au plus coûteux :
 *   1. honeypot et piège temporel — écartent les robots sans toucher au réseau ;
 *   2. limitation de débit par IP ;
 *   3. validation zod (le schéma partagé avec le client) ;
 *   4. enregistrement en base ;
 *   5. notification par e-mail.
 *
 * L'étape 4 fait autorité : si l'e-mail échoue, le message est malgré tout
 * conservé et consultable dans le back-office. On ne perd donc jamais une
 * demande à cause d'un problème chez Resend.
 */

export async function envoyerMessageContact(donneesBrutes: unknown): Promise<ResultatContact> {
  const analyse = schemaContact.safeParse(donneesBrutes);

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Certains champs doivent être corrigés.",
      erreursChamps: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const donnees = analyse.data;

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

  // --- 2. Limitation de débit ----------------------------------------------
  const entetes = await headers();
  const limite = verifierLimite(`contact:${cleDepuisEntetes(entetes)}`, 5, 60 * 60 * 1000);

  if (!limite.autorise) {
    const minutes = Math.ceil(limite.attenteSecondes / 60);
    return {
      statut: "erreur",
      message: `Vous avez déjà envoyé plusieurs messages. Merci de réessayer dans ${minutes} minute${minutes > 1 ? "s" : ""}, ou de nous écrire directement par e-mail.`,
    };
  }

  // --- 3. Enregistrement en base -------------------------------------------
  // Client « service_role » : le rôle anonyme n'a aucun droit d'écriture sur la
  // table `messages`, un visiteur ne peut donc pas y insérer de lignes en
  // dehors de cette action.
  const supabase = creerClientService();

  if (!supabase) {
    console.error("[contact] Supabase n'est pas configuré : message non enregistré.");
    return {
      statut: "erreur",
      message:
        "Le formulaire n'est pas encore opérationnel. Merci de nous écrire directement par e-mail.",
    };
  }

  const { error } = await supabase.from("messages").insert({
    nom: donnees.nom,
    email: donnees.email,
    organisation: donnees.organisation || null,
    telephone: donnees.telephone || null,
    type_emetteur: donnees.typeEmetteur,
    sujet: donnees.sujet,
    message: donnees.message,
  });

  if (error) {
    console.error("[contact] Échec de l'enregistrement du message :", error);
    return {
      statut: "erreur",
      message:
        "Votre message n'a pas pu être enregistré. Merci de réessayer dans quelques minutes.",
    };
  }

  // --- 4. Notification par e-mail ------------------------------------------
  await notifierParEmail(donnees);

  return {
    statut: "succes",
    message:
      "Merci, votre message a bien été transmis. Nous revenons vers vous sous 72 heures ouvrées.",
  };
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
