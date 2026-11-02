"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useSession } from "@/hooks/useSession";
import { formatLong } from "@/lib/dates";
import type { Evenement } from "../types";

/** Carte d'accueil mobile : où il manque du monde. Texte et bouton changent selon le rôle. */
export function BesoinCard({ evenement }: { evenement: Evenement | undefined }) {
  const { role } = useSession();
  const { toast } = useToast();
  const manque = evenement ? evenement.besoin - evenement.inscrits.length : 0;

  if (!evenement || manque <= 0) return null;
  const jour = formatLong(evenement.date).split(" ")[0];

  return (
    <div className="flex flex-col gap-3 rounded-card bg-warn-soft p-4">
      <div>
        <p className="font-bold text-ink capitalize">
          {role === "dirigeant" ? `Il manque ${manque} ${manque > 1 ? "personnes" : "personne"} ${jour}` : `${jour}, on a besoin de vous`}
        </p>
        <p className="text-sm text-warn-strong">
          {evenement.titre} : il reste {manque} {manque > 1 ? "places" : "place"}.
        </p>
      </div>
      <Button
        variant="accent"
        full
        onClick={() => toast(role === "dirigeant" ? "Demande envoyée aux bénévoles disponibles" : "Merci, c'est noté : tu es disponible")}
      >
        {role === "dirigeant" ? "Proposer le créneau" : "Je suis disponible"}
      </Button>
    </div>
  );
}
