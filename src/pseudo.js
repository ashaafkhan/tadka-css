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

export function attachPseudoListener(el, parsed) {
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

export function clearPseudoListeners(root = document) {
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
