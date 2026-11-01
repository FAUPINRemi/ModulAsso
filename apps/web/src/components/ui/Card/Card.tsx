import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

export function Card({ className, ...rest }: ComponentProps<"section">) {
  return (
    <section
      className={cx("rounded-card border border-line bg-card p-4 shadow-card @container sm:p-5", className)}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: ComponentProps<"h2">) {
  return <h2 className={cx("text-base font-semibold text-ink", className)} {...rest} />;
}
