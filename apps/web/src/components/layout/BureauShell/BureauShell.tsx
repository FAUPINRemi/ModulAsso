import type { ReactNode } from "react";
import { TopBar, type TopBarItem } from "../TopBar";

type BureauShellProps = { structure: string; items: TopBarItem[]; menu: ReactNode; children: ReactNode };

/** Mise en page bureau : barre en haut, contenu centré. */
export function BureauShell({ structure, items, menu, children }: BureauShellProps) {
  return (
    <>
      <TopBar structure={structure} items={items} menu={menu} />
      <main id="contenu" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </>
  );
}
