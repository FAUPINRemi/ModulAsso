import { describe, expect, it } from "vitest";
import { isMobilePath, pickVue, toDesktopPath, toMobilePath } from "./device";

describe("pickVue", () => {
  it("respecte le choix manuel avant tout", () => {
    expect(pickVue({ cookie: "bureau", chMobile: "?1" })).toBe("bureau");
    expect(pickVue({ cookie: "mobile", chMobile: "?0" })).toBe("mobile");
  });

  it("lit l'indice du navigateur", () => {
    expect(pickVue({ chMobile: "?1" })).toBe("mobile");
    expect(pickVue({ chMobile: "?0", userAgent: "iPhone" })).toBe("bureau");
  });

  it("retombe sur le User-Agent", () => {
    expect(pickVue({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17)" })).toBe("mobile");
    expect(pickVue({ userAgent: "Mozilla/5.0 (X11; Linux x86_64)" })).toBe("bureau");
    expect(pickVue({})).toBe("bureau");
  });

  it("ignore un cookie inconnu", () => {
    expect(pickVue({ cookie: "autre" })).toBe("bureau");
  });
});

describe("chemins", () => {
  it("reconnaît les pages mobile", () => {
    expect(isMobilePath("/m")).toBe(true);
    expect(isMobilePath("/m/agenda")).toBe(true);
    expect(isMobilePath("/materiel")).toBe(false);
  });

  it("passe d'une vue à l'autre", () => {
    expect(toMobilePath("/echeances")).toBe("/m/echeances");
    expect(toMobilePath("/tableau-de-bord")).toBe("/m");
    expect(toDesktopPath("/m/echeances")).toBe("/echeances");
    expect(toDesktopPath("/m")).toBe("/tableau-de-bord");
    expect(toDesktopPath("/m/dispos")).toBe("/agenda");
    expect(toDesktopPath("/m/plus")).toBe("/tableau-de-bord");
  });
});
