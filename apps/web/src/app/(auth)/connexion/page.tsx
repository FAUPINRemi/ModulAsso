import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { entrerEnDemo } from "@/features/socle/actions";
import { AuthLink, LoginForm } from "@/features/socle/components/AuthForms";
import { AuthCard } from "@/features/socle/components/AuthCard";
import { config } from "@/lib/config";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <>
      <AuthCard title="Content de te revoir" text="Connecte-toi pour retrouver ton association.">
        <LoginForm />
        <p className="text-center text-sm text-muted">
          Pas encore de compte ? <AuthLink href="/inscription">Créer mon association</AuthLink>
        </p>
      </AuthCard>

      {config.demoMode && (
        <Card className="flex flex-col gap-3 border-dashed bg-brand-50">
          <div>
            <h2 className="font-semibold">Mode démo</h2>
            <p className="text-sm text-muted">Entre sans compte pour tester les pages avec des données d'exemple.</p>
          </div>
          <div className="grid gap-2">
            <form action={entrerEnDemo.bind(null, "dirigeant")}>
              <Button type="submit" variant="secondary" full>
                Essayer comme dirigeant
              </Button>
            </form>
            <form action={entrerEnDemo.bind(null, "benevole")}>
              <Button type="submit" variant="secondary" full>
                Essayer comme bénévole
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
