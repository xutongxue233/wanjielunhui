import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./apps/game-web/src/test/setup.ts'],
    include: ['apps/game-web/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['apps/game-web/src/components/**', 'apps/game-web/src/design-system/**'],
      exclude: ['apps/game-web/src/**/*.test.*', 'apps/game-web/src/**/*.spec.*', 'apps/game-web/src/test/**'],
    },
  },
});
