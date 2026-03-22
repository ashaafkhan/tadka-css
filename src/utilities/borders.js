import { parseNumberish } from "../helpers.js";

const radiusMap = {
  none: "0px",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

export function resolveBorders(token) {
  if (token === "border") return { borderWidth: "1px", borderStyle: "solid" };
  if (token.startsWith("border-")) {
    const value = token.slice(7);
    const styleSet = new Set(["solid", "dashed", "dotted", "double", "hidden", "none"]);
    if (styleSet.has(value)) return { borderStyle: value };
    const n = parseNumberish(value);
    if (n !== null) return { borderWidth: `${n}px`, borderStyle: "solid" };
  }

  if (token === "rounded") return { borderRadius: radiusMap.DEFAULT };
  if (token.startsWith("rounded-")) {
    const key = token.slice(8);
    if (radiusMap[key]) return { borderRadius: radiusMap[key] };
  }

  if (token.startsWith("ring-")) {
    const size = parseNumberish(token.slice(5));
    if (size !== null) {
      return { boxShadow: `0 0 0 ${size}px var(--tadka-ring-color, rgba(59,130,246,0.5))` };
    }
  }

  if (token === "outline-none") {
    return { outline: "2px solid transparent", outlineOffset: "2px" };
  }

  return null;
}
