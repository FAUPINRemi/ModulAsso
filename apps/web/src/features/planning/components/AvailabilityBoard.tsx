"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill, STATUT_LABEL } from "@/components/data/StatusPill";
import { formatDayNumber, formatDayShort } from "@/lib/dates";
import type { Membre } from "@/features/socle/types";
import { countDispo, useAvailability } from "../hooks/useAvailability";
import type { Dispos } from "../types";
import { cx } from "@/lib/cx";

type AvailabilityBoardProps = { days: string[]; membres: Membre[]; initial: Dispos };

/** Le carnet de disponibilités : un clic sur une case change le statut de la personne. */
export function AvailabilityBoard({ days, membres, initial }: AvailabilityBoardProps) {
  const { dispos, cycle } = useAvailability(initial);

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <CardTitle>Carnet de disponibilités</CardTitle>
        <p className="text-sm text-muted">Chaque bénévole indique ses jours. Clique sur une case pour la changer.</p>
      </div>
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[46rem] text-sm">
          <caption className="sr-only">Disponibilités des bénévoles cette semaine</caption>
          <thead>
            <tr className="text-xs font-semibold text-muted uppercase">
              <th scope="col" className="py-2 pr-3 text-left">Bénévole</th>
              {days.map((d) => (
                <th key={d} scope="col" className="px-1 py-2 text-center">
                  {formatDayShort(d)} {formatDayNumber(d)}
                </th>
              ))}
              <th scope="col" className="py-2 pl-3 text-left">Présences</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {membres.map((m) => {
              const nb = countDispo(dispos[m.id]);
              return (
                <tr key={m.id}>
                  <th scope="row" className="py-2 pr-3 text-left font-semibold">
                    <span className="flex items-center gap-2.5">
                      <Avatar name={m.nom} size="sm" />
                      {m.nom.split(" ")[0]}
                    </span>
                  </th>
                  {days.map((d) => {
                    const statut = dispos[m.id]?.[d] ?? "non";
                    return (
                      <td key={d} className="px-1 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => cycle(m.id, d)}
                          aria-label={`${m.nom}, ${formatDayShort(d)} ${formatDayNumber(d)} : ${STATUT_LABEL[statut]}. Changer.`}
                          className="rounded-full"
                        >
                          <StatusPill statut={statut} className={cx("min-w-[5rem]")} />
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-2 pl-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-off-soft" role="presentation">
                        <div className="h-full bg-brand-600" style={{ width: `${(nb / 7) * 100}%` }} />
                      </div>
                      <span className="whitespace-nowrap text-xs font-semibold text-muted">{nb} sur 7</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
