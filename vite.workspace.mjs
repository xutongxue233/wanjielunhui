import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const workspaceRoot = resolve(import.meta.dirname);

export default defineConfig(({ mode }) => {
  const appKey = mode === 'admin' ? 'admin' : 'game';
  const appRoot = appKey === 'admin'
    ? resolve(workspaceRoot, 'apps/admin-web')
    : resolve(workspaceRoot, 'apps/game-web');

  return {
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
  };
});
