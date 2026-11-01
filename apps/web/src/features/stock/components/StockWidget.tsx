import { Badge } from "@/components/ui/Badge";
import { isExpiringSoon, isLow } from "../alertes";
import type { Article } from "../types";

export function StockWidget({ articles, today }: { articles: Article[]; today: string }) {
  const bas = articles.filter(isLow);
  const perimes = articles.filter((a) => isExpiringSoon(a, today));

  if (bas.length === 0 && perimes.length === 0) return <p className="text-sm text-muted">Tout est en ordre.</p>;

  return (
    <div className="flex flex-col gap-3">
      {perimes.length > 0 && (
        <p className="text-sm">
          <Badge tone="warn" className="mr-2">{perimes.length}</Badge>
          {perimes.length > 1 ? "produits bientôt périmés" : "produit bientôt périmé"}
        </p>
      )}
      {bas.length > 0 && (
        <p className="text-sm">
          <Badge tone="danger" className="mr-2">{bas.length}</Badge>
          {bas.length > 1 ? "produits en stock bas" : "produit en stock bas"}
        </p>
      )}
      <p className="text-xs text-muted">{articles.length} produits suivis</p>
    </div>
  );
}
