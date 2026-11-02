import { daysBetween } from "@/lib/dates";
import type { BadgeTone } from "@/components/ui/Badge";

export const joursRestants = (date: string, today: string): number => daysBetween(today, date);

/** Moins d'une semaine : rouge. Moins d'un mois : orange. Sinon : calme. */
export function toneFor(days: number): BadgeTone {
  if (days <= 7) return "danger";
  if (days <= 30) return "warn";
  return "neutral";
}
