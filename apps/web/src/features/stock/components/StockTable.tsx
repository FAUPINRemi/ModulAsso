"use client";

import { Minus, PackageSearch, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/data/EmptyState";
import { SearchBar } from "@/components/data/SearchBar";
import { Table, type Column } from "@/components/data/Table";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDelay, formatShort, daysBetween } from "@/lib/dates";
import { isExpiringSoon, isLow } from "../alertes";
import type { Article } from "../types";

const step = "inline-flex size-9 items-center justify-center rounded-lg border border-line bg-card hover:bg-brand-50";

export function StockTable({ initial, today }: { initial: Article[]; today: string }) {
  const [articles, setArticles] = useState(initial);
  const [query, setQuery] = useState("");

  const change = (id: string, delta: number) =>
    setArticles((list) => list.map((a) => (a.id === id ? { ...a, quantite: Math.max(0, a.quantite + delta) } : a)));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? articles.filter((a) => `${a.nom} ${a.lieu}`.toLowerCase().includes(q)) : articles;
  }, [articles, query]);

  const columns: Column<Article>[] = [
    { header: "Produit", primary: true, cell: (a) => <span className="font-semibold">{a.nom}</span> },
    {
      header: "Quantité",
      cell: (a) => (
        <span className="inline-flex items-center gap-2">
          <button type="button" className={step} aria-label={`Retirer un ${a.nom}`} onClick={() => change(a.id, -1)}>
            <Minus className="size-4" aria-hidden />
          </button>
          <span className="min-w-16 text-center text-sm font-semibold">{a.quantite} {a.unite}</span>
          <button type="button" className={step} aria-label={`Ajouter un ${a.nom}`} onClick={() => change(a.id, 1)}>
            <Plus className="size-4" aria-hidden />
          </button>
        </span>
      ),
    },
    { header: "Lieu", cell: (a) => a.lieu },
    {
      header: "Date limite",
      cell: (a) =>
        a.dlc ? (
          <Badge tone={isExpiringSoon(a, today) ? "warn" : "neutral"}>
            {formatShort(a.dlc)} · {formatDelay(daysBetween(today, a.dlc))}
          </Badge>
        ) : (
          <span className="text-muted">Aucune</span>
        ),
    },
    {
      header: "Alerte",
      cell: (a) => (isLow(a) ? <Badge tone="danger">Stock bas</Badge> : <Badge tone="ok">Correct</Badge>),
    },
  ];

  return (
    <Card className="flex flex-col gap-4">
      <SearchBar value={query} onChange={setQuery} label="Chercher un produit" />
      {rows.length > 0 ? (
        <Table caption="Stock" columns={columns} rows={rows} getKey={(a) => a.id} />
      ) : (
        <EmptyState icon={PackageSearch} title="Aucun produit trouvé" text="Essaie un autre mot." />
      )}
    </Card>
  );
}
