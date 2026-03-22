import { parseNumberish } from "../helpers.js";

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

export function resolveEffects(token) {
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
