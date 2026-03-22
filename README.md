# tadka-css

A lightweight, runtime utility-first CSS engine for the browser.

- npm: https://www.npmjs.com/package/tadka-css
- GitHub repository: https://github.com/ashaafkhan/tadka-css
- Live Demo: https://tadkacss.vercel.app/
- Playground: https://tadkacss.vercel.app/playground/

TypeScript typings are included through `types/index.d.ts`.

## What Is Tadka CSS?

tadka-css lets you style HTML using utility class names like `tadka-p-4`, `tadka-bg-orange-500`, and `tadka-rounded-lg`.

At runtime, tadka-css scans the DOM, parses matching class names, and applies styles directly.

This project is browser-first, no build step required for basic use.

## Demo App Built With the npm Package

The demo application in this repository is built using the `tadka-css` npm package (via the published CDN bundle).

1. Demo app: https://tadkacss.vercel.app/
2. Playground: https://tadkacss.vercel.app/playground/
3. Demo source: https://github.com/ashaafkhan/tadka-css/blob/main/demo/index.html

## Installation

### npm

```bash
npm install tadka-css
```

### yarn / pnpm

```bash
yarn add tadka-css
pnpm add tadka-css
```

### CDN

```html
<script src="https://unpkg.com/tadka-css/dist/tadka-css.js"></script>
```

## Quick Start

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/tadka-css/dist/tadka-css.js"></script>
  </head>
  <body class="tadka-bg-slate-100 tadka-p-8">
    <div class="tadka-bg-orange-600 tadka-text-white tadka-p-6 tadka-rounded-lg tadka-shadow-lg">
      Hello from tadka-css
    </div>
  </body>
