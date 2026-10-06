import { afterEach, describe, expect, it, vi } from "vitest";
import DocumentLanguage from "@/components/DocumentLanguage";

vi.mock("react", () => ({ useEffect: (effect: () => void) => effect() }));
afterEach(() => vi.unstubAllGlobals());

describe("validated route document language", () => {
  it("sets Spanish for Spanish content", () => {
    const documentElement = { lang: "en" };
    vi.stubGlobal("document", { documentElement });
    expect(DocumentLanguage({ locale: "es" })).toBeNull();
    expect(documentElement.lang).toBe("es");
  });

  it("restores English on locale navigation", () => {
    const documentElement = { lang: "en" };
    vi.stubGlobal("document", { documentElement });
    DocumentLanguage({ locale: "es" });
    DocumentLanguage({ locale: "en" });
    expect(documentElement.lang).toBe("en");
  });
});
