import { isArbitrary, readArbitrary, resolveScaleValue } from "../helpers.js";

const fractionMap = {
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "3/4": "75%",
  "1/5": "20%",
  "2/5": "40%",
  "3/5": "60%",
  "4/5": "80%",
  "1/6": "16.666667%",
  "5/6": "83.333333%",
};

function resolveLength(raw, config) {
  if (isArbitrary(raw)) return readArbitrary(raw);
  const named = {
    auto: "auto",
    full: "100%",
    screen: "100vw",
    svw: "100svw",
    lvw: "100lvw",
    dvw: "100dvw",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
  };
  if (named[raw]) return named[raw];
  if (fractionMap[raw]) return fractionMap[raw];
  return resolveScaleValue(raw, config.spacingScale);
}

export function resolveSizing(token, config) {
  if (token.startsWith("min-w-")) {
    const value = resolveLength(token.slice(6), config);
    if (!value) return null;
    return { minWidth: value };
  }

  if (token.startsWith("max-w-")) {
    const raw = token.slice(6);
    const named = {
      none: "none",
      full: "100%",
      screen: "100vw",
      prose: "65ch",
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      "5xl": "64rem",
      "6xl": "72rem",
      "7xl": "80rem",
    };
    if (named[raw]) return { maxWidth: named[raw] };
    const value = resolveLength(raw, config);
    if (!value) return null;
    return { maxWidth: value };
  }

  if (token.startsWith("min-h-")) {
    const raw = token.slice(6);
    const named = { full: "100%", screen: "100vh" };
    if (named[raw]) return { minHeight: named[raw] };
    const value = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (!value) return null;
    return { minHeight: value };
  }

  if (token.startsWith("max-h-")) {
    const raw = token.slice(6);
    const named = { none: "none", full: "100%", screen: "100vh" };
    if (named[raw]) return { maxHeight: named[raw] };
    const value = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (!value) return null;
    return { maxHeight: value };
  }

  if (token.startsWith("w-")) {
    const value = resolveLength(token.slice(2), config);
    if (!value) return null;
    return { width: value };
  }

  if (token.startsWith("h-")) {
    const raw = token.slice(2);
    const named = {
      auto: "auto",
      full: "100%",
      screen: "100vh",
      svh: "100svh",
      lvh: "100lvh",
      dvh: "100dvh",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    };
    if (named[raw]) return { height: named[raw] };
    const value = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (!value) return null;
    return { height: value };
  }

  if (token.startsWith("size-")) {
    const value = resolveLength(token.slice(5), config);
    if (!value) return null;
    return { width: value, height: value };
  }

  if (token === "aspect-square") return { aspectRatio: "1 / 1" };
  if (token === "aspect-video") return { aspectRatio: "16 / 9" };
  if (token === "aspect-auto") return { aspectRatio: "auto" };

  return null;
}
