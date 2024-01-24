import { resolve } from 'node:path';
import { cac } from 'cac';
import { createDevServer } from './dev';
import { build } from './build';
import { resolveConfig } from './config';
import { preview } from './preview';
// import pkg from '../../package.json' assert { type: 'json' };

// const version = pkg.version;

// 使用cac来做脚手架命令行开发工具
const cli = cac('react-ssg').version('0.0.1').help();

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    const createServer = async () => {
      root = root ? resolve(root) : process.cwd();
      const server = await createDevServer(root, async () => {
        await server.close();
        await createServer();
      });
      await server.listen();
      server.printUrls();
    };
    await createServer();
  });
cli.command('build [root]', 'build for production').action(async (root: string) => {
  console.log('build', root);
  try {
    root = resolve(root);
    const config = await resolveConfig(root, 'build', 'production');
    await build(root, config);
  } catch (error) {
    console.log(error);
  }
});
cli
  .command('preview [root]', 'preview production build')
  .option('--port <port>', 'port to use for preview server')
  .action(async (root: string, { port }: { port: number }) => {
    try {
      root = resolve(root);
      await preview(root, { port });
    } catch (e) {
      console.log(e);
    }
  });
cli.parse();
