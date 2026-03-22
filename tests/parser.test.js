import { describe, expect, it } from "vitest";
import { createConfig } from "../src/config.js";
import { createParser } from "../src/parser.js";

describe("parser", () => {
  it("parses spacing utility", () => {
    const parser = createParser(createConfig());
    const result = parser("tadka-p-4");
    expect(result.type).toBe("style");
    expect(result.styles.padding).toBe("1rem");
  });

  it("parses pseudo class utility", () => {
    const parser = createParser(createConfig());
    const result = parser("tadka-hover:bg-orange-500");
    expect(result.type).toBe("pseudo");
    expect(result.pseudo).toBe("hover");
    expect(result.styles.backgroundColor).toBeTruthy();
  });

  it("parses responsive utility", () => {
    const parser = createParser(createConfig());
    const result = parser("tadka-lg:w-1/2");
    expect(result.type).toBe("responsive");
    expect(result.breakpoint).toBe("lg");
    expect(result.styles.width).toBe("50%");
  });
});
