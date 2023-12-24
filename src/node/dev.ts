import { createServer as createViteDevServer } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { pluginIndexHtml } from './plugins/indexHtml';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';

// 创建vite devserver
export async function createDevServer(root = process.cwd()) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config);
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
