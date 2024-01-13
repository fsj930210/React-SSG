import { Plugin } from 'vite';
import { pluginMdxRollup } from './pluginMdxRollup';
import { pluginMdxHMR } from './pluginMdxHmr';
export async function createPluginMdx(root: string): Promise<Plugin[]> {
  return [await pluginMdxRollup(), pluginMdxHMR(root)];
}
