import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("n'affiche rien quand elle est fermée", () => {
    render(
      <Modal open={false} onClose={() => {}} title="Inviter">
        Contenu
      </Modal>,
    );
    expect(screen.queryByText("Contenu")).not.toBeInTheDocument();
  });

  it("affiche son titre et son contenu quand elle est ouverte", () => {
    render(
      <Modal open onClose={() => {}} title="Inviter">
        Contenu
      </Modal>,
    );
    expect(screen.getByRole("dialog", { name: "Inviter" })).toBeInTheDocument();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("se ferme avec le bouton Fermer", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Inviter">
        Contenu
      </Modal>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(onClose).toHaveBeenCalled();
  });
});
