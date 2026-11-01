import type { Metadata } from "next";
import { AuthCard } from "@/features/socle/components/AuthCard";
import { InvitationForm } from "@/features/socle/components/AuthForms";

export const metadata: Metadata = { title: "Invitation" };

// Le jeton sera vérifié par l'API (il n'est gardé qu'en empreinte SHA-256 dans la base).
export default function InvitationPage() {
  return (
    <AuthCard title="On t'a invité·e" text="Crée ton compte pour rejoindre l'association et donner tes disponibilités.">
      <InvitationForm />
    </AuthCard>
  );
}
