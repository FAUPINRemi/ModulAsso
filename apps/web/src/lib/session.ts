import "server-only";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ALL_MODULES, isModuleCode } from "@/features/socle/modules";
import type { ModuleCode, Role, Session } from "@/features/socle/types";
import { config } from "./config";
import { SESSION_COOKIE, VUE_COOKIE } from "./cookies";
import { DESKTOP_HOME, MOBILE_HOME, pickVue, type Vue } from "./device";

// SESSION DE DÉMO : le cookie contient directement le rôle et les modules.
// À remplacer par le jeton de l'API (cookie httpOnly) à l'étape "connexion".
// Le reste du code ne lit la session que par getSession().

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.isProd,
  path: "/",
  maxAge: 60 * 60 * 8,
} as const;

export function buildDemoSession(role: Role): Session {
  return role === "dirigeant"
    ? { role, nom: "Camille", structure: "Lien Félin", modules: ALL_MODULES }
    : { role, nom: "Léa", structure: "Lien Félin", modules: ALL_MODULES };
}

function parse(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    const { role, nom, structure, modules } = data as Record<string, unknown>;
    if (role !== "dirigeant" && role !== "benevole") return null;
    if (typeof nom !== "string" || typeof structure !== "string" || !Array.isArray(modules)) return null;
    return { role, nom, structure, modules: modules.filter(isModuleCode) };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return parse(store.get(SESSION_COOKIE)?.value);
}

export async function saveSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify(session), COOKIE_OPTIONS);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function saveVue(vue: Vue): Promise<void> {
  const store = await cookies();
  store.set(VUE_COOKIE, vue, { ...COOKIE_OPTIONS, httpOnly: false, maxAge: 60 * 60 * 24 * 365 });
}

/** Page qui demande une session. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/connexion");
  return session;
}

/** Page d'un module : si la structure l'a désactivé, la page n'existe pas pour elle. */
export async function requireModule(code: ModuleCode): Promise<Session> {
  const session = await requireSession();
  if (!session.modules.includes(code)) notFound();
  return session;
}

/** Page réservée aux dirigeants. */
export async function requireDirigeant(): Promise<Session> {
  const session = await requireSession();
  if (session.role !== "dirigeant") notFound();
  return session;
}

/** Page d'accueil de la bonne vue (bureau ou mobile) pour cette personne et cet appareil. */
export async function homePath(): Promise<string> {
  const [store, head] = await Promise.all([cookies(), headers()]);
  const vue = pickVue({
    cookie: store.get(VUE_COOKIE)?.value,
    chMobile: head.get("sec-ch-ua-mobile"),
    userAgent: head.get("user-agent"),
  });
  return vue === "mobile" ? MOBILE_HOME : DESKTOP_HOME;
}
