"use client";

import { cx } from "@/lib/cx";

type TabItem<T extends string> = { value: T; label: string };

type TabsProps<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

/** Petit sélecteur à segments, pour filtrer ou changer d'affichage. */
export function Tabs<T extends string>({ items, value, onChange, label }: TabsProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-xl border border-line bg-card p-1">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.value)}
            className={cx(
              "min-h-9 rounded-lg px-3.5 text-sm font-semibold transition-colors",
              active ? "bg-brand-600 text-white" : "text-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
