type ClassValue = string | false | null | undefined;

/** Assemble des classes CSS en ignorant les valeurs vides. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
