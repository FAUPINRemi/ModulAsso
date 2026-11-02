import type { Membre } from "./types";

// Données d'exemple. À remplacer par l'API (client généré) à l'étape "socle".
export const MOCK_MEMBRES: Membre[] = [
  { id: "m1", nom: "Camille Roux", email: "camille@lienfelin.example", role: "dirigeant", equipe: "Bureau", statut: "actif" },
  { id: "m2", nom: "Marc Lefèvre", email: "marc@lienfelin.example", role: "benevole", equipe: "Terrain", statut: "actif" },
  { id: "m3", nom: "Sofia Benali", email: "sofia@lienfelin.example", role: "benevole", equipe: "Terrain", statut: "actif" },
  { id: "m4", nom: "Léa Martin", email: "lea@lienfelin.example", role: "benevole", equipe: "Accueil", statut: "actif" },
  { id: "m5", nom: "Nina Petit", email: "nina@lienfelin.example", role: "benevole", equipe: "Accueil", statut: "actif" },
  { id: "m6", nom: "Hugo Moreau", email: "hugo@lienfelin.example", role: "benevole", equipe: "Terrain", statut: "actif" },
  { id: "m7", nom: "Inès Garnier", email: "ines@lienfelin.example", role: "benevole", equipe: "Terrain", statut: "invite" },
  { id: "m8", nom: "Yanis Colin", email: "yanis@lienfelin.example", role: "benevole", equipe: "Accueil", statut: "invite" },
];

export const nameOf = (id: string): string => MOCK_MEMBRES.find((m) => m.id === id)?.nom ?? "Inconnu";

/** Retrouve le membre connecté d'après son prénom (démo seulement). */
export const idOfFirstName = (prenom: string): string =>
  MOCK_MEMBRES.find((m) => m.nom.startsWith(prenom))?.id ?? "m4";
