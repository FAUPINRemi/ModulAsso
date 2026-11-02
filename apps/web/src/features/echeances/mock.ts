import { addDays } from "@/lib/dates";
import type { Echeance } from "./types";

// Dates calées sur aujourd'hui pour que la démo soit toujours parlante.
export function mockEcheances(today: string): Echeance[] {
  return [
    { id: "d1", titre: "Formation premiers secours", date: addDays(today, 12), categorie: "Formation", responsable: "Léa Martin", faite: false },
    { id: "d2", titre: "Contrôle des extincteurs", date: addDays(today, 21), categorie: "Contrôle", responsable: "Hugo Moreau", faite: false },
    { id: "d3", titre: "Lait : date limite", date: addDays(today, 7), categorie: "Péremption", responsable: "Sofia Benali", faite: false },
    { id: "d4", titre: "Assurance de l'association", date: addDays(today, 75), categorie: "Document", responsable: "Camille Roux", faite: false },
    { id: "d5", titre: "Vérification du camion", date: addDays(today, -3), categorie: "Contrôle", responsable: "Marc Lefèvre", faite: false },
    { id: "d6", titre: "Déclaration en préfecture", date: addDays(today, -20), categorie: "Document", responsable: "Camille Roux", faite: true },
  ];
}
