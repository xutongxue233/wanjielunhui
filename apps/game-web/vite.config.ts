import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const appRoot = resolve(__dirname);
const workspaceRoot = resolve(__dirname, '../..');

export default defineConfig({
  root: appRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@wanjie/contracts': resolve(workspaceRoot, 'packages/contracts/src'),
      '@wanjie/game-rules': resolve(workspaceRoot, 'packages/game-rules/src'),
      '@wanjie/ui': resolve(workspaceRoot, 'packages/ui/src'),
    },
  },
  server: {
    fs: {
      allow: [workspaceRoot],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: resolve(appRoot, 'dist'),
    emptyOutDir: true,
  },
});
