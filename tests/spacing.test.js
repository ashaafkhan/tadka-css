import { describe, expect, it } from "vitest";
import { createConfig } from "../src/config.js";
import { resolveSpacing } from "../src/utilities/spacing.js";

describe("spacing utilities", () => {
  it("resolves tadka-p-6", () => {
    const styles = resolveSpacing("p-6", createConfig());
    expect(styles.padding).toBe("1.5rem");
  });

  it("resolves arbitrary spacing", () => {
    const styles = resolveSpacing("mt-[13px]", createConfig());
    expect(styles.marginTop).toBe("13px");
  });

  it("resolves mx-auto", () => {
    const styles = resolveSpacing("mx-auto", createConfig());
    expect(styles.marginLeft).toBe("auto");
    expect(styles.marginRight).toBe("auto");
  });
});
