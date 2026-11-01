import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/data/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <EmptyState
        icon={SearchX}
        title="Cette page n'existe pas"
        text="Le lien est peut-être ancien ou mal écrit."
        action={<ButtonLink href="/">Retour à l'accueil</ButtonLink>}
      />
    </main>
  );
}
