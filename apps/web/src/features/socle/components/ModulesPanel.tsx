"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/Switch";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { basculerModule } from "../actions";
import { MODULES } from "../modules";
import type { ModuleCode } from "../types";

/** Le dirigeant active ou coupe les modules. Un module coupé disparaît de la navigation. */
export function ModulesPanel({ initial }: { initial: ModuleCode[] }) {
  const [actifs, setActifs] = useState<ModuleCode[]>(initial);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const change = (code: ModuleCode, on: boolean) => {
    setActifs((list) => (on ? [...list, code] : list.filter((c) => c !== code)));
    startTransition(async () => {
      await basculerModule(code, on);
      toast(on ? "Module activé" : "Module désactivé");
    });
  };

  return (
    <Card className="p-0 sm:p-0">
      <ul className="divide-y divide-line">
        {MODULES.map((m) => (
          <li key={m.code} className="flex items-center justify-between gap-4 p-4 sm:p-5">
            <div className="min-w-0">
              <p className="font-semibold">{m.nom}</p>
              <p className="text-sm text-muted">{m.description}</p>
            </div>
            <Switch
              label={`Module ${m.nom}`}
              checked={actifs.includes(m.code)}
              disabled={pending}
              onChange={(on) => change(m.code, on)}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
