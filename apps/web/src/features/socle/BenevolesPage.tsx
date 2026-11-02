import { PageHeader } from "@/components/layout/PageHeader";
import { requireDirigeant } from "@/lib/session";
import { MembresTable } from "./components/MembresTable";
import { MOCK_MEMBRES } from "./mock";

export async function BenevolesPage() {
  await requireDirigeant();

  return (
    <>
      <PageHeader title="Bénévoles" subtitle="Les personnes de ton association. Invite-les avec un lien." />
      <MembresTable membres={MOCK_MEMBRES} />
    </>
  );
}
