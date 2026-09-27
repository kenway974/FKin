import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, GraduationCap, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardBody } from "@/components/ui/card";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { BasculeLecture } from "@/components/admin/bascule-lecture";
import { marquerMessageLuAuRendu, trouverMessage } from "@/lib/admin-data";
import { supprimerMessage } from "../actions";
import { formaterDateHeure } from "@/lib/utils";
import { libellesEmetteur } from "@/lib/validation/contact";
import { decouperParagraphes } from "@/lib/utils";

export const metadata = { title: "Message" };

export default async function PageMessage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = await trouverMessage(id);

  if (!message) notFound();

  // Ouvrir un message le marque comme lu : le compteur du tableau de bord
  // reflète ainsi ce qui a réellement été consulté, sans geste supplémentaire.
  if (!message.lu) {
    await marquerMessageLuAuRendu(message.id);
  }

  const Icone = message.type_emetteur === "entreprise" ? Building2 : GraduationCap;

  // Pré-remplit une réponse par e-mail avec l'objet d'origine.
  const lienReponse = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(
    `Re : ${message.sujet}`,
  )}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variante="lien" taille="sm" className="px-0">
          <Link href="/admin/messages">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour aux messages
          </Link>
        </Button>
      </div>

      <Card>
        <CardBody className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge ton={message.type_emetteur === "entreprise" ? "ocre" : "vert"}>
              <Icone className="size-3.5" aria-hidden="true" />
              {libellesEmetteur[message.type_emetteur]}
            </Badge>
            <span className="text-doux ml-auto text-sm">
              <time dateTime={message.created_at}>{formaterDateHeure(message.created_at)}</time>
            </span>
          </div>

          <h1 className="font-titre text-2xl font-bold">{message.sujet}</h1>

          <dl className="rounded-douce bg-sable grid gap-x-6 gap-y-2 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Nom</dt>
              <dd className="text-doux">{message.nom}</dd>
            </div>
            <div>
              <dt className="font-semibold">E-mail</dt>
              <dd>
                <a
                  href={`mailto:${message.email}`}
                  className="text-terre underline underline-offset-4"
                >
                  {message.email}
                </a>
              </dd>
            </div>
            {message.organisation ? (
              <div>
                <dt className="font-semibold">Organisation</dt>
                <dd className="text-doux">{message.organisation}</dd>
              </div>
            ) : null}
            {message.telephone ? (
              <div>
                <dt className="font-semibold">Téléphone</dt>
                <dd>
                  <a
                    href={`tel:${message.telephone.replace(/\s/g, "")}`}
                    className="text-terre underline underline-offset-4"
                  >
                    {message.telephone}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>

          {/* Rendu en texte brut : aucun HTML issu du formulaire n'est interprété. */}
          <div className="space-y-4 leading-relaxed whitespace-pre-line">
            {decouperParagraphes(message.message).map((paragraphe, index) => (
              <p key={index}>{paragraphe}</p>
            ))}
          </div>

          <div className="border-bordure flex flex-wrap items-center gap-3 border-t pt-5">
            <Button asChild>
              <a href={lienReponse}>
                <Reply className="size-4" aria-hidden="true" />
                Répondre par e-mail
              </a>
            </Button>

            <BasculeLecture id={message.id} />

            <div className="ml-auto">
              <BoutonSuppression
                intitule={message.sujet}
                onSupprimer={supprimerMessage.bind(null, message.id)}
                redirectionApres="/admin/messages"
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
