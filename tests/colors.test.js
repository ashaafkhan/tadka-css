import { describe, expect, it } from "vitest";
import { createConfig } from "../src/config.js";
import { resolveColors } from "../src/utilities/colors.js";

describe("color utilities", () => {
  it("resolves background color", () => {
    const styles = resolveColors("bg-orange-500", createConfig());
    expect(styles.backgroundColor).toMatch(/^#/);
  });

  it("resolves text white", () => {
    const styles = resolveColors("text-white", createConfig());
    expect(styles.color).toBe("#ffffff");
  });

  it("resolves arbitrary color", () => {
    const styles = resolveColors("bg-[#FF5733]", createConfig());
    expect(styles.backgroundColor).toBe("#FF5733");
  });
});
