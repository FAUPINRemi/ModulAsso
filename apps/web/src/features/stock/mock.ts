import { addDays } from "@/lib/dates";
import type { Article } from "./types";

export function mockArticles(today: string): Article[] {
  return [
    { id: "a1", nom: "Lait", quantite: 24, unite: "briques", seuil: 10, lieu: "Frigo 1", dlc: addDays(today, 7) },
    { id: "a2", nom: "Pâtes", quantite: 8, unite: "paquets", seuil: 12, lieu: "Réserve" },
    { id: "a3", nom: "Conserves de tomates", quantite: 40, unite: "boîtes", seuil: 15, lieu: "Réserve", dlc: addDays(today, 240) },
    { id: "a4", nom: "Yaourts", quantite: 30, unite: "pots", seuil: 12, lieu: "Frigo 2", dlc: addDays(today, 9) },
    { id: "a5", nom: "Compotes", quantite: 18, unite: "gourdes", seuil: 8, lieu: "Réserve", dlc: addDays(today, 12) },
    { id: "a6", nom: "Riz", quantite: 22, unite: "kg", seuil: 10, lieu: "Réserve", dlc: addDays(today, 300) },
  ];
}
