"use client";

import { LogOut, Monitor, Repeat, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { useSession } from "@/hooks/useSession";
import type { Vue } from "@/lib/device";
import { choisirVue, deconnecter, entrerEnDemo } from "../actions";

const itemClass =
  "flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium hover:bg-brand-50";

/** Menu du compte : changer de vue, changer de rôle (démo), se déconnecter. */
export function UserMenu({ vue, demo }: { vue: Vue; demo: boolean }) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const otherRole = session.role === "dirigeant" ? "benevole" : "dirigeant";

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu du compte"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full"
      >
        <Avatar name={session.nom} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-line bg-card p-2 text-ink shadow-xl">
          <div className="px-3 py-2">
            <p className="font-semibold">{session.nom}</p>
            <p className="text-xs text-muted">
              {session.role === "dirigeant" ? "Dirigeant" : "Bénévole"} · {session.structure}
            </p>
          </div>
          <hr className="my-1 border-line" />
          <form action={choisirVue.bind(null, vue === "bureau" ? "mobile" : "bureau")}>
            <button className={itemClass} role="menuitem">
              {vue === "bureau" ? <Smartphone className="size-4" aria-hidden /> : <Monitor className="size-4" aria-hidden />}
              {vue === "bureau" ? "Passer en vue mobile" : "Passer en vue bureau"}
            </button>
          </form>
          {demo && (
            <form action={entrerEnDemo.bind(null, otherRole)}>
              <button className={itemClass} role="menuitem">
                <Repeat className="size-4" aria-hidden />
                Voir comme {otherRole === "dirigeant" ? "dirigeant" : "bénévole"} (démo)
              </button>
            </form>
          )}
          <form action={deconnecter}>
            <button className={itemClass} role="menuitem">
              <LogOut className="size-4" aria-hidden />
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
