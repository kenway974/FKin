import type { LigneFaq } from "@/types/database";

/**
 * Questions fréquentes. Chaque réponse reprend un engagement déjà présent
 * sur le site (services, parcours d'un don) : la FAQ ne promet rien de plus.
 * `essentielle` : question reprise sous le formulaire de contact.
 */
export type QuestionFaq = {
  question: string;
  reponse: string;
  public: "donateurs" | "beneficiaires" | "tous";
  essentielle?: boolean;
};

export const FAQ: QuestionFaq[] = [
  {
    question: "Est-ce que donner du matériel coûte quelque chose à mon entreprise ?",
    reponse:
      "Non. L'enlèvement, la manutention (étage compris), le tri, l'effacement des données et l'acheminement sont pris en charge. Votre seule action est le premier message.",
    public: "donateurs",
    essentielle: true,
  },
  {
    question: "Que deviennent les données de nos ordinateurs ?",
    reponse:
      "Chaque équipement est testé et ses données effacées par un effacement multi-passes, ou le support est détruit physiquement si vous le demandez. Un certificat est joint à l'inventaire.",
    public: "donateurs",
    essentielle: true,
  },
  {
    question: "Quel matériel acceptez-vous ?",
    reponse:
      "Ordinateurs portables et fixes, écrans, imprimantes, tablettes, matériel réseau, onduleurs, mobilier scolaire et fournitures. Envoyez une liste, même approximative : sous 72 heures, nous vous disons ce qui est réemployable et ce qui part au recyclage.",
    public: "donateurs",
    essentielle: true,
  },
  {
    question: "Et le matériel en panne ou trop ancien ?",
    reponse:
      "Ce qui se répare part en atelier : au Congo, des jeunes apprennent le métier en le remettant en état. Nous ne prenons pas le matériel hors d'usage, les écrans cathodiques, les batteries gonflées ni ce qui est irréparable à coût raisonnable ; nous vous orientons alors vers une filière de recyclage agréée.",
    public: "donateurs",
  },
  {
    question: "Recevons-nous un document pour notre rapport RSE ?",
    reponse:
      "Oui : un inventaire détaillé signé à l'enlèvement et une attestation de don. Quelques mois plus tard, vous recevez aussi un compte rendu avec photos : qui a reçu votre matériel et à quoi il sert.",
    public: "donateurs",
  },
  {
    question: "Où intervenez-vous ?",
    reponse:
      "Nous collectons partout en France. Nous équipons des écoles, mairies et associations en France, et au Congo, à Kinshasa et dans les provinces desservies par nos partenaires.",
    public: "tous",
    essentielle: true,
  },
  {
    question: "Combien de temps entre l'enlèvement et l'installation ?",
    reponse:
      "En France, quelques semaines. Pour le Congo, comptez trois à quatre mois : la traversée maritime jusqu'à Matadi dure environ cinq semaines, puis viennent le dédouanement et la route jusqu'à la structure.",
    public: "tous",
  },
  {
    question: "Notre école peut-elle être équipée ?",
    reponse:
      "Les demandes sont examinées au fil des collectes et des arrivages. La priorité va aux structures accueillant un public scolaire et disposant d'un local qui ferme et d'une alimentation électrique stable.",
    public: "beneficiaires",
    essentielle: true,
  },
  {
    question: "Que faut-il nous transmettre pour une demande ?",
    reponse:
      "Le nom et le statut de la structure, le nombre de personnes concernées, le matériel souhaité par ordre de priorité, l'état du local et le contact d'une personne référente sur place. Le formulaire de contact vous guide pas à pas.",
    public: "beneficiaires",
  },
  {
    question: "Le matériel livré fonctionne-t-il ?",
    reponse:
      "Oui : chaque équipement est testé avant de partir. Il est ensuite installé et testé avec la personne référente, et nous revenons quelques mois plus tard constater l'usage et recenser les éventuelles pannes.",
    public: "beneficiaires",
  },
  {
    question: "Certains matériels sont-ils mis en vente ?",
    reponse:
      "Seul le matériel qu'aucune structure n'a demandé est revendu, pour financer le transport, l'acheminement et le fonctionnement de l'association. En 2025, il s'agissait d'accessoires réseau et informatiques (switchs, onduleurs…), vendus à des particuliers. L'association ne reçoit aucun financement public : elle vit des cotisations des écoles adhérentes et des adhérents privés, et de ces ventes.",
    public: "tous",
  },
  {
    question: "Comment proposer un don de matériel ?",
    reponse:
      "Remplissez le formulaire de contact : type de matériel, quantité approximative, état, ville et délai souhaité. Une liste précise n'est pas nécessaire : sous 72 heures, nous vous disons ce qui est réemployable et ce qui part au recyclage.",
    public: "donateurs",
  },
  {
    question: "Faut-il préparer le matériel avant l'enlèvement ?",
    reponse:
      "Non. Nous intervenons partout en France, étage compris, et notre équipe assure le chargement : rien à préparer de votre côté. Un inventaire détaillé est établi et signé au moment de l'enlèvement.",
    public: "donateurs",
  },
  {
    question:
      "Notre entreprise renouvelle son parc régulièrement : pouvez-vous passer à intervalles réguliers ?",
    reponse:
      "Oui. Nous mettons en place un calendrier d'enlèvements adapté à vos renouvellements, avec un interlocuteur unique côté association.",
    public: "donateurs",
  },
  {
    question: "Comment savoir ce qu'est devenu le matériel donné ?",
    reponse:
      "L'entreprise donatrice reçoit, quelques mois après la livraison, un compte rendu avec photos. Les projets menés à leur terme sont aussi publiés dans nos réalisations, avec le lieu, le matériel livré et le résultat obtenu, et nos actualités racontent les collectes et les livraisons.",
    public: "tous",
  },
  {
    question: "Qui installe le matériel dans notre structure ?",
    reponse:
      "Notre équipe en France, et nos partenaires locaux au Congo, accompagnent l'installation et la première prise en main avec la personne référente, pour que le matériel serve dès la première semaine.",
    public: "beneficiaires",
  },
  {
    question: "Sous quel délai répondez-vous aux demandes ?",
    reponse:
      "Sous 72 heures ouvrées, que vous soyez une entreprise qui souhaite donner ou une structure qui cherche à être équipée.",
    public: "tous",
    essentielle: true,
  },
];

/**
 * Questions saisies dans le back-office, ou la FAQ ci-dessus tant que la
 * table est vide (base pas encore mise à jour ou injoignable).
 */
export function questionsFaq(lignes: LigneFaq[]): QuestionFaq[] {
  if (!lignes.length) return FAQ;
  return lignes.map(({ question, reponse, public: cible, essentielle }) => ({
    question,
    reponse,
    public: cible,
    essentielle,
  }));
}
