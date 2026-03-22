import { describe, expect, it, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { createConfig } from "../src/config.js";
import { createEngine } from "../src/engine.js";
import { createEventBus } from "../src/events.js";
import { createParser } from "../src/parser.js";

describe("engine", () => {
  beforeEach(() => {
    const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>");
    global.document = dom.window.document;
    global.window = dom.window;
    global.MutationObserver = dom.window.MutationObserver;
    global.Node = dom.window.Node;
  });

  it("applies styles to matching elements", () => {
    document.body.innerHTML = '<div id="x" class="tadka-p-4 tadka-bg-blue-500"></div>';

    const config = createConfig({ watch: false });
    const parser = createParser(config);
    const bus = createEventBus();
    const engine = createEngine(config, parser, bus);

    const count = engine.scanAndApply(document);
    const el = document.getElementById("x");

    expect(count).toBe(1);
    expect(el.style.padding).toBe("1rem");
    expect(el.style.backgroundColor).toBeTruthy();
  });
});
