const { nodeResolve } = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");
const dts = require("rollup-plugin-dts").default;

const basePlugins = [nodeResolve()];

module.exports = [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/tadka-css.esm.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/tadka-css.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "default",
      },
      {
        file: "dist/tadka-css.js",
        format: "umd",
        name: "TadkaCSS",
        sourcemap: true,
      },
      {
        file: "dist/tadka-css.min.js",
        format: "umd",
        name: "TadkaCSS",
        plugins: [terser()],
      },
    ],
    plugins: basePlugins,
  },
  {
    input: "types/index.d.ts",
    output: [{ file: "types/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
