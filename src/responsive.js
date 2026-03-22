import { toKebab } from "./helpers.js";

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

export function injectMediaQuery(el, parsed, config) {
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

export function resetResponsiveStyles() {
  inserted.clear();
  idCounter = 0;
  if (!styleSheet) return;

  const owner = styleSheet.ownerNode;
  owner?.parentNode?.removeChild(owner);
  styleSheet = null;
}
