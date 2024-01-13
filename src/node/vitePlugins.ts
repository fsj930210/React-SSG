// 有不少插件是dev 和 production 公用的，所以单独提出来
// 这样就不用实现两遍
import pluginReact from '@vitejs/plugin-react';
import { pluginIndexHtml } from './plugins/indexHtml';
import { pluginConfig } from './plugins/config';
import { pluginRoutes } from './plugins/routes';
import { createPluginMdx } from './plugins/mdx';
import { SiteConfig } from 'shared/types';
import unocssOptions from './unocssOptions';
import pluginUnocss from 'unocss/vite';
export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR = false
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
      isSSR
    }),
    await createPluginMdx(config.root)
  ];
}
