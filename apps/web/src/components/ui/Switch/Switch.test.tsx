import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("annonce son état", () => {
    render(<Switch checked label="Stock" onChange={() => {}} />);
    expect(screen.getByRole("switch", { name: "Stock" })).toHaveAttribute("aria-checked", "true");
  });

  it("renvoie la nouvelle valeur au clic", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} label="Stock" onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
