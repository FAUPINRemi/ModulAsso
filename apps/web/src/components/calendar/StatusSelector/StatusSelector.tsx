"use client";

import { cx } from "@/lib/cx";

export type Choice = "dispo" | "peut-etre" | "non";

const CHOICES: { value: Choice; label: string; on: string }[] = [
  { value: "dispo", label: "Dispo", on: "bg-brand-600 text-white border-brand-600" },
  { value: "peut-etre", label: "Peut-être", on: "bg-maybe-soft text-maybe-strong border-maybe-strong" },
  { value: "non", label: "Non", on: "bg-off-soft text-off-strong border-off-strong" },
];

type StatusSelectorProps = { label: string; value?: Choice; onChange: (value: Choice) => void };

/** Trois gros boutons pour dire "je suis dispo", "peut-être" ou "non". */
export function StatusSelector({ label, value, onChange }: StatusSelectorProps) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-2">
      {CHOICES.map((c) => (
        <button
          key={c.value}
          type="button"
          role="radio"
          aria-checked={value === c.value}
          onClick={() => onChange(c.value)}
          className={cx(
            "min-h-11 rounded-xl border text-sm font-semibold transition-colors",
            value === c.value ? c.on : "border-line bg-card text-muted hover:border-brand-200",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
