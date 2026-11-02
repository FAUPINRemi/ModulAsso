import { Loader2 } from "lucide-react";

export function Loader({ label = "Chargement" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
      <Loader2 className="size-5 animate-spin" aria-hidden />
      {label}…
    </div>
  );
}
