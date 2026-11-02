"use client";

import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/data/EmptyState";
import { Table, type Column } from "@/components/data/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { formatDelay, formatShort } from "@/lib/dates";
import { joursRestants, toneFor } from "../delai";
import type { Echeance } from "../types";

type Filter = "afaire" | "faites" | "toutes";

export function EcheancesList({ initial, today }: { initial: Echeance[]; today: string }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<Filter>("afaire");
  const { toast } = useToast();

  const toggle = (id: string) => {
    setItems((list) => list.map((e) => (e.id === id ? { ...e, faite: !e.faite } : e)));
    toast("C'est noté");
  };

  const rows = useMemo(
    () =>
      items
        .filter((e) => (filter === "toutes" ? true : filter === "faites" ? e.faite : !e.faite))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [items, filter],
  );

  const columns: Column<Echeance>[] = [
    {
      header: "Échéance",
      primary: true,
      cell: (e) => (
        <span>
          <span className="block font-semibold">{e.titre}</span>
          <span className="block text-xs font-normal text-muted">{e.categorie}</span>
        </span>
      ),
    },
    { header: "Date", cell: (e) => formatShort(e.date) },
    {
      header: "Délai",
      cell: (e) => {
        const days = joursRestants(e.date, today);
        return e.faite ? <Badge tone="ok">Fait</Badge> : <Badge tone={toneFor(days)}>{formatDelay(days)}</Badge>;
      },
    },
    { header: "Responsable", cell: (e) => e.responsable },
    {
      header: "Action",
      cell: (e) => (
        <Button size="sm" variant={e.faite ? "ghost" : "secondary"} onClick={() => toggle(e.id)}>
          {e.faite ? "Rouvrir" : "Marquer fait"}
        </Button>
      ),
    },
  ];

  return (
    <Card className="flex flex-col gap-4">
      <Tabs
        label="Filtrer les échéances"
        value={filter}
        onChange={setFilter}
        items={[
          { value: "afaire", label: "À faire" },
          { value: "faites", label: "Faites" },
          { value: "toutes", label: "Toutes" },
        ]}
      />
      {rows.length > 0 ? (
        <Table caption="Échéances" columns={columns} rows={rows} getKey={(e) => e.id} />
      ) : (
        <EmptyState icon={CheckCircle2} title="Rien à signaler" text="Aucune échéance dans cette liste. Bravo !" />
      )}
    </Card>
  );
}
