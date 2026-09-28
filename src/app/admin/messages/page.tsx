import Link from "next/link";
import { Building2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/card";
import { Blob } from "@/components/formes";
import { EtatVide } from "@/components/sections";
import { EnteteAdmin } from "@/components/admin/entete-admin";
import { listerMessages } from "@/lib/admin-data";
import { cn, formaterDateHeure } from "@/lib/utils";
import { libellesEmetteur } from "@/lib/validation/contact";

export const metadata = { title: "Messages" };

/** Boîte de réception des messages envoyés depuis le formulaire de contact. */
export default async function PageAdminMessages() {
  const messages = await listerMessages();
  const nonLus = messages.filter((message) => !message.lu).length;

  return (
    <div className="space-y-10">
      <EnteteAdmin
        surtitre="Contact"
        titre="Messages"
        description={
          <>
            {messages.length} message{messages.length > 1 ? "s" : ""} reçu
            {messages.length > 1 ? "s" : ""}
            {nonLus > 0 ? `, dont ${nonLus} non lu${nonLus > 1 ? "s" : ""}` : ""}.
          </>
        }
      />

      {messages.length > 0 ? (
        <ul className="divide-bordure divide-y">
          {messages.map((message) => {
            const Icone = message.type_emetteur === "entreprise" ? Building2 : GraduationCap;
            const entreprise = message.type_emetteur === "entreprise";

            return (
              <li key={message.id}>
                <Link
                  href={`/admin/messages/${message.id}`}
                  className="group flex items-start gap-4 py-5"
                >
                  {/* Pictogramme du profil sur sa forme souple ; un point rouge
                      signale un message non lu. */}
                  <span className="relative shrink-0">
                    <Blob
                      anime={false}
                      teinte={entreprise ? "bg-rouge-voile" : "bg-bleu-voile"}
                      variante={entreprise ? 1 : 2}
                      className="size-12"
                    >
                      <Icone
                        className={cn("size-5", entreprise ? "text-rouge" : "text-bleu")}
                        aria-hidden="true"
                      />
                    </Blob>
                    {!message.lu ? (
                      <span
                        className="bg-rouge-vif ring-fond absolute -top-0.5 -right-0.5 size-3.5 rounded-full ring-2"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>

                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="flex flex-wrap items-center gap-2">
                      {!message.lu ? (
                        <Badge ton="rouge">
                          <span className="sr-only">Message </span>Non lu
                        </Badge>
                      ) : null}
                      <span className="text-doux text-sm font-semibold">
                        {libellesEmetteur[message.type_emetteur]}
                      </span>
                      <span className="text-doux ml-auto text-sm">
                        <time dateTime={message.created_at}>
                          {formaterDateHeure(message.created_at)}
                        </time>
                      </span>
                    </span>

                    <span
                      className={cn(
                        "group-hover:text-rouge block text-lg transition-colors",
                        !message.lu && "font-semibold",
                      )}
                    >
                      {message.sujet}
                    </span>

                    <span className="text-doux block text-sm break-words">
                      {message.nom}
                      {message.organisation ? ` — ${message.organisation}` : ""} · {message.email}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <EtatVide titre="Aucun message pour l'instant" anime={false}>
          <p>Les demandes envoyées depuis la page Contact apparaîtront ici.</p>
        </EtatVide>
      )}
    </div>
  );
}
