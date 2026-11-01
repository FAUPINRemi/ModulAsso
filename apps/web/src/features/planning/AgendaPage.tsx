import { PageHeader } from "@/components/layout/PageHeader";
import { idOfFirstName, MOCK_MEMBRES } from "@/features/socle/mock";
import { startOfWeek, todayISO } from "@/lib/dates";
import { requireModule } from "@/lib/session";
import { AgendaView } from "./components/AgendaView";
import { mockDispos, mockEvenements } from "./mock";

export async function AgendaPage() {
  const session = await requireModule("planning");
  const today = todayISO();
  const monday = startOfWeek(today);

  return (
    <>
      <PageHeader title="Agenda et disponibilités" subtitle="Qui est là, quand, et ce qu'il reste à faire." />
      <AgendaView
        monday={monday}
        today={today}
        evenements={mockEvenements(monday)}
        membres={MOCK_MEMBRES.slice(0, 6)}
        dispos={mockDispos(monday)}
        moi={idOfFirstName(session.nom)}
      />
    </>
  );
}
