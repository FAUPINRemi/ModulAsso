export type Vue = "bureau" | "mobile";

export const MOBILE_HOME = "/m";
export const DESKTOP_HOME = "/tableau-de-bord";

const MOBILE_UA = /Android|iPhone|iPad|iPod|Mobile/i;

/**
 * Choisit la vue : le choix manuel (cookie) passe avant la détection.
 * La détection lit l'indice "Sec-CH-UA-Mobile" puis le User-Agent.
 */
export function pickVue(input: { cookie?: string; chMobile?: string | null; userAgent?: string | null }): Vue {
  if (input.cookie === "bureau" || input.cookie === "mobile") return input.cookie;
  if (input.chMobile === "?1") return "mobile";
  if (input.chMobile === "?0") return "bureau";
  return MOBILE_UA.test(input.userAgent ?? "") ? "mobile" : "bureau";
}

export const isMobilePath = (pathname: string): boolean => pathname === "/m" || pathname.startsWith("/m/");

/** Même page dans l'autre vue : /echeances <-> /m/echeances. */
export function toMobilePath(pathname: string): string {
  if (isMobilePath(pathname)) return pathname;
  if (pathname === "/" || pathname === DESKTOP_HOME) return MOBILE_HOME;
  return `/m${pathname}`;
}

// Pages qui n'existent que sur mobile : on renvoie vers la plus proche côté bureau.
const MOBILE_ONLY: Record<string, string> = {
  "/dispos": "/agenda",
  "/taches": "/agenda",
  "/plus": DESKTOP_HOME,
};

export function toDesktopPath(pathname: string): string {
  if (!isMobilePath(pathname)) return pathname;
  const rest = pathname.slice(2);
  if (rest === "" || rest === "/") return DESKTOP_HOME;
  return MOBILE_ONLY[rest] ?? rest;
}
