import type { ReactNode } from "react";
import { BottomNav, type BottomNavItem } from "../BottomNav";

/** Mise en page mobile : une colonne étroite et la barre du bas. */
export function MobileShell({ items, children }: { items: BottomNavItem[]; children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md">
      <main id="contenu" className="px-4 pt-6 pb-32">
        {children}
      </main>
      <BottomNav items={items} />
    </div>
  );
}
