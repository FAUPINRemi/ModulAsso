import { formatLong } from "@/lib/dates";
import { Badge } from "@/components/ui/Badge";
import type { Evenement } from "../types";

export function PlanningWidget({ evenements, today }: { evenements: Evenement[]; today: string }) {
  const upcoming = evenements.filter((e) => e.date >= today);
  // En fin de semaine il reste peu de choses : on montre alors toute la semaine.
  const next = (upcoming.length >= 3 ? upcoming : evenements).slice(0, 4);

  if (next.length === 0) return <p className="text-sm text-muted">Rien de prévu cette semaine.</p>;

  return (
    <ul className="flex flex-col gap-3">
      {next.map((e) => {
        const manque = e.besoin - e.inscrits.length;
        return (
          <li key={e.id} className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{e.titre}</span>
              <span className="text-xs text-muted capitalize">{formatLong(e.date)} · {e.debut}</span>
            </span>
            <Badge tone={manque > 0 ? "warn" : "ok"}>{manque > 0 ? `Il manque ${manque}` : "Complet"}</Badge>
          </li>
        );
      })}
    </ul>
  );
}
