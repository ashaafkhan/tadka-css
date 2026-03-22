import { attachPseudoListener, clearPseudoListeners } from "./pseudo.js";
import { injectMediaQuery, resetResponsiveStyles } from "./responsive.js";

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

export function createEngine(config, parseClass, eventBus) {
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
