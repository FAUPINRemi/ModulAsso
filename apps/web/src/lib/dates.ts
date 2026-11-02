// Les dates circulent en texte "AAAA-MM-JJ". On les formate en UTC
// pour que le serveur et le navigateur affichent exactement la même chose.

const DAY_MS = 86_400_000;

export const toISODate = (d: Date): string => d.toISOString().slice(0, 10);

/** Aujourd'hui (UTC), au format AAAA-MM-JJ. */
export const todayISO = (): string => toISODate(new Date());

export const fromISODate = (iso: string): Date => new Date(`${iso}T00:00:00Z`);

export const addDays = (iso: string, n: number): string =>
  toISODate(new Date(fromISODate(iso).getTime() + n * DAY_MS));

/** Lundi de la semaine qui contient la date donnée. */
export function startOfWeek(iso: string): string {
  const day = fromISODate(iso).getUTCDay(); // 0 = dimanche
  return addDays(iso, day === 0 ? -6 : 1 - day);
}

export const weekDays = (mondayISO: string): string[] =>
  Array.from({ length: 7 }, (_, i) => addDays(mondayISO, i));

export const daysBetween = (fromIso: string, toIso: string): number =>
  Math.round((fromISODate(toIso).getTime() - fromISODate(fromIso).getTime()) / DAY_MS);

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", ...opts });

export const formatDayShort = (iso: string) => fmt({ weekday: "short" }).format(fromISODate(iso)).replace(".", "");
export const formatDayNumber = (iso: string) => fmt({ day: "numeric" }).format(fromISODate(iso));
export const formatLong = (iso: string) =>
  fmt({ weekday: "long", day: "numeric", month: "long" }).format(fromISODate(iso));
export const formatShort = (iso: string) => fmt({ day: "numeric", month: "short" }).format(fromISODate(iso));

/** Phrase simple pour un délai : "aujourd'hui", "dans 12 jours", "dans 3 semaines". */
export function formatDelay(days: number): string {
  if (days < 0) return `en retard de ${-days} j`;
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "demain";
  if (days < 21) return `dans ${days} jours`;
  if (days < 60) return `dans ${Math.round(days / 7)} semaines`;
  return `dans ${Math.round(days / 30)} mois`;
}
