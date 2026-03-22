import { isArbitrary, readArbitrary, resolveScaleValue } from "../helpers.js";

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

export function resolveSpacing(token, config) {
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
