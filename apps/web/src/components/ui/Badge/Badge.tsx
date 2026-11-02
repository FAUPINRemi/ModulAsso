import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

export type BadgeTone = "neutral" | "brand" | "ok" | "maybe" | "warn" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-off-soft text-off-strong",
  brand: "bg-brand-100 text-brand-800",
  ok: "bg-ok-soft text-ok-strong",
  maybe: "bg-maybe-soft text-maybe-strong",
  warn: "bg-warn-soft text-warn-strong",
  danger: "bg-danger-soft text-danger-strong",
};

export function Badge({ tone = "neutral", className, ...rest }: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
