import { isArbitrary, readArbitrary, resolveScaleValue } from "../helpers.js";

const posMap = {
  static: "static",
  relative: "relative",
  absolute: "absolute",
  fixed: "fixed",
  sticky: "sticky",
};

const floatMap = {
  "float-left": "left",
  "float-right": "right",
  "float-none": "none",
};

export function resolvePositioning(token, config) {
  if (posMap[token]) return { position: posMap[token] };
  if (floatMap[token]) return { float: floatMap[token] };

  const sides = ["top", "right", "bottom", "left"];
  for (const side of sides) {
    if (!token.startsWith(`${side}-`)) continue;
    const raw = token.slice(side.length + 1);
    if (raw === "auto") return { [side]: "auto" };
    if (raw === "full") return { [side]: "100%" };
    const value = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (value) return { [side]: value };
  }

  if (token.startsWith("inset-")) {
    const raw = token.slice(6);
    const value = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (value) return { inset: value };
  }

  if (token.startsWith("inset-x-")) {
    const raw = token.slice(8);
    const value = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (value) return { left: value, right: value };
  }

  if (token.startsWith("inset-y-")) {
    const raw = token.slice(8);
    const value = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (value) return { top: value, bottom: value };
  }

  if (token === "isolate") return { isolation: "isolate" };
  if (token === "isolation-auto") return { isolation: "auto" };

  return null;
}