</html>
```

For npm/bundlers:

```js
import TadkaCSS from "tadka-css";
TadkaCSS.init();
```

## Class Name Anatomy

tadka-css parses class names using this grammar:

1. Base utility: `tadka-{utility}-{value}`
2. Responsive utility: `tadka-{breakpoint}:{utility}-{value}`
3. Pseudo utility: `tadka-{pseudo}:{utility}-{value}`

Examples:

```html
<div class="tadka-p-4 tadka-bg-orange-500 tadka-md:w-1/2 tadka-hover:scale-105"></div>
```

## Supported Attributes (From Codebase)

This list reflects currently implemented resolver support.

### 1) Spacing Attributes

- `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`
- `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`
- `mx-auto`
- `gap`, `gap-x`, `gap-y`
- Arbitrary values with `[]`

Examples:

```html
<div class="tadka-p-4 tadka-mx-auto tadka-gap-3 tadka-mt-[18px]"></div>
```

### 2) Color Attributes

- `bg-*`, `text-*`, `border-*`, `accent-*`, `caret-*`, `fill-*`, `stroke-*`
- Gradient helpers: `from-*`, `to-*`, plus `bg-gradient-to-r`
- Opacity vars: `bg-opacity-*`, `text-opacity-*`
- Ring color var: `ring-*` (color form)
- Arbitrary colors like `bg-[#FF5733]`

### 3) Typography Attributes

- Font sizes: `text-xs` to `text-9xl`, plus `text-[...]`
- Text align: `text-left`, `text-center`, `text-right`, `text-justify`, `text-start`, `text-end`
- Font weight: `font-thin` ... `font-black`
- Font family: `font-sans`, `font-serif`, `font-mono`
- Decorations and casing: `italic`, `not-italic`, `underline`, `line-through`, `no-underline`, `uppercase`, `lowercase`, `capitalize`
- Text overflow utility: `truncate`
- Line-height: `leading-*` including named values and scaled/arbitrary values

### 4) Border and Ring Attributes

- `border`, `border-{number}`
- Border style: `border-solid`, `border-dashed`, `border-dotted`, `border-double`, `border-hidden`, `border-none`
- Radius: `rounded`, `rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`
- Ring size: `ring-{number}`
- `outline-none`

### 5) Layout Attributes

- Display: `block`, `inline-block`, `inline`, `flex`, `inline-flex`, `grid`, `hidden`, `contents`
- Flex direction: `flex-row`, `flex-col`, `flex-row-reverse`, `flex-col-reverse`
- Justify: `justify-start`, `justify-end`, `justify-center`, `justify-between`, `justify-around`, `justify-evenly`
- Align items: `items-start`, `items-end`, `items-center`, `items-baseline`, `items-stretch`
- Grid templates: `grid-cols-{n}`, `grid-rows-{n}`
- Flex basis: `basis-{n}`, `basis-full`, `basis-auto`
- Flex shorthands: `flex-1`, `flex-auto`, `flex-none`, `flex-wrap`, `flex-nowrap`

### 6) Positioning Attributes

- Position: `static`, `relative`, `absolute`, `fixed`, `sticky`
- Float: `float-left`, `float-right`, `float-none`
- Side offsets: `top-*`, `right-*`, `bottom-*`, `left-*` including `auto`, `full`, scale, arbitrary
- Insets: `inset-*`, `inset-x-*`, `inset-y-*`
- Isolation: `isolate`, `isolation-auto`

### 7) Sizing Attributes

- Width: `w-*`, fractions (`w-1/2`, etc), named values (`w-full`, `w-screen`, etc), arbitrary values
- Height: `h-*`, named viewport values (`h-screen`, `h-svh`, etc), arbitrary values
- Combined: `size-*`
- Min/max: `min-w-*`, `max-w-*`, `min-h-*`, `max-h-*`
- Aspect ratio: `aspect-auto`, `aspect-square`, `aspect-video`

### 8) Effects Attributes

- Opacity: `opacity-*`
- Shadows: `shadow-none`, `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-inner`
- Blur/filter: `blur*`, `brightness-*`, `contrast-*`, `grayscale`, `grayscale-0`

### 9) Overflow / Interaction Attributes

- Overflow: `overflow-*`, `overflow-x-*`, `overflow-y-*`
- Scroll behavior: `scroll-smooth`, `scroll-auto`
- Scroll spacing: `scroll-p-*`, `scroll-m-*`
- Cursor: `cursor-pointer`, `cursor-default`, `cursor-text`, `cursor-not-allowed`
- Selection: `select-none`, `select-text`
- Pointer events: `pointer-events-none`, `pointer-events-auto`
- Resize: `resize`, `resize-x`, `resize-y`, `resize-none`
- Z-index: `z-*`, `z-auto`

### 10) Transition Attributes

- `transition`, `transition-none`, `transition-all`, `transition-colors`, `transition-opacity`, `transition-shadow`, `transition-transform`
- Duration: `duration-*`
- Delay: `delay-*`
- Easing: `ease-linear`, `ease-in`, `ease-out`, `ease-in-out`

### 11) Transform Attributes

- `scale-*`
- `rotate-*`, `-rotate-*`
- `translate-x-*`, `translate-y-*`, `-translate-x-*`, `-translate-y-*`
- `skew-x-*`, `skew-y-*`
- Origin: `origin-*` variants
- `perspective-*`

### 12) Animation Attributes

- `animate-none`, `animate-spin`, `animate-ping`, `animate-pulse`, `animate-bounce`

## Responsive Attributes

Default breakpoints:

| Prefix | Min Width |
|---|---|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |
| `2xl` | `1536px` |

Example:

```html
<div class="tadka-w-full tadka-lg:w-1/2 tadka-xl:w-1/4"></div>
```

## Pseudo Attributes (JS-driven)

Parser recognizes:

- `hover`, `focus`, `active`, `disabled`, `checked`, `visited`, `group-hover`, `group-focus`, `peer-hover`

Runtime listeners currently implemented:

- `hover`, `focus`, `active`, `disabled`, `checked`

Important caveat:

- Pseudo support is implemented through JavaScript event listeners (not native CSS selectors).

## Configuration

```js
import TadkaCSS from "tadka-css";

TadkaCSS.init({
  prefix: "tadka",
  scale: 4,
  removeClasses: false,
  watch: true,
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  extend: {
    spicy: { color: "#E8550A", fontWeight: "800" },
    btn: (value) => ({
      padding: `${value * 0.25}rem ${value * 0.5}rem`,
      borderRadius: "6px",
    }),
  },
});
```

### Config Fields

| Field | Type | Description |
|---|---|---|
| `prefix` | `string` | Class prefix to scan (default `tadka`) |
| `scale` | `number` | Base spacing scale multiplier |
| `removeClasses` | `boolean` | If true, removes tadka classes after applying styles |
| `watch` | `boolean` | Enables MutationObserver auto re-scan |
| `breakpoints` | `object` | Responsive breakpoint map |
| `colors` | `object` | Override/extend palette |
| `extend` | `object` | Add custom static/dynamic utilities |

## Public API

| Method | Description |
|---|---|
| `init(options?)` | Build config, scan/apply, optionally start observer; returns processed element count |
| `refresh()` | Re-scan entire document; emits `refresh` |
| `apply(element)` | Apply utilities on one element |
| `applyAll(nodeList)` | Apply utilities on collection |
| `parse(className)` | Return parsed style object or `null` |
| `register(name, styles)` | Register custom utility at runtime |
| `unregister(name)` | Remove custom utility |
| `getConfig()` | Get active config |
| `setConfig(options)` | Merge config and rebuild parser/engine |
| `reset()` | Restore original inline styles and clear listeners/rules |
| `on(event, handler)` | Subscribe to events; returns unsubscribe function |

### Events and Payloads

| Event | Payload |
|---|---|
| `ready` | `{ count }` |
| `refresh` | `{ count }` |
| `apply` | `{ element, className, styles }` |
| `parse-error` | `{ className }` |

## TypeScript Example

```ts
import TadkaCSS, { TadkaInitOptions } from "tadka-css";

const config: TadkaInitOptions = {
  prefix: "tadka",
  watch: true,
};

TadkaCSS.init(config);
```

## Under the Hood

1. DOM scanner queries classes containing the configured prefix.
2. Parser resolves each token through utility resolvers.
3. Standard utilities become inline styles.
4. Responsive utilities become generated `@media` rules scoped via data attributes.
5. `watch: true` enables a MutationObserver on subtree/class changes.
6. `reset()` restores original inline style values and clears listeners/rules.

## Troubleshooting

### Classes are not applying

1. Ensure classes start with your configured prefix.
2. Ensure `TadkaCSS.init()` runs after DOM is available.
3. For dynamic content, use `watch: true` or call `refresh()`.

### README on npm is not updating

1. README updates on npm only after publishing a new version.
2. Run patch release (`npm version patch` + `npm publish`).

## Development

```bash
git clone https://github.com/ashaafkhan/tadka-css.git
cd tadka-css
npm install
npm run build
npm test
```

## Contributing

Issues and pull requests are welcome.

Before opening a PR:

1. Run `npm test`
2. Run `npm run build`
3. Update docs/tests for behavior changes

## License

MIT
