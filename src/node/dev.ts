import { createServer as createViteDevServer } from 'vite';

// 创建vite devserver
export async function createDevServer(root = process.cwd()) {
	return createViteDevServer({
		root,
	});
}
