import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./Button";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
};

/** Un lien qui a l'allure d'un bouton. */
export function ButtonLink({ variant = "primary", size = "md", full, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, full, className)} {...rest} />;
}
