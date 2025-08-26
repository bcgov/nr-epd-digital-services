import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    AutoImport({
      imports: ['vitest'],
    }),
  ],
  resolve: {
    alias: {
      '@cats': path.resolve(__dirname, './src/app'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
