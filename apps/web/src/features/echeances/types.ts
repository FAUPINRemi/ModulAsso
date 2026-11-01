export type Categorie = "Formation" | "Contrôle" | "Péremption" | "Document";

export type Echeance = {
  id: string;
  titre: string;
  /** Jour au format AAAA-MM-JJ. */
  date: string;
  categorie: Categorie;
  responsable: string;
  faite: boolean;
};
