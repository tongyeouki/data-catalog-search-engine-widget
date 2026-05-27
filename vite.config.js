import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative assets path resolving, robust for subfolder paths on GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
