export type Role = "dirigeant" | "benevole";

export type ModuleCode = "planning" | "echeances" | "stock" | "materiel";

export type Session = {
  role: Role;
  nom: string;
  structure: string;
  modules: ModuleCode[];
};

export type Membre = {
  id: string;
  nom: string;
  email: string;
  role: Role;
  equipe: string;
  statut: "actif" | "invite";
};
