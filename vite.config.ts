import * as fsPromises from 'fs/promises';
import copy from 'rollup-plugin-copy';
import scss from 'rollup-plugin-scss';
import {defineConfig, Plugin} from 'vite';
import {resolve as pathResolve} from 'path';
import checker from 'vite-plugin-checker';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import './src/styles/module.css';
import './src/styles/styles.css';

// const path = require('path');

const moduleVersion = process.env.MODULE_VERSION;
const githubProject = 'MoonIsFalling/pf2e-display-actions';
const projectName = 'pf2e-display-actions';
// const githubTag = process.env.GH_TAG;

console.log(process.env.VSCODE_INJECTION);

const config = defineConfig({
  root: 'src/',
  base: `/modules/${projectName}/`,
  // publicDir: path.pathResolve(__dirname, 'public'),
  publicDir: pathResolve(__dirname, 'public'),
  server: {
    port: 30001,
    open: true,
    proxy: {
      '^(?!/modules/pf2e-display-actions)': 'http://localhost:30000/',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser',
      },
    ],
  },
  // optimizeDeps: {
  //   // exclude: ['@sveltejs/vite-plugin-svelte'],
  //   include: ['jszip'],
  // },
  build: {
    // outDir: path.pathResolve(__dirname, 'dist'),
    outDir: pathResolve(__dirname, 'dist'),
    sourcemap: true,
    emptyOutDir: true,
    reportCompressedSize: true,
    minify: 'terser',
    terserOptions: {
      mangle: true,
      keep_classnames: true,
      keep_fnames: true,
      compress: true,
    },
    lib: {
      name: projectName,
      // entry: path.pathResolve(__dirname, 'src/ts/module.ts'),
      entry: pathResolve(__dirname, 'src/ts/module.ts'),
      formats: ['es'],
      fileName: 'scripts/module',
    },
    rollupOptions: {
      input: {
        index: pathResolve(__dirname, 'src/ts/module.ts'),
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
        dir: 'dist',
      },
    },
  },
  plugins: [
    resolve(),
    commonjs({
      transformMixedEsModules: true,
    }),
    updateModuleManifestPlugin(),
    checker({
      typescript: true,
    }),
    scss({
      fileName: 'style.css',
      // output: 'dist/style.css',
      includePaths: ['styles/module.css', 'styles/styles.css'],
      sourceMap: true,
      watch: ['src/styles/*.scss'],
    }),
    copy({
      targets: [
        {src: 'src/languages', dest: 'dist'},
        {src: 'src/templates', dest: 'dist'},
        {src: 'src/images', dest: 'dist'},
      ],
      hook: 'writeBundle',
    }),
  ],
});

function updateModuleManifestPlugin(): Plugin {
  return {
    name: 'update-module-manifest',
    async writeBundle(): Promise<void> {
      const packageContents = JSON.parse(await fsPromises.readFile('./package.json', 'utf-8')) as Record<
        string,
        unknown
      >;
      const version = moduleVersion || (packageContents.version as string);
      const manifestContents: string = await fsPromises.readFile('src/module.json', 'utf-8');
      const manifestJson = JSON.parse(manifestContents) as Record<string, unknown>;
      manifestJson['version'] = version;
      if (githubProject) {
        const baseUrl = `https://github.com/${githubProject}/releases`;
        manifestJson['manifest'] = `${baseUrl}/download/${version}/module.json`;
        if (version) {
          manifestJson['download'] = `${baseUrl}/download/${version}/module.zip`;
        }
      }
      await fsPromises.writeFile('dist/module.json', JSON.stringify(manifestJson, null, 4));
    },
  };
}

export default config;
