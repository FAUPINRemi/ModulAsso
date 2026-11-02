import { WidgetGrid, type Widget } from "@/components/dashboard/WidgetGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { EcheancesWidget } from "@/features/echeances/components/EcheancesWidget";
import { mockEcheances } from "@/features/echeances/mock";
import { MaterielWidget } from "@/features/materiel/components/MaterielWidget";
import { mockMateriel } from "@/features/materiel/mock";
import { PlanningWidget } from "@/features/planning/components/PlanningWidget";
import { PresenceStat } from "@/features/planning/components/PresenceStat";
import { TachesList } from "@/features/planning/components/TachesList";
import { MOCK_TACHES, mockEvenements } from "@/features/planning/mock";
import { StockWidget } from "@/features/stock/components/StockWidget";
import { mockArticles } from "@/features/stock/mock";
import { startOfWeek, todayISO } from "@/lib/dates";
import { requireSession } from "@/lib/session";
import { BenevolesWidget } from "./components/BenevolesWidget";
import { MOCK_MEMBRES } from "./mock";

/** Tableau de bord : chaque widget dépend du rôle et des modules actifs. */
export async function DashboardPage() {
  const session = await requireSession();
  const today = todayISO();
  const leader = session.role === "dirigeant";
  const has = (code: (typeof session.modules)[number]) => session.modules.includes(code);

  const widgets: Widget[] = [];
  if (has("planning")) {
    widgets.push({
      id: "planning",
      title: "Planning de la semaine",
      wide: true,
      content: <PlanningWidget evenements={mockEvenements(startOfWeek(today))} today={today} />,
    });
    widgets.push(
      leader
        ? { id: "presences", title: "Présences du mois", content: <PresenceStat percent={86} /> }
        : { id: "taches", title: "Mes tâches", content: <TachesList initial={MOCK_TACHES} limit={3} bare /> },
    );
  }
  if (leader) widgets.push({ id: "benevoles", title: "Bénévoles", content: <BenevolesWidget membres={MOCK_MEMBRES} /> });
  if (has("echeances"))
    widgets.push({ id: "echeances", title: "Échéances", content: <EcheancesWidget echeances={mockEcheances(today)} today={today} /> });
  if (has("materiel")) widgets.push({ id: "materiel", title: "Matériel", content: <MaterielWidget items={mockMateriel(today)} today={today} /> });
  if (has("stock")) widgets.push({ id: "stock", title: "Stock", content: <StockWidget articles={mockArticles(today)} today={today} /> });

  return (
    <>
      <PageHeader
        eyebrow={session.structure}
        title={`Bonjour ${session.nom}`}
        subtitle="Voici ce qui compte aujourd'hui. Glisse les blocs pour les ranger à ta façon."
      />
      <WidgetGrid widgets={widgets} storageKey={`alveo:dashboard:${session.role}`} />
    </>
  );
}
