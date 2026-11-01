"use client";

import { Link2, Plus, UsersRound } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/data/EmptyState";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useSession } from "@/hooks/useSession";
import type { Evenement, Groupe } from "../types";

type GroupesPanelProps = { initial: Groupe[]; evenements: Evenement[] };

/** Événementiel : seuls les dirigeants créent un groupe, les bénévoles le rejoignent par lien. */
export function GroupesPanel({ initial, evenements }: GroupesPanelProps) {
  const { role } = useSession();
  const { toast } = useToast();
  const [groupes, setGroupes] = useState(initial);
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [evenement, setEvenement] = useState(evenements[0]?.titre ?? "");

  const create = () => {
    const id = crypto.randomUUID();
    setGroupes((list) => [...list, { id, nom: nom.trim(), evenement, membres: 0, lien: `/invitation/${id}` }]);
    setNom("");
    setOpen(false);
    toast("Groupe créé. Partage son lien pour inviter du monde.");
  };

  const copy = async (lien: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${lien}`);
      toast("Lien copié");
    } catch {
      toast("Copie impossible");
    }
  };

  const createButton = role === "dirigeant" && (
    <Button onClick={() => setOpen(true)}>
      <Plus className="size-4" aria-hidden />
      Créer un groupe
    </Button>
  );

  return (
    <div className="flex flex-col gap-4">
      {createButton && <div className="flex justify-end">{createButton}</div>}
      {groupes.length === 0 ? (
        <EmptyState icon={UsersRound} title="Pas encore de groupe" text="Un groupe réunit les bénévoles d'un événement." action={createButton || undefined} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {groupes.map((g) => (
            <li key={g.id}>
              <Card className="flex h-full flex-col gap-3">
                <div>
                  <h2 className="font-bold">{g.nom}</h2>
                  <p className="text-sm text-muted">{g.evenement}</p>
                </div>
                <p className="text-sm font-semibold">{g.membres} {g.membres > 1 ? "membres" : "membre"}</p>
                {role === "dirigeant" && (
                  <Button variant="secondary" size="sm" className="mt-auto self-start" onClick={() => copy(g.lien)}>
                    <Link2 className="size-4" aria-hidden />
                    Copier le lien d'invitation
                  </Button>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Créer un groupe"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={create} disabled={nom.trim() === ""}>Créer</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <FormField label="Nom du groupe">
            {(f) => <Input {...f} value={nom} onChange={(e) => setNom(e.target.value)} autoFocus />}
          </FormField>
          <FormField label="Événement">
            {(f) => (
              <Select id={f.id} value={evenement} onChange={(e) => setEvenement(e.target.value)}>
                {evenements.map((e) => <option key={e.id} value={e.titre}>{e.titre}</option>)}
              </Select>
            )}
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
