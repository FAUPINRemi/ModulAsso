export type Etat = "bon" | "a_controler" | "hors_service";

export type Materiel = {
  id: string;
  nom: string;
  etat: Etat;
  /** Prochain contrôle, AAAA-MM-JJ. */
  prochainControle: string;
  /** Nom de la personne qui l'a emprunté, sinon vide. */
  pretA: string | null;
};
