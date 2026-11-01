import { PageHeader } from "@/components/layout/PageHeader";
import { requireModule } from "@/lib/session";
import { TachesList } from "./components/TachesList";
import { MOCK_TACHES } from "./mock";

export async function TachesPage() {
  await requireModule("planning");

  return (
    <>
      <PageHeader title="Mes tâches" subtitle="Coche ce qui est fait." />
      <TachesList initial={MOCK_TACHES} />
    </>
  );
}
