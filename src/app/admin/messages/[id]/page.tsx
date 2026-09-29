import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, GraduationCap, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blob, formeBlob } from "@/components/formes";
import { BoutonSuppression } from "@/components/admin/bouton-suppression";
import { BasculeLecture } from "@/components/admin/bascule-lecture";
import { lierPhotosMessage, marquerMessageLuAuRendu, trouverMessage } from "@/lib/admin-data";
import { supprimerMessage } from "../actions";
import { cn, formaterDateHeure } from "@/lib/utils";
import { libellesEmetteur } from "@/lib/validation/contact";
import { decouperParagraphes } from "@/lib/utils";
import { Surtitre } from "@/components/ui/surtitre";

export const metadata = { title: "Message" };

export default async function PageMessage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = await trouverMessage(id);

  if (!message) notFound();

  const photos = await lierPhotosMessage(message.photos ?? []);

  // Ouvrir un message le marque comme lu : le compteur du tableau de bord
  // reflète ainsi ce qui a réellement été consulté, sans geste supplémentaire.
  if (!message.lu) {
    await marquerMessageLuAuRendu(message.id);
  }

  const entreprise = message.type_emetteur === "entreprise";
  const Icone = entreprise ? Building2 : GraduationCap;

  // Pré-remplit une réponse par e-mail avec l'objet d'origine.
  const lienReponse = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(
    `Re : ${message.sujet}`,
  )}`;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Button asChild variante="courbe" taille="sm">
          <Link href="/admin/messages">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour aux messages
          </Link>
        </Button>
      </div>

      <article className="space-y-8">
        <div className="flex items-center gap-4">
          <Blob
            anime={false}
            teinte={entreprise ? "bg-rouge-voile" : "bg-bleu-voile"}
            variante={entreprise ? 1 : 2}
            className="size-14 shrink-0"
          >
            <Icone
              className={cn("size-6", entreprise ? "text-rouge" : "text-bleu")}
              aria-hidden="true"
            />
          </Blob>
          <div>
            <p className="text-rouge text-sm font-extrabold tracking-[0.14em] uppercase">
              {libellesEmetteur[message.type_emetteur]}
            </p>
            <p className="text-doux text-sm">
              <time dateTime={message.created_at}>{formaterDateHeure(message.created_at)}</time>
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-balance md:text-4xl">{message.sujet}</h1>

        <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-doux text-xs font-extrabold tracking-[0.12em] uppercase">Nom</dt>
            <dd className="text-base">{message.nom}</dd>
          </div>
          <div>
            <dt className="text-doux text-xs font-extrabold tracking-[0.12em] uppercase">E-mail</dt>
            <dd className="text-base">
              <a
                href={`mailto:${message.email}`}
                className="text-rouge underline underline-offset-4"
              >
                {message.email}
              </a>
            </dd>
          </div>
          {message.organisation ? (
            <div>
              <dt className="text-doux text-xs font-extrabold tracking-[0.12em] uppercase">
                Organisation
              </dt>
              <dd className="text-base">{message.organisation}</dd>
            </div>
          ) : null}
          {message.telephone ? (
            <div>
              <dt className="text-doux text-xs font-extrabold tracking-[0.12em] uppercase">
                Téléphone
              </dt>
              <dd className="text-base">
                <a
                  href={`tel:${message.telephone.replace(/\s/g, "")}`}
                  className="text-rouge underline underline-offset-4"
                >
                  {message.telephone}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>

        {/* Rendu en texte brut : aucun HTML issu du formulaire n'est interprété. */}
        <div className="space-y-4 text-lg leading-relaxed whitespace-pre-line">
          {decouperParagraphes(message.message).map((paragraphe, index) => (
            <p key={index}>{paragraphe}</p>
          ))}
        </div>

        {photos.length ? (
          <section aria-labelledby="titre-photos" className="space-y-3">
            <Surtitre as="h2" id="titre-photos">
              Photos jointes ({photos.length})
            </Surtitre>
            <ul className="flex flex-wrap gap-4">
              {photos.map((url, index) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <Image
                      src={url}
                      alt={`Photo ${index + 1} jointe par ${message.nom}`}
                      width={160}
                      height={160}
                      unoptimized
                      className={cn(
                        "size-32 object-cover transition-transform hover:scale-105 md:size-40",
                        formeBlob(index),
                      )}
                    />
                    <span className="sr-only"> (ouvrir en grand, nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-doux text-sm">
              Liens valables une heure : rechargez la page au-delà.
            </p>
          </section>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
          <Button asChild>
            <a href={lienReponse}>
              Répondre par e-mail
              <Reply aria-hidden="true" />
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
      </article>
    </div>
  );
}
