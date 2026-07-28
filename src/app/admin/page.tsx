import Link from "next/link";
import { FileText, Images, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitre } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { compterElements, listerMessages } from "@/lib/admin-data";
import { recupererAdmin } from "@/lib/auth";
import { formaterDateHeure } from "@/lib/utils";
import { libellesEmetteur } from "@/lib/validation/contact";
import { resendConfigure } from "@/lib/env";

export const metadata = { title: "Tableau de bord" };

/** Page d'accueil du back-office : état des lieux et raccourcis. */
export default async function PageAdmin() {
  const [admin, compteurs, messages] = await Promise.all([
    recupererAdmin(),
    compterElements(),
    listerMessages(),
  ]);

  const derniersMessages = messages.slice(0, 5);

  const cartes = [
    {
      href: "/admin/articles",
      icone: FileText,
      titre: "Articles",
      valeur: compteurs.articles,
      precision:
        compteurs.brouillons > 0
          ? `dont ${compteurs.brouillons} brouillon${compteurs.brouillons > 1 ? "s" : ""}`
          : "tous publiés",
    },
    {
      href: "/admin/projets",
      icone: Images,
      titre: "Projets",
      valeur: compteurs.projets,
      precision: "dans la galerie",
    },
    {
      href: "/admin/messages",
      icone: Mail,
      titre: "Messages",
      valeur: compteurs.messages,
      precision:
        compteurs.messagesNonLus > 0
          ? `${compteurs.messagesNonLus} non lu${compteurs.messagesNonLus > 1 ? "s" : ""}`
          : "tous lus",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-titre text-2xl font-bold">
          Bonjour{admin?.nomAffichage ? ` ${admin.nomAffichage}` : ""}
        </h1>
        <p className="text-doux mt-1">Voici l&apos;état du site.</p>
      </div>

      {!resendConfigure ? (
        <Alert titre="Notifications e-mail désactivées">
          <p>
            La clé Resend n&apos;est pas renseignée : les messages du formulaire de contact sont
            bien enregistrés et consultables ici, mais aucun e-mail d&apos;alerte n&apos;est envoyé.
            Pensez donc à consulter régulièrement l&apos;onglet « Messages », ou complétez les
            variables <code>RESEND_*</code> (voir le README).
          </p>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {cartes.map((carte) => (
          <Link key={carte.href} href={carte.href} className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardBody className="space-y-1">
                <span className="text-doux flex items-center gap-2 text-sm font-semibold">
                  <carte.icone className="text-terre size-4" aria-hidden="true" />
                  {carte.titre}
                </span>
                <p className="font-titre text-3xl font-bold">{carte.valeur}</p>
                <p className="text-doux text-sm">{carte.precision}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/articles/nouveau">
            <Plus className="size-4" aria-hidden="true" />
            Nouvel article
          </Link>
        </Button>
        <Button asChild variante="secondaire">
          <Link href="/admin/projets/nouveau">
            <Plus className="size-4" aria-hidden="true" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      <section aria-labelledby="titre-derniers-messages">
        <h2 id="titre-derniers-messages" className="font-titre text-xl font-bold">
          Derniers messages reçus
        </h2>

        {derniersMessages.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {derniersMessages.map((message) => (
              <li key={message.id}>
                <Link href={`/admin/messages/${message.id}`} className="block">
                  <Card className="transition-shadow hover:shadow-md">
                    <CardBody className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4">
                      {!message.lu ? (
                        <span className="bg-terre rounded-full px-2 py-0.5 text-xs font-bold text-white">
                          Nouveau
                        </span>
                      ) : null}
                      <CardTitre className="text-base">{message.sujet}</CardTitre>
                      <span className="text-doux text-sm">
                        {message.nom} · {libellesEmetteur[message.type_emetteur]}
                      </span>
                      <span className="text-doux ml-auto text-sm">
                        {formaterDateHeure(message.created_at)}
                      </span>
                    </CardBody>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-douce border-bordure text-doux mt-4 border border-dashed bg-white p-6 text-center">
            Aucun message reçu pour le moment.
          </p>
        )}
      </section>
    </div>
  );
}
