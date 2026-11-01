import { PageHeader } from "@/components/layout/PageHeader";
import { MOCK_MEMBRES } from "@/features/socle/mock";
import { todayISO } from "@/lib/dates";
import { requireModule } from "@/lib/session";
import { MaterielTable } from "./components/MaterielTable";
import { mockMateriel } from "./mock";

export async function MaterielPage() {
  await requireModule("materiel");
  const today = todayISO();
  const personnes = MOCK_MEMBRES.filter((m) => m.statut === "actif").map((m) => m.nom);

  return (
    <>
      <PageHeader title="Matériel" subtitle="L'état du matériel et les prêts en cours." />
      <MaterielTable initial={mockMateriel(today)} today={today} personnes={personnes} />
    </>
  );
}
