const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

const SCALE = {
  0: 0,
  0.5: 0.125,
  1: 0.25,
  1.5: 0.375,
  2: 0.5,
  2.5: 0.625,
  3: 0.75,
  3.5: 0.875,
  4: 1,
  5: 1.25,
  6: 1.5,
  7: 1.75,
  8: 2,
  9: 2.25,
  10: 2.5,
  11: 2.75,
  12: 3,
  14: 3.5,
  16: 4,
  20: 5,
  24: 6,
  28: 7,
  32: 8,
  36: 9,
  40: 10,
  44: 11,
  48: 12,
  52: 13,
  56: 14,
  60: 15,
  64: 16,
  72: 18,
  80: 20,
  96: 24,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

function createShades(hue, saturation = 70) {
  const levels = {
    50: 97,
    100: 93,
    200: 86,
    300: 76,
    400: 64,
    500: 54,
    600: 46,
    700: 39,
    800: 31,
    900: 24,
    950: 16,
  };

  return Object.fromEntries(
    Object.entries(levels).map(([key, lightness]) => [
      key,
      hslToHex(hue, clamp(saturation, 25, 90), lightness),
    ]),
  );
}

export function createDefaultPalette() {
  return {
    slate: createShades(220, 18),
    gray: createShades(220, 8),
    zinc: createShades(240, 8),
    neutral: createShades(30, 7),
    stone: createShades(28, 14),
    red: createShades(2, 80),
    orange: createShades(24, 85),
    amber: createShades(39, 90),
    yellow: createShades(52, 88),
    lime: createShades(79, 70),
    green: createShades(140, 62),
    emerald: createShades(160, 65),
    teal: createShades(176, 70),
    cyan: createShades(190, 78),
    sky: createShades(205, 85),
    blue: createShades(220, 88),
    indigo: createShades(240, 76),
    violet: createShades(262, 77),
    purple: createShades(276, 75),
    fuchsia: createShades(300, 76),
    pink: createShades(336, 84),
    rose: createShades(348, 84),
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
    inherit: "inherit",
    current: "currentColor",
  };
}

export const defaultConfig = {
  prefix: "tadka",
  scale: 4,
  removeClasses: false,
  watch: true,
  breakpoints: BREAKPOINTS,
  spacingScale: SCALE,
  colors: createDefaultPalette(),
  extend: {},
};

export function deepMerge(base, next) {
  const output = { ...base };
  for (const [key, value] of Object.entries(next || {})) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      output[key] = deepMerge(base[key], value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

export function createConfig(options = {}) {
  return deepMerge(defaultConfig, options);
}
