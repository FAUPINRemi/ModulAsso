import { describe, expect, it } from "vitest";
import { isExpiringSoon, isLow } from "./alertes";
import type { Article } from "./types";

const base: Article = { id: "a", nom: "Lait", quantite: 10, unite: "u", seuil: 10, lieu: "Frigo" };

describe("alertes de stock", () => {
  it("signale un stock bas à partir du seuil", () => {
    expect(isLow({ ...base, quantite: 10 })).toBe(true);
    expect(isLow({ ...base, quantite: 11 })).toBe(false);
  });

  it("signale une date limite proche", () => {
    expect(isExpiringSoon({ ...base, dlc: "2026-10-19" }, "2026-10-05")).toBe(true);
    expect(isExpiringSoon({ ...base, dlc: "2026-10-30" }, "2026-10-05")).toBe(false);
    expect(isExpiringSoon(base, "2026-10-05")).toBe(false);
  });
});
