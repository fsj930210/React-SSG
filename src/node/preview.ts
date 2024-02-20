import compression from 'compression';
import polka from 'polka';
import path from 'path';
import { resolveConfig } from './config';
import fs from 'fs-extra';
import sirv from 'sirv';

const DEFAULT_PORT = 4173;
export interface CLIServeOption {
  base?: string;
  root?: string;
  port?: number;
  host?: string;
}

export async function preview(root: string, cliOptions: CLIServeOption) {
  const config = await resolveConfig(root, 'serve', 'production');
  const listenPort = cliOptions.port ?? DEFAULT_PORT;
  const host = cliOptions.host ?? 'localhost';
  const outputDir = path.resolve(root, 'build');
  const notFoundPage = fs.readFileSync(path.resolve(outputDir, '404.html'), 'utf-8');
  const base = config.base?.replace(/^\//, '').replace(/\/$/, '') || '';
  const compress = compression();

  const serve = sirv(outputDir, {
    etag: true,
    maxAge: 31536000,
    immutable: true,
    setHeaders(res, pathname) {
      if (pathname.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  });

  const onNoMatch: polka.Options['onNoMatch'] = (req, res) => {
    res.statusCode = 404;
    res.end(notFoundPage);
  };

  if (base) {
    polka({ onNoMatch })
      .use(base, serve, compression)
      .listen(listenPort, host, (err: Error) => {
        if (err) throw err;
        console.log(`Built site served at http://${host}:${listenPort}/${base}/\n`);
      });
  } else {
    polka({ onNoMatch })
      .use(compress, serve)
      .listen(listenPort, host, (err: Error) => {
        if (err) throw err;
        console.log(`Built site served at http://${host}:${listenPort}/\n`);
      });
  }
}
