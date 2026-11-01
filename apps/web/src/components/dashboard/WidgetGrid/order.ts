/** Déplace l'élément `from` à la place `to` sans modifier le tableau d'origine. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item as T);
  return copy;
}

/** Garde l'ordre enregistré, retire les widgets disparus et ajoute les nouveaux à la fin. */
export function reconcileOrder(stored: string[], ids: string[]): string[] {
  const known = stored.filter((id) => ids.includes(id));
  return [...known, ...ids.filter((id) => !known.includes(id))];
}
