import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

export const fieldClasses =
  "w-full min-h-11 rounded-xl border bg-card px-3.5 text-base text-ink placeholder:text-muted/70 " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-brand-600 disabled:bg-canvas disabled:text-muted";

export function Input({ className, invalid, ...rest }: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cx(fieldClasses, invalid ? "border-danger-strong" : "border-line", className)}
      {...rest}
    />
  );
}
