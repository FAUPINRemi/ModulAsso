import { PageHeader } from "@/components/layout/PageHeader";
import { todayISO } from "@/lib/dates";
import { requireModule } from "@/lib/session";
import { EcheancesList } from "./components/EcheancesList";
import { mockEcheances } from "./mock";

export async function EcheancesPage() {
  await requireModule("echeances");
  const today = todayISO();

  return (
    <>
      <PageHeader title="Échéances" subtitle="Les dates à ne pas rater. On te prévient avant." />
      <EcheancesList initial={mockEcheances(today)} today={today} />
    </>
  );
}
