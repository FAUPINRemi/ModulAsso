"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { cx } from "@/lib/cx";
import type { Tache } from "../types";

export function TachesList({ initial, limit, bare }: { initial: Tache[]; limit?: number; bare?: boolean }) {
  const [taches, setTaches] = useState(initial);
  const shown = limit ? taches.slice(0, limit) : taches;
  const toggle = (id: string) => setTaches((list) => list.map((t) => (t.id === id ? { ...t, faite: !t.faite } : t)));

  const list = (
      <ul className="divide-y divide-line">
        {shown.map((t) => (
          <li key={t.id}>
            <label className="flex min-h-14 cursor-pointer items-center gap-3.5 px-4 py-3">
              <input
                type="checkbox"
                checked={t.faite}
                onChange={() => toggle(t.id)}
                className="size-5 shrink-0 accent-brand-600"
              />
              <span className="min-w-0">
                <span className={cx("block text-sm font-semibold", t.faite && "text-muted line-through")}>{t.titre}</span>
                <span className="block text-xs text-muted">{t.detail}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
  );

  return bare ? list : <Card className="p-0 sm:p-0">{list}</Card>;
}
