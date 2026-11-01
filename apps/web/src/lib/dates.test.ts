import { describe, expect, it } from "vitest";
import { addDays, daysBetween, formatDelay, startOfWeek, weekDays } from "./dates";

describe("dates", () => {
  it("trouve le lundi de la semaine", () => {
    expect(startOfWeek("2026-10-07")).toBe("2026-10-05"); // mercredi
    expect(startOfWeek("2026-10-11")).toBe("2026-10-05"); // dimanche
    expect(startOfWeek("2026-10-05")).toBe("2026-10-05"); // lundi
  });

  it("donne 7 jours à partir du lundi", () => {
    const days = weekDays("2026-10-05");
    expect(days).toHaveLength(7);
    expect(days[6]).toBe("2026-10-11");
  });

  it("ajoute des jours en passant le changement de mois", () => {
    expect(addDays("2026-10-30", 3)).toBe("2026-11-02");
  });

  it("compte les jours entre deux dates", () => {
    expect(daysBetween("2026-10-05", "2026-10-17")).toBe(12);
    expect(daysBetween("2026-10-17", "2026-10-05")).toBe(-12);
  });

  it("écrit un délai en mots simples", () => {
    expect(formatDelay(-2)).toBe("en retard de 2 j");
    expect(formatDelay(0)).toBe("aujourd'hui");
    expect(formatDelay(1)).toBe("demain");
    expect(formatDelay(12)).toBe("dans 12 jours");
    expect(formatDelay(21)).toBe("dans 3 semaines");
  });
});
