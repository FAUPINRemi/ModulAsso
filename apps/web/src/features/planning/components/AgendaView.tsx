"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { WeekStrip, type StripEvent } from "@/components/calendar/WeekStrip";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { useSession } from "@/hooks/useSession";
import type { Membre } from "@/features/socle/types";
import { formatLong, formatShort, weekDays } from "@/lib/dates";
import type { Dispos, Evenement } from "../types";
import { AvailabilityBoard } from "./AvailabilityBoard";
import { EventDetail } from "./EventDetail";
import { MesDispos } from "./MesDispos";

type AgendaViewProps = {
  monday: string;
  today: string;
  evenements: Evenement[];
  membres: Membre[];
  dispos: Dispos;
  /** Identifiant du membre connecté (pour la vue bénévole). */
  moi: string;
};

type Mode = "semaine" | "liste";

export function AgendaView({ monday, today, evenements, membres, dispos, moi }: AgendaViewProps) {
  const { role } = useSession();
  const { toast } = useToast();
  const days = useMemo(() => weekDays(monday), [monday]);
  const [mode, setMode] = useState<Mode>("semaine");
  const first = evenements.find((e) => e.date >= today) ?? evenements[0];
  const [selected, setSelected] = useState(first?.date ?? monday);

  const eventsByDay = useMemo(() => {
    const map: Record<string, StripEvent[]> = {};
    for (const e of evenements) {
      (map[e.date] ??= []).push({ id: e.id, titre: e.titre, heure: e.debut, manque: e.inscrits.length < e.besoin });
    }
    return map;
  }, [evenements]);

  const detail = evenements.find((e) => e.date === selected);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          label="Affichage de l'agenda"
          value={mode}
          onChange={setMode}
          items={[
            { value: "semaine", label: "Semaine" },
            { value: "liste", label: "Liste" },
          ]}
        />
        {role === "dirigeant" && (
          <Button onClick={() => toast("La création d'événement arrive avec l'API")}>
            <Plus className="size-4" aria-hidden />
            Nouvel événement
          </Button>
        )}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="flex min-w-0 flex-col gap-4">
          {mode === "semaine" ? (
            <Card className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted">
                Semaine du {formatShort(days[0] as string)} au {formatShort(days[6] as string)}
              </h2>
              <WeekStrip days={days} today={today} selected={selected} eventsByDay={eventsByDay} onSelect={setSelected} />
            </Card>
          ) : (
            <Card>
              <ul className="divide-y divide-line">
                {evenements.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(e.date)}
                      className="flex w-full items-center justify-between gap-3 py-3 text-left"
                    >
                      <span>
                        <span className="block font-semibold">{e.titre}</span>
                        <span className="text-sm text-muted capitalize">{formatLong(e.date)} · {e.debut}</span>
                      </span>
                      <span className="text-sm font-semibold text-muted">{e.inscrits.length}/{e.besoin}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {role === "dirigeant" ? (
            <AvailabilityBoard days={days} membres={membres} initial={dispos} />
          ) : (
            <MesDispos days={days} membreId={moi} initial={dispos} />
          )}
        </div>
        <EventDetail evenement={detail} day={selected} />
      </div>
    </div>
  );
}
