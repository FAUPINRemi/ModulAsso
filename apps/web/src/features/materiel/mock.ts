import { addDays } from "@/lib/dates";
import type { Materiel } from "./types";

export function mockMateriel(today: string): Materiel[] {
  return [
    { id: "x1", nom: "Extincteur n°1", etat: "a_controler", prochainControle: addDays(today, 21), pretA: null },
    { id: "x2", nom: "Camion de l'association", etat: "a_controler", prochainControle: addDays(today, -3), pretA: null },
    { id: "x3", nom: "Réfrigérateur n°2", etat: "bon", prochainControle: addDays(today, 90), pretA: null },
    { id: "x4", nom: "Tables pliantes (lot de 6)", etat: "bon", prochainControle: addDays(today, 180), pretA: "Sofia Benali" },
    { id: "x5", nom: "Sono portable", etat: "hors_service", prochainControle: addDays(today, 30), pretA: null },
  ];
}
