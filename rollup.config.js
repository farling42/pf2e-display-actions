// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: {
    // index: path.resolve(__dirname, 'src/ts/module.ts'),
    index: '/src/ts/module.ts',
  },
  treeshake: true,
  preserveEntrySignatures: 'strict',
  output: {
    // generatedCode: 'es5',
    // extend: true,
    // preserveModules: true,
    // dynamicImportInCjs: true,
    // externalImportAssertions: true,
    esModule: true,
    // file: path.resolve(__dirname, 'dist/scripts/module.js'),
    // file: resolve(__dirname, 'dist/scripts/module.js'),
    dir: "dist",
    format: 'es',
    interop: 'auto',
  },
  plugins: [
    json(),
    commonjs({
      transformMixedEsModules: true
    })]
};