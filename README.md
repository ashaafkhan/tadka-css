# tadka-css

Add spice to your styles. Utility-first CSS engine in vanilla JS.

![npm](https://img.shields.io/npm/v/tadka-css?label=npm)
![npm downloads](https://img.shields.io/npm/dm/tadka-css)
![license](https://img.shields.io/npm/l/tadka-css)
![bundlephobia](https://img.shields.io/bundlephobia/minzip/tadka-css)
![github stars](https://img.shields.io/github/stars/ashaafkhan/tadka-css)

- npm: https://www.npmjs.com/package/tadka-css
- GitHub: https://github.com/ashaafkhan/tadka-css
- Live Demo: https://tadkacss.vercel.app/
- Playground: https://tadkacss.vercel.app/playground/

TypeScript typings are included out of the box through `types/index.d.ts`.

## What Is This?

tadka-css is a utility-first styling engine that runs in the browser.

Instead of writing custom CSS rules, you write class names like:

- `tadka-p-4`
- `tadka-bg-orange-500`
- `tadka-text-white`

The library scans your DOM, converts those class names into style objects, and applies styles automatically.

## Why Beginners Like It

- You can style pages without writing separate CSS files.
- You can learn utility-first thinking quickly.
- You can inspect styles directly in browser devtools.
- You can switch from this to Tailwind-style workflows later very easily.

## Install

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

## 2-Minute Quick Start

Create an HTML file and paste this:

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

If you are using npm in a module project:

```js
import TadkaCSS from "tadka-css";
TadkaCSS.init();
```

## How It Works Internally

1. Finds classes with the configured prefix (`tadka-` by default).
2. Parses each utility token into a CSS style object.
3. Applies standard utilities as inline styles.
4. Handles responsive utilities by injecting media query rules.
5. Handles pseudo-like interactions (hover/focus/active) via JS listeners.

## Most Common Utilities

### Spacing

- `tadka-p-4` (padding)
- `tadka-mx-auto` (horizontal auto margin)
- `tadka-gap-4` (gap)
- `tadka-p-[13px]` (arbitrary value)

### Colors

- `tadka-bg-orange-500`
- `tadka-text-slate-900`
- `tadka-border-blue-300`

### Typography

- `tadka-text-sm`, `tadka-text-lg`, `tadka-text-3xl`
- `tadka-font-bold`
- `tadka-underline`

### Layout

- `tadka-flex`, `tadka-items-center`, `tadka-justify-between`
- `tadka-grid`, `tadka-grid-cols-3`

## Responsive Usage

| Prefix | Min Width |
|---|---|
| `tadka-sm:` | `640px` |
| `tadka-md:` | `768px` |
| `tadka-lg:` | `1024px` |
| `tadka-xl:` | `1280px` |
| `tadka-2xl:` | `1536px` |

Example:

```html
<div class="tadka-w-full tadka-lg:w-1/2 tadka-xl:w-1/4"></div>
```

## Interactivity Prefixes

- `tadka-hover:*`
- `tadka-focus:*`
- `tadka-active:*`
- `tadka-disabled:*`
- `tadka-checked:*`

Example:

```html
<button class="tadka-bg-orange-500 tadka-hover:bg-orange-700 tadka-active:scale-95">
  Hover me
</button>
```

## Config and Custom Utilities

```js
import TadkaCSS from "tadka-css";

TadkaCSS.init({
  prefix: "tadka",
  watch: true,
  extend: {
    spicy: { color: "#E8550A", fontWeight: "800" },
    btn: (value) => ({
      padding: `${value * 0.25}rem ${value * 0.5}rem`,
      borderRadius: "6px",
    }),
  },
  colors: {
    masala: { 500: "#7B3F00", 300: "#C17F3C", 100: "#F5E6D0" },
  },
});
```

## Public API

| Method | Description |
|---|---|
| `init(options)` | Initialize engine, scan DOM, start observer |
| `refresh()` | Re-scan the DOM |
| `apply(element)` | Apply utilities to one element |
| `applyAll(nodeList)` | Apply utilities to many elements |
| `parse(className)` | Return parsed style object |
| `register(name, styles)` | Register a custom utility |
| `unregister(name)` | Remove a custom utility |
| `getConfig()` | Get active config |
| `setConfig(options)` | Merge and apply config changes |
| `reset()` | Remove generated styles/listeners |
| `on(event, handler)` | Subscribe to `ready`, `apply`, `parse-error`, `refresh` |

### init Options

| Option | Type | Default |
|---|---|---|
| `prefix` | `string` | `tadka` |
| `scale` | `number` | `4` |
| `removeClasses` | `boolean` | `false` |
| `watch` | `boolean` | `true` |
| `breakpoints` | `object` | `sm/md/lg/xl/2xl` |
| `extend` | `object` | `{}` |
| `colors` | `object` | generated palette |

## Arbitrary Values

Use square brackets for direct values:

```html
<div class="tadka-p-[13px] tadka-w-[420px] tadka-bg-[#FF5733]"></div>
```

## Troubleshooting

### My classes are not applying

- Make sure class names start with `tadka-`.
- If using npm import, ensure `TadkaCSS.init()` runs after DOM is ready.
- If you add HTML dynamically, call `TadkaCSS.refresh()` (or keep `watch: true`).

### Responsive classes are not showing

- Confirm prefixes like `tadka-md:` are written correctly.
- Check if viewport width actually matches breakpoint.

### npm page did not update after README edit

- npm README updates only after publishing a new version.
- Bump version and publish again (for example, 1.0.1).

## Development

```bash
git clone https://github.com/ashaafkhan/tadka-css.git
cd tadka-css
npm install
npm run build
npm test
```

## Demo

- Main demo: https://tadkacss.vercel.app/
- Playground: https://tadkacss.vercel.app/playground/
- Demo source: https://github.com/ashaafkhan/tadka-css/blob/main/demo/index.html

## Contributing

Issues and pull requests are welcome.

Before opening a PR:

1. Run `npm test`
2. Run `npm run build`
3. Add or update tests for behavior changes

## License

MIT
