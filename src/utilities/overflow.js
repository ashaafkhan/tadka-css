import { parseNumberish, resolveScaleValue } from "../helpers.js";

export function resolveOverflow(token, config) {
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
