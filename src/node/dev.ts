import { createServer as createViteDevServer } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { pluginIndexHtml } from './plugins/indexHtml';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { pluginConfig } from './plugins/config';
import { pluginRoutes } from './plugins/routes';
// 创建vite devserver
export async function createDevServer(root = process.cwd(), restartServer: () => Promise<void>) {
  const config = await resolveConfig(root, 'serve', 'development');
  return createViteDevServer({
    plugins: [
      pluginIndexHtml(),
      pluginReact({
        jsxRuntime: 'automatic'
      }),
      pluginConfig(config, restartServer),
      pluginRoutes({
        root: config.root
      })
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
