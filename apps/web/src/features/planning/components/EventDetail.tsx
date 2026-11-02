"use client";

import { CalendarX, MapPin, Clock } from "lucide-react";
import { EmptyState } from "@/components/data/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { useSession } from "@/hooks/useSession";
import { formatLong } from "@/lib/dates";
import { nameOf } from "@/features/socle/mock";
import type { Evenement } from "../types";
import { ParticipationButtons } from "./ParticipationButtons";

export function EventDetail({ evenement, day }: { evenement?: Evenement; day: string }) {
  const { role } = useSession();
  const { toast } = useToast();

  if (!evenement) {
    return (
      <Card>
        <EmptyState icon={CalendarX} title="Rien de prévu ce jour" text={`Le ${formatLong(day)} est libre.`} />
      </Card>
    );
  }

  const manque = Math.max(0, evenement.besoin - evenement.inscrits.length);

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">{formatLong(evenement.date)}</p>
        <h2 className="mt-1 text-xl font-bold">{evenement.titre}</h2>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <Clock className="size-4" aria-hidden /> {evenement.debut} à {evenement.fin}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-4" aria-hidden /> {evenement.lieu}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ul className="flex -space-x-1.5" aria-label="Personnes inscrites">
          {evenement.inscrits.slice(0, 5).map((id) => (
            <li key={id}>
              <Avatar name={nameOf(id)} size="sm" className="ring-2 ring-card" />
            </li>
          ))}
        </ul>
        <p className="text-sm font-semibold">
          {evenement.inscrits.length} sur {evenement.besoin} inscrits
        </p>
      </div>

      {manque > 0 && (
        <p className="rounded-xl bg-warn-soft px-3.5 py-2.5 text-sm font-medium text-warn-strong">
          Il manque {manque} {manque > 1 ? "personnes" : "personne"} pour ce créneau.
        </p>
      )}

      {role === "dirigeant" ? (
        manque > 0 && (
          <Button full onClick={() => toast("Demande envoyée aux bénévoles disponibles")}>
            Proposer le créneau
          </Button>
        )
      ) : (
        <ParticipationButtons titre={evenement.titre} />
      )}
    </Card>
  );
}
