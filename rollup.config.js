// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: '/src/ts/module.ts',
  output: {
    file: 'dist/scripts/module.js',
    format: 'es'
  },
  plugins: [
    typescript(), 
    json(),
    resolve(),
    commonjs({
      transformMixedEsModules: true
    })]
};