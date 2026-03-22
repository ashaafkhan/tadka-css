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

function createDefaultPalette() {
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

const defaultConfig = {
  prefix: "tadka",
  scale: 4,
  removeClasses: false,
  watch: true,
  breakpoints: BREAKPOINTS,
  spacingScale: SCALE,
  colors: createDefaultPalette(),
  extend: {},
};

function deepMerge(base, next) {
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

function createConfig(options = {}) {
  return deepMerge(defaultConfig, options);
}

const pseudoState = new WeakMap();

function getHandlers(el) {
  if (!pseudoState.has(el)) pseudoState.set(el, new Map());
  return pseudoState.get(el);
}

function setStyles(el, styles, apply) {
  for (const [key, value] of Object.entries(styles)) {
    if (apply) {
      el.style[key] = value;
    } else {
      el.style[key] = "";
    }
  }
}

function attachPseudoListener(el, parsed) {
  const map = getHandlers(el);
  const key = `${parsed.pseudo}:${parsed.token}`;
  if (map.has(key)) return;

  let on;
  let off;

  if (parsed.pseudo === "hover") {
    on = () => setStyles(el, parsed.styles, true);
    off = () => setStyles(el, parsed.styles, false);
    el.addEventListener("mouseenter", on);
    el.addEventListener("mouseleave", off);
  } else if (parsed.pseudo === "focus") {
    on = () => setStyles(el, parsed.styles, true);
    off = () => setStyles(el, parsed.styles, false);
    el.addEventListener("focus", on);
    el.addEventListener("blur", off);
  } else if (parsed.pseudo === "active") {
    on = () => setStyles(el, parsed.styles, true);
    off = () => setStyles(el, parsed.styles, false);
    el.addEventListener("mousedown", on);
    el.addEventListener("mouseup", off);
    el.addEventListener("mouseleave", off);
  } else if (parsed.pseudo === "disabled") {
    if (el.hasAttribute("disabled")) setStyles(el, parsed.styles, true);
  } else if (parsed.pseudo === "checked") {
    const sync = () => setStyles(el, parsed.styles, Boolean(el.checked));
    sync();
    el.addEventListener("change", sync);
    on = sync;
    off = null;
  }

  map.set(key, { on, off, pseudo: parsed.pseudo });
}

function clearPseudoListeners(root = document) {
  const nodes = root.querySelectorAll("*");
  nodes.forEach((el) => {
    const map = pseudoState.get(el);
    if (!map) return;

    for (const entry of map.values()) {
      if (entry.pseudo === "hover") {
        el.removeEventListener("mouseenter", entry.on);
        el.removeEventListener("mouseleave", entry.off);
      } else if (entry.pseudo === "focus") {
        el.removeEventListener("focus", entry.on);
        el.removeEventListener("blur", entry.off);
      } else if (entry.pseudo === "active") {
        el.removeEventListener("mousedown", entry.on);
        el.removeEventListener("mouseup", entry.off);
        el.removeEventListener("mouseleave", entry.off);
      }
    }

    map.clear();
  });
}

function toKebab(str) {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function isArbitrary(value) {
  return /^\[.+\]$/.test(value);
}

function readArbitrary(value) {
  if (!isArbitrary(value)) return null;
  return value.slice(1, -1).replace(/_/g, " ");
}

function parseNumberish(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function resolveScaleValue(raw, scaleMap) {
  if (raw in scaleMap) return `${scaleMap[raw]}rem`;
  const num = parseNumberish(raw);
  if (num === null) return null;
  return `${num * 0.25}rem`;
}

function normalizeClassName(className) {
  return className.trim().replace(/\s+/g, " ");
}

let styleSheet = null;
let idCounter = 0;
const inserted = new Set();

function ensureSheet() {
  if (styleSheet) return styleSheet;
  const style = document.createElement("style");
  style.id = "tadka-responsive";
  document.head.appendChild(style);
  styleSheet = style.sheet;
  return styleSheet;
}

function toStyleBlock(styles) {
  return Object.entries(styles)
    .map(([property, value]) => `${toKebab(property)}: ${value}`)
    .join("; ");
}

function injectMediaQuery(el, parsed, config) {
  const sheet = ensureSheet();

  if (!el.dataset.tadkaId) {
    idCounter += 1;
    el.dataset.tadkaId = `tadka-${idCounter}`;
  }

  const selector = `[data-tadka-id='${el.dataset.tadkaId}']`;
  const declarations = toStyleBlock(parsed.styles);
  const minWidth = config.breakpoints[parsed.breakpoint];
  const rule = `@media (min-width: ${minWidth}) { ${selector} { ${declarations} } }`;

  if (inserted.has(rule)) return;
  inserted.add(rule);
  sheet.insertRule(rule, sheet.cssRules.length);
}

function resetResponsiveStyles() {
  inserted.clear();
  idCounter = 0;
  if (!styleSheet) return;

  const owner = styleSheet.ownerNode;
  owner?.parentNode?.removeChild(owner);
  styleSheet = null;
}

const originalStyleMap = new WeakMap();

function rememberOriginalStyle(el) {
  if (!originalStyleMap.has(el)) {
    originalStyleMap.set(el, el.getAttribute("style") || "");
  }
}

function applyInlineStyles(el, styles) {
  rememberOriginalStyle(el);
  for (const [key, value] of Object.entries(styles)) {
    el.style[key] = value;
  }
}

function createEngine(config, parseClass, eventBus) {
  const prefix = config.prefix;

  function processElement(el) {
    if (!el?.classList) return false;

    const classes = [...el.classList].filter((cls) => cls === prefix || cls.startsWith(`${prefix}-`));
    if (classes.length === 0) return false;

    for (const cls of classes) {
      const parsed = parseClass(cls);

      if (parsed.type === "style") {
        applyInlineStyles(el, parsed.styles);
      } else if (parsed.type === "responsive") {
        injectMediaQuery(el, parsed, config);
      } else if (parsed.type === "pseudo") {
        attachPseudoListener(el, parsed);
      } else if (parsed.type === "unknown") {
        eventBus.emit("parse-error", { className: cls });
      }

      eventBus.emit("apply", { element: el, className: cls, styles: parsed.styles || null });
      if (config.removeClasses) el.classList.remove(cls);
    }

    return true;
  }

  function scanAndApply(root = document) {
    const selector = `[class*='${prefix}-']`;
    const candidates = root.matches?.(selector) ? [root, ...root.querySelectorAll(selector)] : [...root.querySelectorAll(selector)];
    let count = 0;

    candidates.forEach((el) => {
      if (processElement(el)) count += 1;
    });

    return count;
  }

  function reset(root = document) {
    const nodes = root.querySelectorAll("*");
    nodes.forEach((el) => {
      if (!originalStyleMap.has(el)) return;
      const original = originalStyleMap.get(el);
      if (original) {
        el.setAttribute("style", original);
      } else {
        el.removeAttribute("style");
      }
      originalStyleMap.delete(el);
    });

    clearPseudoListeners(root);
    resetResponsiveStyles();
  }

  return {
    scanAndApply,
    apply: processElement,
    reset,
  };
}

function createEventBus() {
  const handlers = new Map();

  return {
    on(event, handler) {
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event).add(handler);
      return () => handlers.get(event)?.delete(handler);
    },
    emit(event, payload) {
      const set = handlers.get(event);
      if (!set) return;
      for (const handler of set) {
        try {
          handler(payload);
        } catch {
          // Event listeners should never crash the engine.
        }
      }
    },
    clear() {
      handlers.clear();
    },
  };
}

function watchDOM(scanAndApply) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.target?.nodeType === Node.ELEMENT_NODE) {
        scanAndApply(mutation.target);
      }

      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        scanAndApply(node);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  return observer;
}

const animationMap = {
  "animate-none": "none",
  "animate-spin": "tadka-spin 1s linear infinite",
  "animate-ping": "tadka-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  "animate-pulse": "tadka-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  "animate-bounce": "tadka-bounce 1s infinite",
};

let injected = false;

function ensureAnimationKeyframes() {
  if (injected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.id = "tadka-keyframes";
  style.textContent = `
@keyframes tadka-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes tadka-ping { 75%, 100% { transform: scale(2); opacity: 0; } }
@keyframes tadka-pulse { 50% { opacity: .5; } }
@keyframes tadka-bounce {
  0%,100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,.2,1); }
}`;
  document.head.appendChild(style);
  injected = true;
}

function resolveAnimations(token) {
  if (!animationMap[token]) return null;
  ensureAnimationKeyframes();
  return { animation: animationMap[token] };
}

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

function resolveBorders(token) {
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

function resolveColors(token, config) {
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

const shadowMap = {
  "shadow-none": "none",
  "shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  "shadow-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  "shadow-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  "shadow-xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "shadow-2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  "shadow-inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
};

const blurMap = {
  "blur-none": "blur(0)",
  "blur-sm": "blur(4px)",
  blur: "blur(8px)",
  "blur-md": "blur(12px)",
  "blur-lg": "blur(16px)",
  "blur-xl": "blur(24px)",
  "blur-2xl": "blur(40px)",
  "blur-3xl": "blur(64px)",
};

function resolveEffects(token) {
  if (token === "bg-gradient-to-r") {
    return {
      backgroundImage: "linear-gradient(to right, var(--tadka-gradient-from), var(--tadka-gradient-to))",
    };
  }

  if (token.startsWith("opacity-")) {
    const n = parseNumberish(token.slice(8));
    if (n === null) return null;
    return { opacity: `${Math.max(0, Math.min(100, n)) / 100}` };
  }

  if (shadowMap[token]) return { boxShadow: shadowMap[token] };
  if (blurMap[token]) return { filter: blurMap[token] };

  if (token.startsWith("brightness-")) {
    const n = parseNumberish(token.slice(11));
    if (n === null) return null;
    return { filter: `brightness(${n / 100})` };
  }

  if (token.startsWith("contrast-")) {
    const n = parseNumberish(token.slice(9));
    if (n === null) return null;
    return { filter: `contrast(${n / 100})` };
  }

  if (token === "grayscale") return { filter: "grayscale(100%)" };
  if (token === "grayscale-0") return { filter: "grayscale(0%)" };

  return null;
}

const displayMap = {
  block: "block",
  "inline-block": "inline-block",
  inline: "inline",
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
  hidden: "none",
  contents: "contents",
};

function resolveLayout(token, config) {
  if (displayMap[token]) return { display: displayMap[token] };

  const flexDirection = {
    "flex-row": "row",
    "flex-col": "column",
    "flex-row-reverse": "row-reverse",
    "flex-col-reverse": "column-reverse",
  };
  if (flexDirection[token]) return { display: "flex", flexDirection: flexDirection[token] };

  const justifyMap = {
    "justify-start": "flex-start",
    "justify-end": "flex-end",
    "justify-center": "center",
    "justify-between": "space-between",
    "justify-around": "space-around",
    "justify-evenly": "space-evenly",
  };
  if (justifyMap[token]) return { justifyContent: justifyMap[token] };

  const itemsMap = {
    "items-start": "flex-start",
    "items-end": "flex-end",
    "items-center": "center",
    "items-baseline": "baseline",
    "items-stretch": "stretch",
  };
  if (itemsMap[token]) return { alignItems: itemsMap[token] };

  if (token.startsWith("grid-cols-")) {
    const v = token.replace("grid-cols-", "");
    const n = parseNumberish(v);
    if (n !== null) return { display: "grid", gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` };
  }

  if (token.startsWith("grid-rows-")) {
    const v = token.replace("grid-rows-", "");
    const n = parseNumberish(v);
    if (n !== null) return { display: "grid", gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` };
  }

  if (token.startsWith("basis-")) {
    const value = token.replace("basis-", "");
    if (value === "full") return { flexBasis: "100%" };
    if (value === "auto") return { flexBasis: "auto" };
    const scaled = resolveScaleValue(value, config.spacingScale);
    if (scaled) return { flexBasis: scaled };
  }

  if (token === "flex-1") return { flex: "1 1 0%" };
  if (token === "flex-auto") return { flex: "1 1 auto" };
  if (token === "flex-none") return { flex: "none" };
  if (token === "flex-wrap") return { flexWrap: "wrap" };
  if (token === "flex-nowrap") return { flexWrap: "nowrap" };

  return null;
}

function resolveOverflow(token, config) {
  const direct = {
    "overflow-auto": { overflow: "auto" },
    "overflow-hidden": { overflow: "hidden" },
    "overflow-visible": { overflow: "visible" },
    "overflow-scroll": { overflow: "scroll" },
    "overflow-clip": { overflow: "clip" },
    "overflow-x-auto": { overflowX: "auto" },
    "overflow-x-hidden": { overflowX: "hidden" },
    "overflow-x-scroll": { overflowX: "scroll" },
    "overflow-y-auto": { overflowY: "auto" },
    "overflow-y-hidden": { overflowY: "hidden" },
    "overflow-y-scroll": { overflowY: "scroll" },
    "scroll-smooth": { scrollBehavior: "smooth" },
    "scroll-auto": { scrollBehavior: "auto" },
    "cursor-pointer": { cursor: "pointer" },
    "cursor-default": { cursor: "default" },
    "cursor-text": { cursor: "text" },
    "cursor-not-allowed": { cursor: "not-allowed" },
    "select-none": { userSelect: "none" },
    "select-text": { userSelect: "text" },
    "pointer-events-none": { pointerEvents: "none" },
    "pointer-events-auto": { pointerEvents: "auto" },
    resize: { resize: "both" },
    "resize-x": { resize: "horizontal" },
    "resize-y": { resize: "vertical" },
    "resize-none": { resize: "none" },
  };

  if (direct[token]) return direct[token];

  if (token.startsWith("scroll-p-")) {
    const raw = token.slice(9);
    const val = resolveScaleValue(raw, config.spacingScale);
    if (val) return { scrollPadding: val };
  }

  if (token.startsWith("scroll-m-")) {
    const raw = token.slice(9);
    const val = resolveScaleValue(raw, config.spacingScale);
    if (val) return { scrollMargin: val };
  }

  if (token.startsWith("z-")) {
    const n = parseNumberish(token.slice(2));
    if (n !== null) return { zIndex: `${n}` };
  }
  if (token === "z-auto") return { zIndex: "auto" };

  return null;
}

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

function resolvePositioning(token, config) {
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

function resolveSizing(token, config) {
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

const directMap = {
  p: ["padding"],
  px: ["paddingLeft", "paddingRight"],
  py: ["paddingTop", "paddingBottom"],
  pt: ["paddingTop"],
  pr: ["paddingRight"],
  pb: ["paddingBottom"],
  pl: ["paddingLeft"],
  m: ["margin"],
  mx: ["marginLeft", "marginRight"],
  my: ["marginTop", "marginBottom"],
  mt: ["marginTop"],
  mr: ["marginRight"],
  mb: ["marginBottom"],
  ml: ["marginLeft"],
  gap: ["gap"],
  "gap-x": ["columnGap"],
  "gap-y": ["rowGap"],
};

function setAll(keys, value) {
  return Object.fromEntries(keys.map((key) => [key, value]));
}

function resolveSpacing(token, config) {
  if (token === "mx-auto") return { marginLeft: "auto", marginRight: "auto" };

  const parts = token.split("-");
  const candidates = [parts[0], parts.slice(0, 2).join("-")];

  for (const key of candidates) {
    const cssKeys = directMap[key];
    if (!cssKeys) continue;

    const raw = token.slice(key.length + 1);
    const value = isArbitrary(raw)
      ? readArbitrary(raw)
      : resolveScaleValue(raw, config.spacingScale);

    if (!value) return null;
    return setAll(cssKeys, value);
  }

  return null;
}

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

function resolveTransforms(token, config) {
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

const transitionMap = {
  transition:
    "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter 150ms ease",
  "transition-none": "none",
  "transition-all": "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  "transition-colors":
    "color, background-color, border-color, text-decoration-color, fill, stroke 150ms ease",
  "transition-opacity": "opacity 150ms ease",
  "transition-shadow": "box-shadow 150ms ease",
  "transition-transform": "transform 150ms ease",
};

const easeMap = {
  "ease-linear": "linear",
  "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
};

function resolveTransitions(token) {
  if (transitionMap[token]) return { transition: transitionMap[token] };
  if (easeMap[token]) return { transitionTimingFunction: easeMap[token] };

  if (token.startsWith("duration-")) {
    const n = parseNumberish(token.slice(9));
    if (n !== null) return { transitionDuration: `${n}ms` };
  }

  if (token.startsWith("delay-")) {
    const n = parseNumberish(token.slice(6));
    if (n !== null) return { transitionDelay: `${n}ms` };
  }

  return null;
}

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

function resolveTypography(token, config) {
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

const pseudoVariants = new Set([
  "hover",
  "focus",
  "active",
  "group-hover",
  "group-focus",
  "peer-hover",
  "disabled",
  "checked",
  "visited",
]);

const resolvers = [
  resolveSpacing,
  resolveColors,
  resolveTypography,
  resolveBorders,
  resolveLayout,
  resolvePositioning,
  resolveSizing,
  resolveEffects,
  resolveOverflow,
  resolveTransitions,
  resolveTransforms,
  resolveAnimations,
];

function resolveWithBuiltins(token, config) {
  for (const fn of resolvers) {
    const styles = fn(token, config);
    if (styles) return styles;
  }
  return null;
}

function resolveExtended(token, config) {
  const ext = config.extend || {};
  if (ext[token] && typeof ext[token] === "object") return ext[token];

  const dash = token.lastIndexOf("-");
  if (dash === -1) return null;

  const name = token.slice(0, dash);
  const rawValue = token.slice(dash + 1);
  const rule = ext[name];
  if (typeof rule === "function") return rule(Number.isNaN(Number(rawValue)) ? rawValue : Number(rawValue));

  return null;
}

function createParser(config) {
  const cache = new Map();
  const prefixRoot = `${config.prefix}-`;

  return function parseClass(className) {
    const source = normalizeClassName(className);
    if (cache.has(source)) return cache.get(source);

    if (!(source === config.prefix || source.startsWith(prefixRoot))) {
      const result = { type: "ignore", className: source };
      cache.set(source, result);
      return result;
    }

    let body = source.slice(prefixRoot.length);
    const parts = body.split(":");
    const utilityToken = parts.pop();
    let breakpoint = null;
    let pseudo = null;

    for (const variant of parts) {
      if (config.breakpoints[variant]) {
        breakpoint = variant;
        continue;
      }
      if (pseudoVariants.has(variant)) {
        pseudo = variant;
      }
    }

    const extended = resolveExtended(utilityToken, config);
    const styles = extended || resolveWithBuiltins(utilityToken, config);

    if (!styles) {
      const unknown = { type: "unknown", className: source, token: utilityToken };
      cache.set(source, unknown);
      return unknown;
    }

    const result = {
      type: pseudo ? "pseudo" : breakpoint ? "responsive" : "style",
      className: source,
      token: utilityToken,
      pseudo,
      breakpoint,
      styles,
    };

    cache.set(source, result);
    return result;
  };
}

let config = createConfig();
let parser = createParser(config);
let bus = createEventBus();
let engine = createEngine(config, parser, bus);
let observer = null;

function rebuild(options = {}) {
  config = deepMerge(defaultConfig, config);
  config = deepMerge(config, options);
  parser = createParser(config);
  engine = createEngine(config, parser, bus);
}

const TadkaCSS = {
  version: "1.0.0",

  init(options = {}) {
    rebuild(options);
    const count = engine.scanAndApply(document);

    if (observer) observer.disconnect();
    if (config.watch && typeof MutationObserver !== "undefined") {
      observer = watchDOM((root) => engine.scanAndApply(root));
    }

    bus.emit("ready", { count });
    return count;
  },

  refresh() {
    const count = engine.scanAndApply(document);
    bus.emit("refresh", { count });
    return count;
  },

  apply(element) {
    return engine.apply(element);
  },

  applyAll(nodeList) {
    return Array.from(nodeList || []).map((el) => engine.apply(el));
  },

  parse(className) {
    const parsed = parser(className);
    return parsed.styles || null;
  },

  register(name, styles) {
    config.extend[name] = styles;
    parser = createParser(config);
  },

  unregister(name) {
    delete config.extend[name];
    parser = createParser(config);
  },

  getConfig() {
    return config;
  },

  setConfig(options) {
    rebuild(options);
    return config;
  },

  reset() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    engine.reset(document);
  },

  on(event, handler) {
    return bus.on(event, handler);
  },
};

if (typeof window !== "undefined") {
  window.TadkaCSS = TadkaCSS;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => TadkaCSS.init());
  } else {
    TadkaCSS.init();
  }
}

export { TadkaCSS as default };
//# sourceMappingURL=tadka-css.esm.js.map
