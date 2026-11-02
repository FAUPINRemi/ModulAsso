import { cx } from "@/lib/cx";

const PALETTE = [
  "bg-[#f4dfb8] text-[#6b4a0c]",
  "bg-[#d3e6f5] text-[#1f4f77]",
  "bg-[#d9ecd8] text-[#1d5a2a]",
  "bg-[#ecd6ea] text-[#6a2d63]",
  "bg-[#f6d6cc] text-[#8a3a22]",
];

function colorFor(name: string): string {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return PALETTE[sum % PALETTE.length] ?? PALETTE[0]!;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]! : "";
  return (first[0]! + (last[0] ?? "")).toUpperCase();
}

type AvatarProps = { name: string; size?: "sm" | "md"; className?: string };

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold",
        size === "sm" ? "size-6 text-[0.65rem]" : "size-9 text-sm",
        colorFor(name),
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
