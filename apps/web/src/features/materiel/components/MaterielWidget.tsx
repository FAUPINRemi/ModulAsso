import { Badge } from "@/components/ui/Badge";
import { daysBetween } from "@/lib/dates";
import type { Materiel } from "../types";

export function MaterielWidget({ items, today }: { items: Materiel[]; today: string }) {
  const aControler = items.filter((m) => m.etat !== "bon" || daysBetween(today, m.prochainControle) <= 14);
  const prets = items.filter((m) => m.pretA).length;

  return (
    <div className="flex flex-col gap-3">
      {aControler.length === 0 ? (
        <p className="text-sm">Tout est à jour.</p>
      ) : (
        <p className="text-sm">
          <Badge tone="warn" className="mr-2">{aControler.length}</Badge>
          {aControler.length > 1 ? "objets à contrôler" : "objet à contrôler"}
        </p>
      )}
      <p className="text-xs text-muted">{prets} en prêt · {items.length} objets suivis</p>
    </div>
  );
}
