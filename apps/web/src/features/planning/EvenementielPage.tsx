import { PageHeader } from "@/components/layout/PageHeader";
import { startOfWeek, todayISO } from "@/lib/dates";
import { requireModule } from "@/lib/session";
import { GroupesPanel } from "./components/GroupesPanel";
import { MOCK_GROUPES, mockEvenements } from "./mock";

export async function EvenementielPage() {
  await requireModule("planning");
  const monday = startOfWeek(todayISO());

  return (
    <>
      <PageHeader title="Événementiel" subtitle="Des groupes de bénévoles pour chaque événement." />
      <GroupesPanel initial={MOCK_GROUPES} evenements={mockEvenements(monday)} />
    </>
  );
}
