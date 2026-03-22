type TadkaStyleObject = Record<string, string | number>;
type TadkaDynamicStyle = (value: string | number) => TadkaStyleObject;

interface TadkaBreakpoints {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
  [key: string]: string | undefined;
}

interface TadkaInitOptions {
  prefix?: string;
  scale?: number;
  removeClasses?: boolean;
  watch?: boolean;
  breakpoints?: TadkaBreakpoints;
  colors?: Record<string, string | Record<string, string>>;
  extend?: Record<string, TadkaStyleObject | TadkaDynamicStyle>;
}

interface TadkaParseResult {
  [property: string]: string | number;
}

interface TadkaCSSApi {
  version: string;
  init(options?: TadkaInitOptions): number;
  refresh(): number;
  apply(element: Element): boolean;
  applyAll(nodeList: ArrayLike<Element>): boolean[];
  parse(className: string): TadkaParseResult | null;
  register(name: string, styles: TadkaStyleObject | TadkaDynamicStyle): void;
  unregister(name: string): void;
  getConfig(): Record<string, unknown>;
  setConfig(options: TadkaInitOptions): Record<string, unknown>;
  reset(): void;
  on(event: "apply" | "parse-error" | "ready" | "refresh", handler: (payload: unknown) => void): () => void;
}

declare const TadkaCSS: TadkaCSSApi;

export { TadkaCSS as default };
export type { TadkaBreakpoints, TadkaCSSApi, TadkaDynamicStyle, TadkaInitOptions, TadkaParseResult, TadkaStyleObject };
