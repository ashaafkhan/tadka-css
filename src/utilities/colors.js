import { isArbitrary, readArbitrary, parseNumberish } from "../helpers.js";

function resolvePaletteColor(colors, colorName, shade) {
  const entry = colors[colorName];
  if (!entry) return null;
  if (typeof entry === "string") return entry;
  if (!shade) return entry[500] || null;
  return entry[shade] || null;
}

function parseColorParts(input) {
  if (isArbitrary(input)) {
    return { value: readArbitrary(input) };
  }

  const [name, maybeShade] = input.split("-");
  return { name, shade: maybeShade };
}

const colorProps = {
  bg: "backgroundColor",
  text: "color",
  border: "borderColor",
  accent: "accentColor",
  caret: "caretColor",
  fill: "fill",
  stroke: "stroke",
};

export function resolveColors(token, config) {
  if (token.startsWith("from-")) {
    const payload = token.slice(5);
    const parsed = parseColorParts(payload);
    const color = parsed.value || resolvePaletteColor(config.colors, parsed.name, parsed.shade);
    if (!color) return null;
    return {
      "--tadka-gradient-from": color,
      "--tadka-gradient-to": "rgba(255,255,255,0)",
    };
  }

  if (token.startsWith("to-")) {
    const payload = token.slice(3);
    const parsed = parseColorParts(payload);
    const color = parsed.value || resolvePaletteColor(config.colors, parsed.name, parsed.shade);
    if (!color) return null;
    return { "--tadka-gradient-to": color };
  }

  for (const [prefix, property] of Object.entries(colorProps)) {
    if (!token.startsWith(`${prefix}-`)) continue;
    const colorRaw = token.slice(prefix.length + 1);
    const parsed = parseColorParts(colorRaw);

    if (parsed.value) return { [property]: parsed.value };

    const color = resolvePaletteColor(config.colors, parsed.name, parsed.shade);
    if (!color) return null;
    return { [property]: color };
  }

  if (token.startsWith("bg-opacity-")) {
    const value = parseNumberish(token.replace("bg-opacity-", ""));
    if (value === null) return null;
    return { "--tadka-bg-opacity": `${Math.max(0, Math.min(100, value)) / 100}` };
  }

  if (token.startsWith("text-opacity-")) {
    const value = parseNumberish(token.replace("text-opacity-", ""));
    if (value === null) return null;
    return { "--tadka-text-opacity": `${Math.max(0, Math.min(100, value)) / 100}` };
  }

  if (token.startsWith("ring-")) {
    const payload = token.slice(5);
    const parsed = parseColorParts(payload);
    if (parsed.value) return { "--tadka-ring-color": parsed.value };
    const color = resolvePaletteColor(config.colors, parsed.name, parsed.shade);
    if (!color) return null;
    return { "--tadka-ring-color": color };
  }

  return null;
}
