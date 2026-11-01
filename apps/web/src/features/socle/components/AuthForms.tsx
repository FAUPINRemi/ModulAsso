"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { FormField } from "@/components/forms/FormField";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { accepterInvitation, connecter, inscrire, type FormState } from "../actions";

type Action = (prev: FormState, data: FormData) => Promise<FormState>;

function Form({ action, submit, children }: { action: Action; submit: string; children: (s: FormState) => ReactNode }) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state.error && (
        <p role="alert" className="rounded-xl bg-warn-soft px-4 py-3 text-sm font-medium text-warn-strong">
          {state.error}
        </p>
      )}
      {children(state)}
      <Button type="submit" size="lg" full loading={pending}>
        {submit}
      </Button>
    </form>
  );
}

const err = (s: FormState, key: string) => s.fieldErrors?.[key];
const val = (s: FormState, key: string) => s.values?.[key] ?? "";

function EmailAndPassword({ s, newPassword }: { s: FormState; newPassword?: boolean }) {
  return (
    <>
      <FormField label="Adresse e-mail" error={err(s, "email")}>
        {(f) => <Input {...f} name="email" type="email" autoComplete="email" defaultValue={val(s, "email")} />}
      </FormField>
      <FormField label="Mot de passe" hint={newPassword ? "Au moins 8 caractères." : undefined} error={err(s, "password")}>
        {(f) => <PasswordInput {...f} name="password" autoComplete={newPassword ? "new-password" : "current-password"} />}
      </FormField>
    </>
  );
}

export function LoginForm() {
  return (
    <Form action={connecter} submit="Me connecter">
      {(s) => <EmailAndPassword s={s} />}
    </Form>
  );
}

export function SignupForm() {
  return (
    <Form action={inscrire} submit="Créer mon association">
      {(s) => (
        <>
          <FormField label="Nom de l'association" error={err(s, "structure")}>
            {(f) => <Input {...f} name="structure" autoComplete="organization" defaultValue={val(s, "structure")} />}
          </FormField>
          <FormField label="Ton prénom" error={err(s, "prenom")}>
            {(f) => <Input {...f} name="prenom" autoComplete="given-name" defaultValue={val(s, "prenom")} />}
          </FormField>
          <EmailAndPassword s={s} newPassword />
        </>
      )}
    </Form>
  );
}

export function InvitationForm() {
  return (
    <Form action={accepterInvitation} submit="Rejoindre l'association">
      {(s) => (
        <>
          <FormField label="Ton prénom" error={err(s, "prenom")}>
            {(f) => <Input {...f} name="prenom" autoComplete="given-name" defaultValue={val(s, "prenom")} />}
          </FormField>
          <EmailAndPassword s={s} newPassword />
        </>
      )}
    </Form>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-brand-700 underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}
