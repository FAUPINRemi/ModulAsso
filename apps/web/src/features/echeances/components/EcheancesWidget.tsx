import { formatDelay } from "@/lib/dates";
import { Badge } from "@/components/ui/Badge";
import { joursRestants, toneFor } from "../delai";
import type { Echeance } from "../types";

export function EcheancesWidget({ echeances, today, limit = 3 }: { echeances: Echeance[]; today: string; limit?: number }) {
  const next = echeances
    .filter((e) => !e.faite)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);

  if (next.length === 0) return <p className="text-sm text-muted">Tout est à jour.</p>;

  return (
    <ul className="flex flex-col gap-3">
      {next.map((e) => {
        const days = joursRestants(e.date, today);
        return (
          <li key={e.id} className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-sm font-medium">{e.titre}</span>
            <Badge tone={toneFor(days)}>{formatDelay(days).replace("dans ", "")}</Badge>
          </li>
        );
      })}
    </ul>
  );
}
