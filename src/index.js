import { createConfig, deepMerge, defaultConfig } from "./config.js";
import { createEngine } from "./engine.js";
import { createEventBus } from "./events.js";
import { watchDOM } from "./observer.js";
import { createParser } from "./parser.js";

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

export default TadkaCSS;
