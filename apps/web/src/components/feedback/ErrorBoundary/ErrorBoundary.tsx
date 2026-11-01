"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Props = { children: ReactNode };
type State = { failed: boolean };

/** Évite qu'un widget qui plante fasse tomber toute la page. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Jamais de donnée personnelle dans les logs : on garde seulement le message technique.
    console.error("Erreur d'affichage :", error.message, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="flex flex-col items-start gap-3 text-sm">
        <p>Cette partie ne s'affiche pas pour l'instant.</p>
        <Button size="sm" variant="secondary" onClick={() => this.setState({ failed: false })}>
          Réessayer
        </Button>
      </div>
    );
  }
}
