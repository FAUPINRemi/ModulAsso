"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import type { Vue } from "@/lib/device";
import { DESKTOP_HOME, MOBILE_HOME } from "@/lib/device";
import { buildDemoSession, clearSession, getSession, homePath, saveSession, saveVue } from "@/lib/session";
import { isModuleCode } from "./modules";
import type { Role } from "./types";

// Ces actions sont des branchements de DÉMO. À l'étape "connexion", elles
// appelleront l'API (packages/api-client) au lieu de fabriquer une session.

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Valeurs à remettre dans le formulaire après une erreur (jamais le mot de passe). */
  values?: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

function checkEmailAndPassword(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!EMAIL.test(text(data, "email"))) errors.email = "Entre une adresse e-mail valide.";
  if (text(data, "password").length < 8) errors.password = "Le mot de passe doit avoir au moins 8 caractères.";
  return errors;
}

const failed = (data: FormData, fieldErrors: Record<string, string>): FormState => ({
  fieldErrors,
  values: { email: text(data, "email"), prenom: text(data, "prenom"), structure: text(data, "structure") },
});

const demoOnly: FormState = { error: "La connexion réelle arrive avec l'API. Utilise le mode démo pour l'instant." };

export async function connecter(_prev: FormState, data: FormData): Promise<FormState> {
  const fieldErrors = checkEmailAndPassword(data);
  if (Object.keys(fieldErrors).length > 0) return failed(data, fieldErrors);
  if (!config.demoMode) return demoOnly;
  await saveSession(buildDemoSession("dirigeant"));
  redirect(await homePath());
}

export async function inscrire(_prev: FormState, data: FormData): Promise<FormState> {
  const fieldErrors = checkEmailAndPassword(data);
  if (!text(data, "structure")) fieldErrors.structure = "Donne un nom à ton association.";
  if (!text(data, "prenom")) fieldErrors.prenom = "Dis-nous ton prénom.";
  if (Object.keys(fieldErrors).length > 0) return failed(data, fieldErrors);
  if (!config.demoMode) return demoOnly;
  const session = buildDemoSession("dirigeant");
  await saveSession({ ...session, nom: text(data, "prenom"), structure: text(data, "structure") });
  redirect(await homePath());
}

export async function accepterInvitation(_prev: FormState, data: FormData): Promise<FormState> {
  const fieldErrors = checkEmailAndPassword(data);
  if (!text(data, "prenom")) fieldErrors.prenom = "Dis-nous ton prénom.";
  if (Object.keys(fieldErrors).length > 0) return failed(data, fieldErrors);
  if (!config.demoMode) return demoOnly;
  const session = buildDemoSession("benevole");
  await saveSession({ ...session, nom: text(data, "prenom") });
  redirect(await homePath());
}

export async function entrerEnDemo(role: Role): Promise<void> {
  if (!config.demoMode) redirect("/connexion");
  await saveSession(buildDemoSession(role === "dirigeant" ? "dirigeant" : "benevole"));
  redirect(await homePath());
}

export async function deconnecter(): Promise<void> {
  await clearSession();
  redirect("/connexion");
}

export async function choisirVue(vue: Vue): Promise<void> {
  await saveVue(vue === "mobile" ? "mobile" : "bureau");
  redirect(vue === "mobile" ? MOBILE_HOME : DESKTOP_HOME);
}

export async function basculerModule(code: string, actif: boolean): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== "dirigeant" || !isModuleCode(code)) return;
  const others = session.modules.filter((m) => m !== code);
  await saveSession({ ...session, modules: actif ? [...others, code] : others });
  revalidatePath("/", "layout");
}
