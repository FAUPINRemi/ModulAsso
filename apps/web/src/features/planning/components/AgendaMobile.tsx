import { Card } from "@/components/ui/Card";
import { formatLong } from "@/lib/dates";
import type { Evenement } from "../types";
import { ParticipationButtons } from "./ParticipationButtons";

/** Agenda mobile : une carte par événement à venir, avec la réponse en un geste. */
export function AgendaMobile({ evenements, today }: { evenements: Evenement[]; today: string }) {
  return (
    <ul className="flex flex-col gap-3">
      {evenements
        .filter((e) => e.date >= today)
        .map((e) => (
          <li key={e.id}>
            <Card className="flex flex-col gap-3 p-4 sm:p-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">{formatLong(e.date)}</p>
                <h2 className="text-base font-bold">{e.titre}</h2>
                <p className="text-sm text-muted">
                  {e.debut} à {e.fin} · {e.lieu}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {e.inscrits.length} sur {e.besoin} inscrits
                </p>
              </div>
              <ParticipationButtons titre={e.titre} />
            </Card>
          </li>
        ))}
    </ul>
  );
}
