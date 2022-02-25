import { resolve } from 'path';
import { glob } from 'glob';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = resolve(__dirname, 'src');
const publicDir = resolve(__dirname, 'public');
const outDir = resolve(__dirname, 'build');

// https://vitejs.dev/config/
export default defineConfig({
  root,
  publicDir,
  base: "noneuclidjs-docs/",
  build: {
    outDir,
    emptyOutDir: true,
    manifest: true,
    ssrManifest: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        framework: resolve(root, 'vite/index.html'),
        examples: resolve(root, 'examples/basic/index.html'),
      }
    }
  },
  resolve: {
    alias: {
      "@": publicDir,
    },
  },
  plugins: [react()]
});
