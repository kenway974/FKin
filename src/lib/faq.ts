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
];
