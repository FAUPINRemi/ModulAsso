import type { ReactNode } from "react";
import { BureauShell } from "@/components/layout/BureauShell";
import { UserMenu } from "@/features/socle/components/UserMenu";
import { desktopNav } from "@/features/socle/navigation";
import { SessionProvider } from "@/hooks/useSession";
import { config } from "@/lib/config";
import { requireSession } from "@/lib/session";

export default async function BureauLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <SessionProvider session={session}>
      <BureauShell
        structure={session.structure}
        items={desktopNav(session)}
        menu={<UserMenu vue="bureau" demo={config.demoMode} />}
      >
        {children}
      </BureauShell>
    </SessionProvider>
  );
}
