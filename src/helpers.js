export function toKebab(str) {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function isArbitrary(value) {
  return /^\[.+\]$/.test(value);
}

export function readArbitrary(value) {
  if (!isArbitrary(value)) return null;
  return value.slice(1, -1).replace(/_/g, " ");
}

export function parseNumberish(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function resolveScaleValue(raw, scaleMap) {
  if (raw in scaleMap) return `${scaleMap[raw]}rem`;
  const num = parseNumberish(raw);
  if (num === null) return null;
  return `${num * 0.25}rem`;
}

export function normalizeClassName(className) {
  return className.trim().replace(/\s+/g, " ");
}
