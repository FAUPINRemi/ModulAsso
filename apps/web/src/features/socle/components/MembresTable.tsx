"use client";

import { UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/data/EmptyState";
import { SearchBar } from "@/components/data/SearchBar";
import { Table, type Column } from "@/components/data/Table";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InviteModal } from "./InviteModal";
import type { Membre } from "../types";

const columns: Column<Membre>[] = [
  {
    header: "Nom",
    primary: true,
    cell: (m) => (
      <span className="flex items-center gap-3">
        <Avatar name={m.nom} />
        <span>
          <span className="block font-semibold">{m.nom}</span>
          <span className="block text-xs font-normal text-muted">{m.email}</span>
        </span>
      </span>
    ),
  },
  { header: "Équipe", cell: (m) => m.equipe },
  {
    header: "Rôle",
    cell: (m) => <Badge tone={m.role === "dirigeant" ? "brand" : "neutral"}>{m.role === "dirigeant" ? "Dirigeant" : "Bénévole"}</Badge>,
  },
  {
    header: "Statut",
    cell: (m) => <Badge tone={m.statut === "actif" ? "ok" : "maybe"}>{m.statut === "actif" ? "Actif" : "Invitation envoyée"}</Badge>,
  },
];

export function MembresTable({ membres }: { membres: Membre[] }) {
  const [query, setQuery] = useState("");
  const [inviting, setInviting] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? membres.filter((m) => `${m.nom} ${m.equipe} ${m.email}`.toLowerCase().includes(q)) : membres;
  }, [membres, query]);

  const invite = (
    <Button onClick={() => setInviting(true)}>
      <UserPlus className="size-4" aria-hidden />
      Inviter
    </Button>
  );

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar value={query} onChange={setQuery} label="Chercher un bénévole" />
        {invite}
      </div>
      {rows.length > 0 ? (
        <Table caption="Bénévoles de l'association" columns={columns} rows={rows} getKey={(m) => m.id} />
      ) : (
        <EmptyState icon={Users} title="Personne ne correspond" text="Essaie un autre mot ou invite une nouvelle personne." action={invite} />
      )}
      <InviteModal open={inviting} onClose={() => setInviting(false)} />
    </Card>
  );
}
