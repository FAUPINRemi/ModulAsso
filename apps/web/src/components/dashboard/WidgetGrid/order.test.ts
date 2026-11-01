import { describe, expect, it } from "vitest";
import { moveItem, reconcileOrder } from "./order";

describe("moveItem", () => {
  it("déplace un élément", () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
    expect(moveItem(["a", "b", "c"], 2, 1)).toEqual(["a", "c", "b"]);
  });

  it("ne change rien si le déplacement est impossible", () => {
    const list = ["a", "b"];
    expect(moveItem(list, 0, 5)).toBe(list);
    expect(moveItem(list, -1, 0)).toBe(list);
  });
});

describe("reconcileOrder", () => {
  it("garde l'ordre enregistré", () => {
    expect(reconcileOrder(["c", "a", "b"], ["a", "b", "c"])).toEqual(["c", "a", "b"]);
  });

  it("retire les widgets disparus et ajoute les nouveaux", () => {
    expect(reconcileOrder(["x", "b"], ["a", "b", "c"])).toEqual(["b", "a", "c"]);
  });
});
