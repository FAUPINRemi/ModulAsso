import type { ReactNode } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { mobileNav } from "@/features/socle/navigation";
import { SessionProvider } from "@/hooks/useSession";
import { requireSession } from "@/lib/session";

export default async function MobileLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <SessionProvider session={session}>
      <MobileShell items={mobileNav(session)}>{children}</MobileShell>
    </SessionProvider>
  );
}
