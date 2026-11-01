import { ChevronRight, LogOut, Monitor, Repeat } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { config } from "@/lib/config";
import { requireSession } from "@/lib/session";
import { choisirVue, deconnecter, entrerEnDemo } from "./actions";
import { MODULES } from "./modules";

const row = "flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left text-sm font-semibold";

/** Onglet "Plus" : tout ce qui ne tient pas dans la barre du bas. */
export async function PlusMobilePage() {
  const session = await requireSession();
  const leader = session.role === "dirigeant";
  const links = [
    ...MODULES.filter((m) => session.modules.includes(m.code) && m.code !== "planning").flatMap((m) => m.pages),
    ...(session.modules.includes("planning") ? [{ href: "/evenementiel", label: "Événementiel" }] : []),
    ...(leader ? [{ href: "/benevoles", label: "Bénévoles" }, { href: "/modules", label: "Modules" }] : []),
  ];
  const otherRole = leader ? "benevole" : "dirigeant";

  return (
    <>
      <PageHeader title="Plus" subtitle={`${session.nom} · ${leader ? "Dirigeant" : "Bénévole"} · ${session.structure}`} />
      <div className="flex flex-col gap-4">
        <Card className="p-0 sm:p-0">
          <ul className="divide-y divide-line">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={`/m${l.href}`} className={row}>
                  {l.label}
                  <ChevronRight className="size-4 text-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-0 sm:p-0">
          <ul className="divide-y divide-line">
            <li>
              <form action={choisirVue.bind(null, "bureau")}>
                <button className={row}>
                  Passer en vue bureau <Monitor className="size-4 text-muted" aria-hidden />
                </button>
              </form>
            </li>
            {config.demoMode && (
              <li>
                <form action={entrerEnDemo.bind(null, otherRole)}>
                  <button className={row}>
                    Voir comme {leader ? "bénévole" : "dirigeant"} (démo) <Repeat className="size-4 text-muted" aria-hidden />
                  </button>
                </form>
              </li>
            )}
            <li>
              <form action={deconnecter}>
                <button className={row}>
                  Se déconnecter <LogOut className="size-4 text-muted" aria-hidden />
                </button>
              </form>
            </li>
          </ul>
        </Card>
      </div>
    </>
  );
}
