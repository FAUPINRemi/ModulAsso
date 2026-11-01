"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { cx } from "@/lib/cx";

export type TopBarItem = { href: string; label: string };

type TopBarProps = { structure: string; items: TopBarItem[]; menu: ReactNode };

/** Barre du haut (vue bureau). La navigation est en haut pour gagner de la place. */
export function TopBar({ structure, items, menu }: TopBarProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 bg-brand-900 text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/tableau-de-bord" className="flex shrink-0 items-center gap-2.5 rounded-lg">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-600 text-lg text-white">
            <LogoMark />
          </span>
          <span className="hidden text-sm font-semibold sm:inline">{structure}</span>
        </Link>
        <nav aria-label="Navigation principale" className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center gap-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "block rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {menu}
      </div>
    </div>
  );
}
