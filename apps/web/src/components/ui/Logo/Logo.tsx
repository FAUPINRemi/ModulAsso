import { cx } from "@/lib/cx";

// Le "a" hexagonal du logo (option B). Même tracé que l'icône de l'application.
const GLYPH =
  "M41.4 78 L128 28 L184.6 60.68 L184.6 28 L214.6 28 L214.6 228 L184.6 228 L184.6 195.32 L128 228 L41.4 178 Z M128 62.64 L184.6 95.32 L184.6 160.68 L128 193.36 L71.4 160.68 L71.4 95.32 Z";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="41.4 28 173.2 200" className={cx("h-[1em] w-auto", className)} aria-hidden>
      <path fillRule="evenodd" fill="currentColor" d={GLYPH} />
    </svg>
  );
}

/** Le mot "alvéo" : le "a" est remplacé par la marque. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Alvéo"
      className={cx("inline-flex items-center gap-[0.06em] font-bold leading-none tracking-tight text-brand-600", className)}
    >
      <LogoMark className="translate-y-[0.02em]" />
      <span aria-hidden>lvéo</span>
    </span>
  );
}
