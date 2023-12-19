import path from 'node:path';
import { cac } from 'cac';
import { createDevServer } from './dev.mjs';
import pkg from '../../package.json' assert { type: 'json' };

const version = pkg.version;

// 使用cac来做脚手架命令行开发工具
const cli = cac('react-ssg').version(version).help();

cli
	.command('[root]', 'start dev server')
	.alias('dev')
	.action(async (root: string) => {
		console.log('dev', root);
		root = root ? path.resolve(root) : process.cwd();
		const server = await createDevServer(root);
		await server.listen();
		server.printUrls();
	});
cli.command('build [root]', 'build for production').action(async (root: string) => {
	console.log('build', root);
});
cli.parse();
