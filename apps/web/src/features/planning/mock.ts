import { addDays } from "@/lib/dates";
import type { Statut } from "@/components/data/StatusPill";
import type { Dispos, Evenement, Groupe, Tache } from "./types";

// Données d'exemple, calées sur la semaine en cours. À remplacer par l'API.

export function mockEvenements(monday: string): Evenement[] {
  return [
    { id: "e1", titre: "Appels aux partenaires", date: addDays(monday, 1), debut: "17h", fin: "19h", lieu: "À distance", besoin: 2, inscrits: ["m1", "m5"] },
    { id: "e2", titre: "Permanence", date: addDays(monday, 2), debut: "17h", fin: "19h", lieu: "Local de l'association", besoin: 2, inscrits: ["m3", "m4"] },
    { id: "e3", titre: "Préparation des colis", date: addDays(monday, 4), debut: "18h", fin: "20h", lieu: "Entrepôt", besoin: 4, inscrits: ["m2", "m3", "m6", "m5"] },
    { id: "e4", titre: "Maraude du quartier nord", date: addDays(monday, 5), debut: "9h", fin: "12h", lieu: "Salle des fêtes", besoin: 8, inscrits: ["m1", "m2", "m3", "m4", "m5", "m6"] },
    { id: "e5", titre: "Distribution alimentaire", date: addDays(monday, 6), debut: "14h", fin: "17h", lieu: "Place du marché", besoin: 6, inscrits: ["m1", "m2", "m3", "m4", "m5", "m6"] },
  ];
}

const S: Record<string, Statut> = { d: "dispo", p: "peut-etre", n: "non", a: "absent" };
const row = (code: string): Statut[] => code.split("").map((c) => S[c] as Statut);

const MATRIX: Record<string, string> = {
  m1: "dpndddn",
  m2: "ddanddn",
  m3: "pdddddd",
  m4: "ndddnpn",
  m5: "ddpnndn",
  m6: "nnddppp",
};

export function mockDispos(monday: string): Dispos {
  return Object.fromEntries(
    Object.entries(MATRIX).map(([id, code]) => [
      id,
      Object.fromEntries(row(code).map((statut, i) => [addDays(monday, i), statut])),
    ]),
  );
}

export const MOCK_TACHES: Tache[] = [
  { id: "t1", titre: "Confirmer la salle", detail: "Camille · avant vendredi", faite: false },
  { id: "t2", titre: "Charger le matériel dans le camion", detail: "Sofia · samedi 8h", faite: false },
  { id: "t3", titre: "Contrôler le réfrigérateur n°2", detail: "Hugo · samedi", faite: false },
  { id: "t4", titre: "Prévenir la mairie", detail: "Camille · fait hier", faite: true },
];

export const MOCK_GROUPES: Groupe[] = [
  { id: "g1", nom: "Équipe maraude", evenement: "Maraude du quartier nord", membres: 6, lien: "/invitation/exemple-maraude" },
  { id: "g2", nom: "Équipe colis", evenement: "Préparation des colis", membres: 4, lien: "/invitation/exemple-colis" },
];
