import { PageHeader } from "@/components/layout/PageHeader";
import { requireDirigeant } from "@/lib/session";
import { ModulesPanel } from "./components/ModulesPanel";

export async function ModulesPage() {
  const session = await requireDirigeant();

  return (
    <>
      <PageHeader title="Modules" subtitle="Garde seulement ce dont tu as besoin. Le reste disparaît du menu." />
      <ModulesPanel initial={session.modules} />
    </>
  );
}
