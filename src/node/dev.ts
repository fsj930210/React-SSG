import { createServer as createViteDevServer } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { pluginIndexHtml } from './plugins/indexHtml';
import { PACKAGE_ROOT } from './constants';

// 创建vite devserver
export async function createDevServer(root = process.cwd()) {
  console.log(PACKAGE_ROOT, 'PACKAGE_ROOT', root);
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
