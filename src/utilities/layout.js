import { parseNumberish, resolveScaleValue } from "../helpers.js";

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

export function resolveLayout(token, config) {
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
