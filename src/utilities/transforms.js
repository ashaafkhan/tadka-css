import { isArbitrary, parseNumberish, readArbitrary, resolveScaleValue } from "../helpers.js";

const originMap = {
  "origin-center": "center",
  "origin-top": "top",
  "origin-bottom": "bottom",
  "origin-left": "left",
  "origin-right": "right",
  "origin-top-left": "top left",
  "origin-top-right": "top right",
  "origin-bottom-left": "bottom left",
  "origin-bottom-right": "bottom right",
};

export function resolveTransforms(token, config) {
  if (token.startsWith("scale-")) {
    const n = parseNumberish(token.slice(6));
    if (n !== null) return { transform: `scale(${n / 100})` };
  }

  if (token.startsWith("rotate-")) {
    const value = token.slice(7);
    const v = isArbitrary(value) ? readArbitrary(value) : `${value}deg`;
    return { transform: `rotate(${v})` };
  }

  if (token.startsWith("-rotate-")) {
    const value = token.slice(8);
    const v = isArbitrary(value) ? readArbitrary(value) : `${value}deg`;
    return { transform: `rotate(-${v.replace("-", "")})` };
  }

  if (token.startsWith("translate-x-")) {
    const raw = token.slice(12);
    const v = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (v) return { transform: `translateX(${v})` };
  }

  if (token.startsWith("translate-y-")) {
    const raw = token.slice(12);
    const v = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (v) return { transform: `translateY(${v})` };
  }

  if (token.startsWith("-translate-x-")) {
    const raw = token.slice(13);
    const v = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (v) return { transform: `translateX(-${v})` };
  }

  if (token.startsWith("-translate-y-")) {
    const raw = token.slice(13);
    const v = isArbitrary(raw) ? readArbitrary(raw) : resolveScaleValue(raw, config.spacingScale);
    if (v) return { transform: `translateY(-${v})` };
  }

  if (originMap[token]) return { transformOrigin: originMap[token] };

  if (token.startsWith("skew-x-")) {
    const value = token.slice(7);
    return { transform: `skewX(${value}deg)` };
  }

  if (token.startsWith("skew-y-")) {
    const value = token.slice(7);
    return { transform: `skewY(${value}deg)` };
  }

  if (token.startsWith("perspective-")) {
    const n = parseNumberish(token.slice(12));
    if (n !== null) return { perspective: `${n}px` };
  }

  return null;
}
