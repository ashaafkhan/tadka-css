import { normalizeClassName } from "./helpers.js";
import { resolveAnimations } from "./utilities/animations.js";
import { resolveBorders } from "./utilities/borders.js";
import { resolveColors } from "./utilities/colors.js";
import { resolveEffects } from "./utilities/effects.js";
import { resolveLayout } from "./utilities/layout.js";
import { resolveOverflow } from "./utilities/overflow.js";
import { resolvePositioning } from "./utilities/positioning.js";
import { resolveSizing } from "./utilities/sizing.js";
import { resolveSpacing } from "./utilities/spacing.js";
import { resolveTransforms } from "./utilities/transforms.js";
import { resolveTransitions } from "./utilities/transitions.js";
import { resolveTypography } from "./utilities/typography.js";

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

export function createParser(config) {
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
