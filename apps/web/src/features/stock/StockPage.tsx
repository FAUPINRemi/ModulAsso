import { PageHeader } from "@/components/layout/PageHeader";
import { todayISO } from "@/lib/dates";
import { requireModule } from "@/lib/session";
import { StockTable } from "./components/StockTable";
import { mockArticles } from "./mock";

export async function StockPage() {
  await requireModule("stock");
  const today = todayISO();

  return (
    <>
      <PageHeader title="Stock" subtitle="Les produits, les quantités et les dates limites." />
      <StockTable initial={mockArticles(today)} today={today} />
    </>
  );
}
