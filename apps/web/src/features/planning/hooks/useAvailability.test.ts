import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { countDispo, nextStatut, useAvailability } from "./useAvailability";

describe("nextStatut", () => {
  it("fait tourner les statuts", () => {
    expect(nextStatut("dispo")).toBe("peut-etre");
    expect(nextStatut("peut-etre")).toBe("non");
    expect(nextStatut("non")).toBe("dispo");
    expect(nextStatut(undefined)).toBe("dispo");
    expect(nextStatut("absent")).toBe("dispo");
  });
});

describe("countDispo", () => {
  it("compte les jours dispo", () => {
    expect(countDispo({ a: "dispo", b: "non", c: "dispo" })).toBe(2);
    expect(countDispo(undefined)).toBe(0);
  });
});

describe("useAvailability", () => {
  it("change un statut sans toucher aux autres", () => {
    const { result } = renderHook(() => useAvailability({ m1: { j1: "dispo", j2: "non" } }));
    act(() => result.current.cycle("m1", "j1"));
    expect(result.current.dispos.m1).toEqual({ j1: "peut-etre", j2: "non" });
  });

  it("crée la ligne d'une personne qui n'existait pas", () => {
    const { result } = renderHook(() => useAvailability({}));
    act(() => result.current.set("m9", "j1", "dispo"));
    expect(result.current.dispos.m9).toEqual({ j1: "dispo" });
  });
});
