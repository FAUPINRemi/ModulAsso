import { PageHeader } from "@/components/layout/PageHeader";
import { idOfFirstName, MOCK_MEMBRES } from "@/features/socle/mock";
import { startOfWeek, todayISO, weekDays } from "@/lib/dates";
import { requireModule } from "@/lib/session";
import { AvailabilityBoard } from "./components/AvailabilityBoard";
import { MesDispos } from "./components/MesDispos";
import { mockDispos } from "./mock";

/** Page mobile "Dispos" : le carnet de l'équipe (dirigeant) ou mes propres dispos (bénévole). */
export async function DisposPage() {
  const session = await requireModule("planning");
  const monday = startOfWeek(todayISO());
  const days = weekDays(monday);
  const dispos = mockDispos(monday);
  const leader = session.role === "dirigeant";

  return (
    <>
      <PageHeader
        title={leader ? "Dispos de l'équipe" : "Mes disponibilités"}
        subtitle={leader ? "Clique sur une case pour la changer." : "Dis-nous quand tu peux venir cette semaine."}
      />
      {leader ? (
        <AvailabilityBoard days={days} membres={MOCK_MEMBRES.slice(0, 6)} initial={dispos} />
      ) : (
        <MesDispos days={days} membreId={idOfFirstName(session.nom)} initial={dispos} />
      )}
    </>
  );
}
