"use client";

import { CalendarDays, CheckSquare, Home, MoreHorizontal, UserCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";

export type NavIcon = "home" | "calendar" | "dispos" | "taches" | "plus";

const ICONS: Record<NavIcon, LucideIcon> = {
  home: Home,
  calendar: CalendarDays,
  dispos: UserCheck,
  taches: CheckSquare,
  plus: MoreHorizontal,
};

export type BottomNavItem = { href: string; label: string; icon: NavIcon };

/** Barre du bas (vue mobile) : 5 zones au maximum, faciles à toucher du pouce. */
export function BottomNav({ items }: { items: BottomNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <ul className="flex rounded-2xl border border-line bg-card/95 p-1.5 shadow-lg backdrop-blur">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active = item.href === "/m" ? pathname === "/m" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[0.7rem] font-semibold",
                  active ? "bg-brand-50 text-brand-700" : "text-muted",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
