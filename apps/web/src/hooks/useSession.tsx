"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Session } from "@/features/socle/types";

const SessionContext = createContext<Session | null>(null);

/** Donne la session (lue côté serveur) aux composants client. */
export function SessionProvider({ session, children }: { session: Session; children: ReactNode }) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession doit être utilisé dans un SessionProvider");
  return session;
}
