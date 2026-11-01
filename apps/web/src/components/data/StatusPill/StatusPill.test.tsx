import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusPill } from "./StatusPill";

describe("StatusPill", () => {
  it.each([
    ["dispo", "Dispo"],
    ["peut-etre", "Peut-être"],
    ["non", "Non"],
    ["absent", "Absent"],
  ] as const)("écrit le mot pour %s", (statut, mot) => {
    render(<StatusPill statut={statut} />);
    expect(screen.getByText(mot)).toBeInTheDocument();
  });
});
