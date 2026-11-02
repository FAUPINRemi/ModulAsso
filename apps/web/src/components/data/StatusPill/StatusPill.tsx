import { cx } from "@/lib/cx";

export type Statut = "dispo" | "peut-etre" | "non" | "absent";

export const STATUT_LABEL: Record<Statut, string> = {
  dispo: "Dispo",
  "peut-etre": "Peut-être",
  non: "Non",
  absent: "Absent",
};

const styles: Record<Statut, string> = {
  dispo: "bg-ok-soft text-ok-strong",
  "peut-etre": "bg-maybe-soft text-maybe-strong",
  non: "bg-off-soft text-off-strong",
  absent: "bg-danger-soft text-danger-strong",
};

export function StatusPill({ statut, className }: { statut: Statut; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex min-w-[4.5rem] items-center whitespace-nowrap justify-center rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[statut],
        className,
      )}
    >
      {STATUT_LABEL[statut]}
    </span>
  );
}
