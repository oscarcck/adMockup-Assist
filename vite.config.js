import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'AdMockupAssistant',
      fileName: (format) => `ad-mockup-assistant.${format}.js`,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
  },
});
