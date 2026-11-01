export type Article = {
  id: string;
  nom: string;
  quantite: number;
  unite: string;
  /** En dessous (ou égal), on affiche "Stock bas". */
  seuil: number;
  lieu: string;
  /** Date limite de consommation, AAAA-MM-JJ. */
  dlc?: string;
};
