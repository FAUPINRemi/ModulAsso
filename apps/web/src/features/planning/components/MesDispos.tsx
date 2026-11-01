"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { StatusSelector, type Choice } from "@/components/calendar/StatusSelector";
import { useToast } from "@/components/ui/Toast";
import { formatLong } from "@/lib/dates";
import { useAvailability } from "../hooks/useAvailability";
import type { Dispos } from "../types";

type MesDisposProps = { days: string[]; membreId: string; initial: Dispos };

/** Vue bénévole : pour chaque jour, trois gros boutons. */
export function MesDispos({ days, membreId, initial }: MesDisposProps) {
  const { dispos, set } = useAvailability(initial);
  const { toast } = useToast();

  const choose = (jour: string, value: Choice) => {
    set(membreId, jour, value);
    toast("Ta disponibilité est enregistrée");
  };

  return (
    <div className="flex flex-col gap-3">
      {days.map((d) => (
        <Card key={d} className="flex flex-col gap-3 p-4 sm:p-4">
          <CardTitle className="text-sm capitalize">{formatLong(d)}</CardTitle>
          <StatusSelector
            label={`Disponibilité ${formatLong(d)}`}
            value={toChoice(dispos[membreId]?.[d])}
            onChange={(v) => choose(d, v)}
          />
        </Card>
      ))}
    </div>
  );
}

function toChoice(s: string | undefined): Choice | undefined {
  return s === "dispo" || s === "peut-etre" || s === "non" ? s : undefined;
}
