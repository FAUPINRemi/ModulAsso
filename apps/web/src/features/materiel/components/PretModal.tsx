"use client";

import { useState } from "react";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";

type PretModalProps = {
  open: boolean;
  nomMateriel: string;
  personnes: string[];
  onClose: () => void;
  onConfirm: (personne: string) => void;
};

export function PretModal({ open, nomMateriel, personnes, onClose, onConfirm }: PretModalProps) {
  const [personne, setPersonne] = useState(personnes[0] ?? "");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Prêter : ${nomMateriel}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={() => onConfirm(personne)} disabled={!personne}>Valider le prêt</Button>
        </>
      }
    >
      <FormField label="À qui ?">
        {(f) => (
          <Select id={f.id} value={personne} onChange={(e) => setPersonne(e.target.value)}>
            {personnes.map((p) => <option key={p}>{p}</option>)}
          </Select>
        )}
      </FormField>
    </Modal>
  );
}
