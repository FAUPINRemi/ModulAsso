"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Petit état gardé dans le navigateur (préférences d'affichage seulement).
 * Rend d'abord la valeur par défaut, puis lit le stockage : pas de décalage serveur/client.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique après le premier rendu
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* stockage bloqué : on garde la valeur par défaut */
    }
  }, [key]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* sans importance */
      }
    },
    [key],
  );

  return [value, update] as const;
}
