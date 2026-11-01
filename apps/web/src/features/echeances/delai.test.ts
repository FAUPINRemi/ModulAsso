import { describe, expect, it } from "vitest";
import { joursRestants, toneFor } from "./delai";

describe("délai", () => {
  it("compte les jours restants", () => {
    expect(joursRestants("2026-10-17", "2026-10-05")).toBe(12);
    expect(joursRestants("2026-10-01", "2026-10-05")).toBe(-4);
  });

  it("choisit la couleur selon l'urgence", () => {
    expect(toneFor(-3)).toBe("danger");
    expect(toneFor(7)).toBe("danger");
    expect(toneFor(12)).toBe("warn");
    expect(toneFor(45)).toBe("neutral");
  });
});
