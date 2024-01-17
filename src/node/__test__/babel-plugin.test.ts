import { expect, describe, test } from 'vitest';
import babelPluginReactSsg from '../babel-plugins';
import { TransformOptions, transformAsync } from '@babel/core';
import os from 'os';
import { MASK_SPLITTER } from '../../node/constants';

const isWindows = os.platform() === 'win32';

describe('babel-plugin-react-ssg', () => {
  // import Aside from '../Comp/index';
  const REACTSSG_PATH = '../Comp/index';
  const prefix = isWindows ? 'C:' : '';
  const IMPORTER_PATH = prefix + '/User/project/test.tsx';
  const babelOptions: TransformOptions = {
    filename: IMPORTER_PATH,
    presets: ['@babel/preset-react'],
    plugins: [babelPluginReactSsg]
  };

  test('Should compile jsx identifier', async () => {
    const code = `import Aside from '${REACTSSG_PATH}'; export default function App() { return <Aside __reactSsg__ />; }`;

    const result = await transformAsync(code, babelOptions);

    expect(result?.code).toContain(
      `__reactSsg__: "${REACTSSG_PATH}${MASK_SPLITTER}${IMPORTER_PATH}"`
    );
  });

  test('Should compile jsx member expression', async () => {
    const code = `import A from '${REACTSSG_PATH}'; export default function App() { return <A.B __reactSsg__ />; }`;

    const result = await transformAsync(code, babelOptions);

    expect(result?.code).toContain(
      `__reactSsg__: "${REACTSSG_PATH}${MASK_SPLITTER}${IMPORTER_PATH}"`
    );
  });
});
