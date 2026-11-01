"use client";

import { cx } from "@/lib/cx";
import { formatDayNumber, formatDayShort } from "@/lib/dates";

export type StripEvent = { id: string; titre: string; heure: string; manque: boolean };

type WeekStripProps = {
  days: string[];
  today: string;
  selected: string;
  eventsByDay: Record<string, StripEvent[]>;
  onSelect: (iso: string) => void;
};

/** Les 7 jours de la semaine, avec ce qui est prévu chaque jour. */
export function WeekStrip({ days, today, selected, eventsByDay, onSelect }: WeekStripProps) {
  return (
    <ul className="grid grid-cols-7 gap-1.5 @3xl:gap-2.5" aria-label="Jours de la semaine">
      {days.map((iso) => {
        const events = eventsByDay[iso] ?? [];
        const active = iso === selected;
        return (
          <li key={iso} className="min-w-0">
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(iso)}
              className={cx(
                "flex h-full min-h-20 w-full flex-col gap-1 rounded-xl border p-1.5 text-left transition-colors @3xl:min-h-28 @3xl:p-2.5",
                active ? "border-brand-600 bg-brand-50" : "border-line bg-canvas hover:border-brand-200",
              )}
            >
              <span className="text-[0.65rem] font-semibold tracking-wide text-muted uppercase">{formatDayShort(iso)}</span>
              <span className={cx("text-lg leading-none font-bold", iso === today && "text-brand-600")}>
                {formatDayNumber(iso)}
              </span>
              {events.map((e) => (
                <span
                  key={e.id}
                  className={cx(
                    "hidden truncate rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold @3xl:block",
                    e.manque ? "bg-warn-soft text-warn-strong" : "bg-ok-soft text-ok-strong",
                  )}
                >
                  {e.titre}
                </span>
              ))}
              {events.length > 0 && (
                <span className="mx-auto mt-auto size-1.5 rounded-full bg-brand-600 @3xl:hidden" aria-label={`${events.length} événement`} />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
