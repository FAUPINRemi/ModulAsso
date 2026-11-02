import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Membre } from "../types";

export function BenevolesWidget({ membres }: { membres: Membre[] }) {
  const actifs = membres.filter((m) => m.statut === "actif" && m.role === "benevole").slice(0, 4);
  const invites = membres.filter((m) => m.statut === "invite").length;

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2.5">
        {actifs.map((m) => (
          <li key={m.id} className="flex items-center gap-3">
            <Avatar name={m.nom} size="sm" />
            <span className="flex-1 truncate text-sm font-medium">{m.nom}</span>
            <span className="text-xs text-muted">{m.equipe}</span>
          </li>
        ))}
      </ul>
      {invites > 0 && <Badge tone="maybe" className="self-start">{invites} invitations en attente</Badge>}
    </div>
  );
}
