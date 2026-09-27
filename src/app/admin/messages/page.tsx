import Link from "next/link";
import { Building2, GraduationCap, Mail } from "lucide-react";
import { Badge, Card, CardBody } from "@/components/ui/card";
import { listerMessages } from "@/lib/admin-data";
import { formaterDateHeure } from "@/lib/utils";
import { libellesEmetteur } from "@/lib/validation/contact";

export const metadata = { title: "Messages" };

/** Boîte de réception des messages envoyés depuis le formulaire de contact. */
export default async function PageAdminMessages() {
  const messages = await listerMessages();
  const nonLus = messages.filter((message) => !message.lu).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-titre text-2xl font-bold">Messages</h1>
        <p className="text-doux mt-1">
          {messages.length} message{messages.length > 1 ? "s" : ""} reçu
          {messages.length > 1 ? "s" : ""}
          {nonLus > 0 ? `, dont ${nonLus} non lu${nonLus > 1 ? "s" : ""}` : ""}.
        </p>
      </div>

      {messages.length > 0 ? (
        <ul className="space-y-3">
          {messages.map((message) => {
            const Icone = message.type_emetteur === "entreprise" ? Building2 : GraduationCap;

            return (
              <li key={message.id}>
                <Link href={`/admin/messages/${message.id}`} className="block">
                  <Card
                    className={
                      message.lu
                        ? "transition-shadow hover:shadow-md"
                        : "border-l-terre border-l-4 transition-shadow hover:shadow-md"
                    }
                  >
                    <CardBody className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {!message.lu ? (
                          <Badge ton="terre">
                            <span className="sr-only">Message </span>Non lu
                          </Badge>
                        ) : null}
                        <Badge ton={message.type_emetteur === "entreprise" ? "ocre" : "vert"}>
                          <Icone className="size-3.5" aria-hidden="true" />
                          {libellesEmetteur[message.type_emetteur]}
                        </Badge>
                        <span className="text-doux ml-auto text-sm">
                          <time dateTime={message.created_at}>
                            {formaterDateHeure(message.created_at)}
                          </time>
                        </span>
                      </div>

                      <h2 className={message.lu ? "text-lg" : "text-lg font-semibold"}>
                        {message.sujet}
                      </h2>

                      <p className="text-doux text-sm">
                        {message.nom}
                        {message.organisation ? ` — ${message.organisation}` : ""} · {message.email}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card>
          <CardBody className="space-y-2 py-12 text-center">
            <Mail className="text-doux mx-auto size-8" aria-hidden="true" />
            <p className="font-titre text-lg font-semibold">Aucun message pour l&apos;instant</p>
            <p className="text-doux">
              Les demandes envoyées depuis la page Contact apparaîtront ici.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
