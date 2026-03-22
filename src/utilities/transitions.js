import { parseNumberish } from "../helpers.js";

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

export function resolveTransitions(token) {
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
