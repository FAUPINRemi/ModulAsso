"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";

type InviteModalProps = { open: boolean; onClose: () => void };

/**
 * Crée un lien d'invitation. Ici le jeton est inventé dans le navigateur pour la démo.
 * Avec l'API : POST /invitations, le jeton est gardé en empreinte SHA-256 et envoyé par e-mail.
 */
export function InviteModal({ open, onClose }: InviteModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const invalid = email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const close = () => {
    setEmail("");
    setLink(null);
    setCopied(false);
    onClose();
  };

  const create = () => {
    setLink(`${window.location.origin}/invitation/${crypto.randomUUID()}`);
    toast("Le lien est prêt");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link ?? "");
      setCopied(true);
    } catch {
      toast("Copie impossible, sélectionne le lien à la main");
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Inviter un bénévole"
      footer={
        link ? (
          <Button onClick={close}>Terminé</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={close}>
              Annuler
            </Button>
            <Button onClick={create} disabled={email === "" || invalid}>
              Créer le lien
            </Button>
          </>
        )
      }
    >
      {link ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">Envoie ce lien à {email}. Il ne marche qu'une seule fois.</p>
          <div className="flex gap-2">
            <Input readOnly value={link} aria-label="Lien d'invitation" onFocus={(e) => e.currentTarget.select()} />
            <Button variant="secondary" onClick={copy} aria-label="Copier le lien">
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <FormField label="Adresse e-mail" error={invalid ? "Cette adresse n'a pas l'air valide." : undefined}>
            {(f) => <Input {...f} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />}
          </FormField>
          <FormField label="Rôle">
            {(f) => (
              <Select id={f.id} defaultValue="benevole">
                <option value="benevole">Bénévole</option>
                <option value="dirigeant">Dirigeant</option>
              </Select>
            )}
          </FormField>
        </div>
      )}
    </Modal>
  );
}
