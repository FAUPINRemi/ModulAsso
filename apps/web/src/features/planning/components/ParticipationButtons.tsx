"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

/** "Je viens" / "Je ne peux pas". Avec l'API : une ligne dans `participation`. */
export function ParticipationButtons({ titre }: { titre: string }) {
  const [choice, setChoice] = useState<"oui" | "non" | null>(null);
  const { toast } = useToast();

  const pick = (value: "oui" | "non") => {
    setChoice(value);
    toast(value === "oui" ? `C'est noté, tu viens : ${titre}` : "C'est noté, merci de l'avoir dit");
  };

  return (
    <div className="grid grid-cols-2 gap-2" role="group" aria-label={`Participation : ${titre}`}>
      <Button variant={choice === "oui" ? "primary" : "secondary"} aria-pressed={choice === "oui"} onClick={() => pick("oui")}>
        Je viens
      </Button>
      <Button variant={choice === "non" ? "primary" : "secondary"} aria-pressed={choice === "non"} onClick={() => pick("non")}>
        Je ne peux pas
      </Button>
    </div>
  );
}
