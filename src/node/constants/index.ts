import { join } from 'node:path';
// import { fileURLToPath } from 'node:url';

// const __dirname = fileURLToPath(new URL('.', import.meta.url));

// export const PACKAGE_ROOT = join(__dirname, '..', '..', '..');

export const PACKAGE_ROOT = join(__dirname, '..');

export const RUNTIME_PATH = join(PACKAGE_ROOT, 'src', 'runtime');

export const DEFAULT_HTML_PATH = join(PACKAGE_ROOT, 'template.html');

export const CLIENT_ENTRY_PATH = join(RUNTIME_PATH, 'ClientEntry.tsx');

export const SERVER_ENTRY_PATH = join(RUNTIME_PATH, 'ServerEntry.tsx');

export const MD_REGEX = /\.mdx?$/;
