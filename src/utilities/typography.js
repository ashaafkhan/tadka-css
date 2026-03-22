import { isArbitrary, readArbitrary, resolveScaleValue } from "../helpers.js";

const fontSizeMap = {
  xs: ["0.75rem", "1rem"],
  sm: ["0.875rem", "1.25rem"],
  base: ["1rem", "1.5rem"],
  lg: ["1.125rem", "1.75rem"],
  xl: ["1.25rem", "1.75rem"],
  "2xl": ["1.5rem", "2rem"],
  "3xl": ["1.875rem", "2.25rem"],
  "4xl": ["2.25rem", "2.5rem"],
  "5xl": ["3rem", "1"],
  "6xl": ["3.75rem", "1"],
  "7xl": ["4.5rem", "1"],
  "8xl": ["6rem", "1"],
  "9xl": ["8rem", "1"],
};

const textAlignMap = {
  left: "left",
  center: "center",
  right: "right",
  justify: "justify",
  start: "start",
  end: "end",
};

const weightMap = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

export function resolveTypography(token, config) {
  if (token.startsWith("text-")) {
    const key = token.slice(5);
    if (fontSizeMap[key]) {
      const [fontSize, lineHeight] = fontSizeMap[key];
      return { fontSize, lineHeight };
    }

    if (textAlignMap[key]) return { textAlign: textAlignMap[key] };

    if (isArbitrary(key)) {
      const value = readArbitrary(key);
      return { fontSize: value };
    }
  }

  if (token.startsWith("font-")) {
    const key = token.slice(5);
    if (weightMap[key]) return { fontWeight: String(weightMap[key]) };
    if (key === "sans") return { fontFamily: "ui-sans-serif, system-ui, sans-serif" };
    if (key === "serif") return { fontFamily: "ui-serif, Georgia, serif" };
    if (key === "mono") return { fontFamily: "ui-monospace, SFMono-Regular, monospace" };
  }

  if (token === "italic") return { fontStyle: "italic" };
  if (token === "not-italic") return { fontStyle: "normal" };
  if (token === "underline") return { textDecorationLine: "underline" };
  if (token === "line-through") return { textDecorationLine: "line-through" };
  if (token === "no-underline") return { textDecorationLine: "none" };
  if (token === "uppercase") return { textTransform: "uppercase" };
  if (token === "lowercase") return { textTransform: "lowercase" };
  if (token === "capitalize") return { textTransform: "capitalize" };
  if (token === "truncate") return { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

  if (token.startsWith("leading-")) {
    const key = token.slice(8);
    const map = {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    };
    if (map[key]) return { lineHeight: map[key] };
    const val = isArbitrary(key) ? readArbitrary(key) : resolveScaleValue(key, config.spacingScale);
    if (val) return { lineHeight: val };
  }

  return null;
}
