# tadka-css

![npm](https://img.shields.io/npm/v/tadka-css)
![license](https://img.shields.io/npm/l/tadka-css)
![bundlephobia](https://img.shields.io/bundlephobia/minzip/tadka-css)
![stars](https://img.shields.io/github/stars/ashaafkhan/tadka-css?style=social)

Add spice to your styles. Utility-first CSS engine in vanilla JS.

## Installation

```bash
npm install tadka-css
```

```html
<script src="https://unpkg.com/tadka-css/dist/tadka-css.js"></script>
```

```bash
yarn add tadka-css
pnpm add tadka-css
```

## Quick Start

```html
<div class="tadka-p-4 tadka-bg-blue-500 tadka-text-white tadka-rounded-lg">
  Hello World
</div>

<script type="module">
  import TadkaCSS from "tadka-css";
  TadkaCSS.init();
</script>
```

## How It Works

- Scans the DOM for classes prefixed with `tadka-`.
- Tokenizes each class and resolves it to a JS style object.
- Applies styles inline, and injects responsive rules into a runtime `<style>` tag.

## API Reference

| Method | Description |
|---|---|
| `init(options)` | Initialize engine, scan DOM, and start observer |
| `refresh()` | Re-scan DOM |
| `apply(element)` | Apply to one element |
| `applyAll(nodeList)` | Apply to many elements |
| `parse(className)` | Return parsed style object |
| `register(name, styles)` | Add custom utility |
| `unregister(name)` | Remove custom utility |
| `getConfig()` | Get active config |
| `setConfig(options)` | Merge new config |
| `reset()` | Remove generated styles and listeners |
| `on(event, handler)` | Listen to `ready`, `apply`, `parse-error`, `refresh` |

## init() Options

| Option | Type | Default |
|---|---|---|
| `prefix` | `string` | `tadka` |
| `scale` | `number` | `4` |
| `removeClasses` | `boolean` | `false` |
| `watch` | `boolean` | `true` |
| `breakpoints` | `object` | `sm/md/lg/xl/2xl` |
| `extend` | `object` | `{}` |
| `colors` | `object` | generated 22-color palette |

## Utility Cheatsheet

- Spacing: `tadka-p-4`, `tadka-mx-auto`, `tadka-gap-6`, `tadka-p-[13px]`
- Colors: `tadka-bg-orange-500`, `tadka-text-slate-900`, `tadka-border-blue-300`
- Layout: `tadka-flex`, `tadka-items-center`, `tadka-grid`, `tadka-grid-cols-3`
- Typography: `tadka-text-2xl`, `tadka-font-bold`, `tadka-underline`

## Responsive Usage

| Prefix | Min Width |
|---|---|
| `tadka-sm:` | `640px` |
| `tadka-md:` | `768px` |
| `tadka-lg:` | `1024px` |
| `tadka-xl:` | `1280px` |
| `tadka-2xl:` | `1536px` |

```html
<div class="tadka-w-full tadka-lg:w-1/2 tadka-xl:w-1/4"></div>
```

## Interactivity Prefixes

- `tadka-hover:*`
- `tadka-focus:*`
- `tadka-active:*`
- `tadka-group-hover:*`
- `tadka-disabled:*`
- `tadka-checked:*`

```html
<button class="tadka-bg-orange-500 tadka-hover:bg-orange-700 tadka-active:scale-95">
  Hover me
</button>
```

## Extending tadka-css

```js
import TadkaCSS from "tadka-css";

TadkaCSS.init({
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

## Arbitrary Values

```html
<div class="tadka-p-[13px] tadka-w-[420px] tadka-bg-[#FF5733]"></div>
```

## Development

```bash
git clone https://github.com/ashaafkhan/tadka-css.git
cd tadka-css
npm install
npm run build
npm test
```

## Demo

- Main demo (Live): https://tadkacss.vercel.app/
- Playground (Live): https://tadkacss.vercel.app/playground/
- Main demo source: https://github.com/ashaafkhan/tadka-css/blob/main/demo/index.html
- Playground source: https://github.com/ashaafkhan/tadka-css/blob/main/demo/playground/index.html

## Contributing

Issues and PRs are welcome. Please run tests before opening a PR.

## License

MIT
