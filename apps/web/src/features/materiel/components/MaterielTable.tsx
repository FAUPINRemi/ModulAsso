"use client";

import { Wrench } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/data/EmptyState";
import { Table, type Column } from "@/components/data/Table";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { daysBetween, formatDelay, formatShort } from "@/lib/dates";
import { toneFor } from "@/features/echeances/delai";
import type { Etat, Materiel } from "../types";
import { PretModal } from "./PretModal";

const ETAT: Record<Etat, { label: string; tone: BadgeTone }> = {
  bon: { label: "Bon état", tone: "ok" },
  a_controler: { label: "À contrôler", tone: "warn" },
  hors_service: { label: "Hors service", tone: "danger" },
};

type MaterielTableProps = { initial: Materiel[]; today: string; personnes: string[] };

export function MaterielTable({ initial, today, personnes }: MaterielTableProps) {
  const [items, setItems] = useState(initial);
  const [lending, setLending] = useState<Materiel | null>(null);
  const { toast } = useToast();

  const setPret = (id: string, pretA: string | null) =>
    setItems((list) => list.map((m) => (m.id === id ? { ...m, pretA } : m)));

  const columns: Column<Materiel>[] = [
    { header: "Matériel", primary: true, cell: (m) => <span className="font-semibold">{m.nom}</span> },
    { header: "État", cell: (m) => <Badge tone={ETAT[m.etat].tone}>{ETAT[m.etat].label}</Badge> },
    {
      header: "Prochain contrôle",
      cell: (m) => {
        const days = daysBetween(today, m.prochainControle);
        return <Badge tone={toneFor(days)}>{formatShort(m.prochainControle)} · {formatDelay(days)}</Badge>;
      },
    },
    { header: "Prêt", cell: (m) => (m.pretA ? `Chez ${m.pretA}` : <span className="text-muted">Disponible</span>) },
    {
      header: "Action",
      cell: (m) =>
        m.pretA ? (
          <Button size="sm" variant="secondary" onClick={() => { setPret(m.id, null); toast("Retour noté"); }}>
            Noter le retour
          </Button>
        ) : (
          <Button size="sm" variant="secondary" disabled={m.etat === "hors_service"} onClick={() => setLending(m)}>
            Prêter
          </Button>
        ),
    },
  ];

  return (
    <Card>
      {items.length > 0 ? (
        <Table caption="Matériel" columns={columns} rows={items} getKey={(m) => m.id} />
      ) : (
        <EmptyState icon={Wrench} title="Aucun matériel" text="Ajoute ton premier objet pour suivre son état." />
      )}
      {lending && (
        <PretModal
          key={lending.id}
          open
          nomMateriel={lending.nom}
          personnes={personnes}
          onClose={() => setLending(null)}
          onConfirm={(p) => {
            setPret(lending.id, p);
            setLending(null);
            toast(`Prêt noté pour ${p}`);
          }}
        />
      )}
    </Card>
  );
}
