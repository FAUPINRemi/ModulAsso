import type { Metadata } from "next";
import { AuthCard } from "@/features/socle/components/AuthCard";
import { AuthLink, SignupForm } from "@/features/socle/components/AuthForms";

export const metadata: Metadata = { title: "Créer mon association" };

export default function InscriptionPage() {
  return (
    <AuthCard title="Crée ton espace" text="C'est gratuit. Tu choisiras ensuite les modules dont tu as besoin.">
      <SignupForm />
      <p className="text-center text-sm text-muted">
        Déjà un compte ? <AuthLink href="/connexion">Me connecter</AuthLink>
      </p>
    </AuthCard>
  );
}
