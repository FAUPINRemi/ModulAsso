import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { EcheancesWidget } from "@/features/echeances/components/EcheancesWidget";
import { mockEcheances } from "@/features/echeances/mock";
import { BesoinCard } from "@/features/planning/components/BesoinCard";
import { ParticipationButtons } from "@/features/planning/components/ParticipationButtons";
import { PresenceStat } from "@/features/planning/components/PresenceStat";
import { TachesList } from "@/features/planning/components/TachesList";
import { MOCK_TACHES, mockEvenements } from "@/features/planning/mock";
import { formatLong, startOfWeek, todayISO } from "@/lib/dates";
import { requireSession } from "@/lib/session";

/** Accueil mobile. Le dirigeant voit l'équipe, le bénévole voit ce qui le concerne. */
export async function AccueilMobilePage() {
  const session = await requireSession();
  const today = todayISO();
  const leader = session.role === "dirigeant";
  const planning = session.modules.includes("planning");
  const evenements = mockEvenements(startOfWeek(today)).filter((e) => e.date >= today);
  const besoin = evenements.find((e) => e.inscrits.length < e.besoin);
  const prochain = evenements[0];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow={formatLong(today)} title={`Bonjour ${session.nom}`} />

      {planning && leader && <PresenceStat percent={86} />}
      {planning && <BesoinCard evenement={besoin} />}

      {planning && !leader && prochain && (
        <Card className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Prochain événement</p>
            <CardTitle className="text-lg">{prochain.titre}</CardTitle>
            <p className="text-sm text-muted capitalize">{formatLong(prochain.date)} · {prochain.lieu}</p>
          </div>
          <ParticipationButtons titre={prochain.titre} />
        </Card>
      )}

      {planning && !leader && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Mes tâches</h2>
            <Link href="/m/taches" className="text-sm font-semibold text-brand-700">Tout voir</Link>
          </div>
          <TachesList initial={MOCK_TACHES} limit={2} />
        </section>
      )}

      {session.modules.includes("echeances") && (
        <Card className="flex flex-col gap-3">
          <CardTitle>À ne pas rater</CardTitle>
          <EcheancesWidget echeances={mockEcheances(today)} today={today} />
        </Card>
      )}

      {leader && planning && (
        <Card className="flex flex-col gap-3">
          <CardTitle>Raccourcis</CardTitle>
          <ButtonLink href="/m/evenementiel" variant="primary" full>
            + Créer un groupe
          </ButtonLink>
        </Card>
      )}
    </div>
  );
}
