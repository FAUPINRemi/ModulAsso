"use client";

import { useCallback, useState } from "react";
import type { Statut } from "@/components/data/StatusPill";
import type { Dispos } from "../types";

/** dispo -> peut-être -> non -> dispo. */
export function nextStatut(current: Statut | undefined): Statut {
  if (current === "dispo") return "peut-etre";
  if (current === "peut-etre") return "non";
  return "dispo";
}

/** Nombre de jours où la personne est dispo. */
export function countDispo(days: Record<string, Statut> | undefined): number {
  return Object.values(days ?? {}).filter((s) => s === "dispo").length;
}

/** Garde les disponibilités à l'écran. Avec l'API, chaque changement sera envoyé au serveur. */
export function useAvailability(initial: Dispos) {
  const [dispos, setDispos] = useState<Dispos>(initial);

  const set = useCallback((membreId: string, jour: string, statut: Statut) => {
    setDispos((all) => ({ ...all, [membreId]: { ...all[membreId], [jour]: statut } }));
  }, []);

  const cycle = useCallback((membreId: string, jour: string) => {
    setDispos((all) => ({
      ...all,
      [membreId]: { ...all[membreId], [jour]: nextStatut(all[membreId]?.[jour]) },
    }));
  }, []);

  return { dispos, set, cycle };
}
