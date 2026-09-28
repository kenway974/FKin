import Link from "next/link";
import { FileText, Images, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blob } from "@/components/formes";
import { EtatVide } from "@/components/sections";
import { EnteteAdmin } from "@/components/admin/entete-admin";
import { Alert } from "@/components/ui/alert";
import { compterElements, listerMessages } from "@/lib/admin-data";
import { recupererAdmin } from "@/lib/auth";
import { cn, formaterDateHeure } from "@/lib/utils";
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
      teinte: "bg-rouge-voile text-rouge",
      variante: 1 as const,
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
      teinte: "bg-bleu-voile text-bleu",
      variante: 2 as const,
      valeur: compteurs.projets,
      precision: "dans la galerie",
    },
    {
      href: "/admin/messages",
      icone: Mail,
      titre: "Messages",
      teinte: "bg-nuage-fonce text-marine",
      variante: 3 as const,
      valeur: compteurs.messages,
      precision:
        compteurs.messagesNonLus > 0
          ? `${compteurs.messagesNonLus} non lu${compteurs.messagesNonLus > 1 ? "s" : ""}`
          : "tous lus",
    },
  ];

  return (
    <div className="space-y-14">
      <EnteteAdmin
        surtitre="Tableau de bord"
        titre={`Bonjour${admin?.nomAffichage ? ` ${admin.nomAffichage}` : ""}`}
        description="Voici l'état du site."
      >
        <Button asChild>
          <Link href="/admin/articles/nouveau">
            Nouvel article
            <Plus aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variante="secondaire">
          <Link href="/admin/projets/nouveau">
            Nouveau projet
            <Plus aria-hidden="true" />
          </Link>
        </Button>
      </EnteteAdmin>

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

      {/* Compteurs sans cadre : chaque chiffre est posé sur sa forme souple. */}
      <ul className="grid gap-8 sm:grid-cols-3">
        {cartes.map((carte) => {
          const [fond, texte] = carte.teinte.split(" ");
          return (
            <li key={carte.href}>
              <Link href={carte.href} className="group flex items-center gap-5">
                <Blob
                  anime={false}
                  teinte={fond}
                  variante={carte.variante}
                  className="size-24 shrink-0 transition-transform duration-300 group-hover:scale-105"
                >
                  <span className={cn("font-titre text-4xl font-bold", texte)}>{carte.valeur}</span>
                </Blob>
                <span>
                  <span className="font-titre group-hover:text-rouge flex items-center gap-2 text-xl font-bold transition-colors">
                    <carte.icone className="size-5" aria-hidden="true" />
                    {carte.titre}
                  </span>
                  <span className="text-doux text-sm">{carte.precision}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="titre-derniers-messages">
        <h2 id="titre-derniers-messages" className="text-2xl font-bold">
          Derniers messages reçus
        </h2>

        {derniersMessages.length > 0 ? (
          <ul className="divide-bordure mt-4 divide-y">
            {derniersMessages.map((message) => (
              <li key={message.id}>
                <Link
                  href={`/admin/messages/${message.id}`}
                  className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4"
                >
                  {!message.lu ? (
                    <span className="bg-rouge-vif rounded-full px-2.5 py-0.5 text-xs font-bold text-white">
                      Nouveau
                    </span>
                  ) : null}
                  <span className="group-hover:text-rouge font-semibold transition-colors">
                    {message.sujet}
                  </span>
                  <span className="text-doux text-sm">
                    {message.nom} · {libellesEmetteur[message.type_emetteur]}
                  </span>
                  <span className="text-doux ml-auto text-sm">
                    {formaterDateHeure(message.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EtatVide titre="Aucun message reçu pour le moment" anime={false}>
            <p>Les demandes envoyées depuis la page Contact apparaîtront ici.</p>
          </EtatVide>
        )}
      </section>
    </div>
  );
}
