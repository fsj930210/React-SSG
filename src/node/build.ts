import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'fs-extra';
import { InlineConfig, build as viteBuild } from 'vite';
import type { RollupOutput } from 'rollup';
import {
  CLIENT_ENTRY_PATH,
  CLIENT_OUTPUT,
  EXTERNALS,
  MASK_SPLITTER,
  PACKAGE_ROOT,
  SERVER_ENTRY_PATH
} from './constants';
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugins';
import { Route } from './plugins/routes';
import { RenderResult } from 'runtime/ServerEntry';
import { HelmetData } from 'react-helmet-async';

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (isServer: boolean): Promise<InlineConfig> => ({
    mode: 'production',
    root,
    plugins: await createVitePlugins(config, undefined, isServer),
    ssr: {
      // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
      noExternal: ['react-router-dom', 'lodash-es']
    },
    build: {
      ssr: isServer,
      outDir: isServer ? join(root, '.temp') : join(root, CLIENT_OUTPUT),
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        },
        external: EXTERNALS
      }
    }
  });
  console.log('Building client + server bundles...');
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      // client build
      viteBuild(await resolveViteConfig(false)),
      // server build
      viteBuild(await resolveViteConfig(true))
    ]);
    const publicDir = join(root, 'public');
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT));
    }
    await fs.copy(join(PACKAGE_ROOT, 'vendors'), join(root, CLIENT_OUTPUT));
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.log(error);
  }
}
export async function build(root: string = process.cwd(), config: SiteConfig) {
  const [clientBundle] = await bundle(root, config);
  // 引入 ssr入口模块
  const serverEntryPath = join(root, '.temp', 'ServerEntry.js');
  // 兼容windows系统
  const { render, routes } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, routes, root, clientBundle);
}

export async function renderPage(
  render: (url: string, elmetContext: object) => Promise<RenderResult>,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry);
  console.log('Rendering page in server side...');
  return Promise.all(
    [
      ...routes,
      {
        path: '/404'
      }
    ].map(async (route) => {
      const { path: routePath } = route;
      const helmetContext = {
        context: {}
      } as HelmetData;
      const { appHtml, reactSsgProps, reactSsgToPathMap } = await render(routePath, helmetContext);
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      );
      const reactSsgBundle = await buildReactSsg(root, reactSsgToPathMap);
      const reactSsgCode = (reactSsgBundle as RollupOutput).output[0].code;
      await buildReactSsg(root, reactSsgToPathMap);
      const { helmet } = helmetContext.context;
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    ${helmet?.title?.toString() || ''}
    ${helmet?.meta?.toString() || ''}
    ${helmet?.link?.toString() || ''}
    ${helmet?.style?.toString() || ''}
    <meta name="description" content="xxx">
    ${styleAssets.map((item) => `<link rel="stylesheet" href="/${item.fileName}">`).join('\n')}
    <script type="importmap">
    {
      "imports": {
        ${EXTERNALS.map((name) => `"${name}": "/${normalizeVendorFilename(name)}"`).join(',')}
      }
    }
  </script>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module">${reactSsgCode}</script>
    <script type="module" src="/${clientChunk?.fileName}"></script>
    <script id="reactSsg-props">${JSON.stringify(reactSsgProps)}</script>
  </body>
</html>`.trim();
      const fileName = routePath.endsWith('/') ? `${routePath}index.html` : `${routePath}.html`;
      await fs.ensureDir(join(root, 'build', dirname(fileName)));
      await fs.writeFile(join(root, 'build', fileName), html);
      // await fs.ensureDir(join(root, CLIENT_OUTPUT));
      // await fs.writeFile(join(root, 'build/index.html'), html);
      // await fs.remove(join(root, '.temp'));
    })
  );
}
async function buildReactSsg(root: string, reactSsgPathToMap: Record<string, string>) {
  // 根据 reactSsgPathToMap 拼接模块代码内容
  const reactSsgInjectCode = `
    ${Object.entries(reactSsgPathToMap)
      .map(([reactSsgName, ReactSsgPath]) => `import { ${reactSsgName} } from '${ReactSsgPath}'`)
      .join('')}
window.REACTSSG = { ${Object.keys(reactSsgPathToMap).join(', ')} };
window.REACTSSG_PROPS = JSON.parse(
  document.getElementById('reactSsg-props').textContent
);
  `;
  const injectId = 'reactSsg:inject';
  return viteBuild({
    mode: 'production',
    esbuild: {
      jsx: 'automatic'
    },
    build: {
      // 输出目录
      outDir: join(root, '.temp'),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS
      }
    },
    plugins: [
      // 重点插件，用来加载我们拼接的 ReactSsg 注册模块的代码
      {
        name: 'reactSsg:inject',
        enforce: 'post',
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER);
            return this.resolve(originId, importer, { skipSelf: true });
          }

          if (id === injectId) {
            return id;
          }
        },
        load(id) {
          if (id === injectId) {
            return reactSsgInjectCode;
          }
        },
        // 对于 Islands Bundle，我们只需要 JS 即可，其它资源文件可以删除
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name];
            }
          }
        }
      }
    ]
  });
}
const normalizeVendorFilename = (fileName: string) => fileName.replace(/\//g, '_') + '.js';
