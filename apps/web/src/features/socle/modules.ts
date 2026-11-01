import type { ModuleCode } from "./types";

export type ModuleInfo = {
  code: ModuleCode;
  nom: string;
  description: string;
  /** Pages que ce module ajoute à la navigation (chemin bureau). */
  pages: { href: string; label: string }[];
};

// Catalogue de départ. Plus tard il viendra de la table `module` via l'API.
export const MODULES: ModuleInfo[] = [
  {
    code: "planning",
    nom: "Planning",
    description: "Agenda, disponibilités des bénévoles et groupes.",
    pages: [
      { href: "/agenda", label: "Agenda" },
      { href: "/evenementiel", label: "Événementiel" },
    ],
  },
  {
    code: "echeances",
    nom: "Échéances",
    description: "Les dates à ne pas rater, avec un rappel avant.",
    pages: [{ href: "/echeances", label: "Échéances" }],
  },
  {
    code: "stock",
    nom: "Stock",
    description: "Les produits, les quantités et les dates limites.",
    pages: [{ href: "/stock", label: "Stock" }],
  },
  {
    code: "materiel",
    nom: "Matériel",
    description: "Le matériel, son état et les prêts en cours.",
    pages: [{ href: "/materiel", label: "Matériel" }],
  },
];

export const ALL_MODULES: ModuleCode[] = MODULES.map((m) => m.code);

export const isModuleCode = (value: unknown): value is ModuleCode =>
  typeof value === "string" && ALL_MODULES.includes(value as ModuleCode);
