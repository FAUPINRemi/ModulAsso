import type { BottomNavItem } from "@/components/layout/BottomNav";
import type { TopBarItem } from "@/components/layout/TopBar";
import { MODULES } from "./modules";
import type { Session } from "./types";

/** Navigation bureau. Un module désactivé disparaît d'ici. */
export function desktopNav(session: Session): TopBarItem[] {
  const pages = MODULES.filter((m) => session.modules.includes(m.code)).flatMap((m) => m.pages);
  const items: TopBarItem[] = [{ href: "/tableau-de-bord", label: "Tableau de bord" }, ...pages];
  if (session.role === "dirigeant") {
    items.splice(1, 0, { href: "/benevoles", label: "Bénévoles" });
    items.push({ href: "/modules", label: "Modules" });
  }
  return items;
}

/** Navigation mobile : toujours 5 zones, pas plus. */
export function mobileNav(session: Session): BottomNavItem[] {
  const items: BottomNavItem[] = [{ href: "/m", label: "Accueil", icon: "home" }];
  if (session.modules.includes("planning")) {
    items.push(
      { href: "/m/agenda", label: "Agenda", icon: "calendar" },
      { href: "/m/dispos", label: "Dispos", icon: "dispos" },
      { href: "/m/taches", label: "Tâches", icon: "taches" },
    );
  }
  items.push({ href: "/m/plus", label: "Plus", icon: "plus" });
  return items;
}
