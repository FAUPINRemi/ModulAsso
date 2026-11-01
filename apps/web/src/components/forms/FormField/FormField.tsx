import { useId, type ReactNode } from "react";

type FieldProps = { id: string; "aria-describedby"?: string; invalid: boolean };

type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: (field: FieldProps) => ReactNode;
};

/** Libellé + champ + aide + erreur, reliés pour les lecteurs d'écran. */
export function FormField({ label, hint, error, children }: FormFieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = error ?? hint;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children({ id, "aria-describedby": note ? noteId : undefined, invalid: Boolean(error) })}
      {note && (
        <p id={noteId} className={error ? "text-sm font-medium text-danger-strong" : "text-sm text-muted"}>
          {note}
        </p>
      )}
    </div>
  );
}
