import type { Statut } from "@/components/data/StatusPill";

export type Evenement = {
  id: string;
  titre: string;
  /** Jour au format AAAA-MM-JJ. */
  date: string;
  debut: string;
  fin: string;
  lieu: string;
  /** Nombre de bénévoles voulus. */
  besoin: number;
  /** Identifiants des membres inscrits. */
  inscrits: string[];
};

/** membreId -> jour -> statut */
export type Dispos = Record<string, Record<string, Statut>>;

export type Tache = { id: string; titre: string; detail: string; faite: boolean };

export type Groupe = { id: string; nom: string; evenement: string; membres: number; lien: string };
