import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  },
  presets: [presetAttributify(), presetWind({}), presetIcons()],
  rules: [
    [
      /^divider-(\w+)$/,
      ([, w]) => ({
        [`border-${w}`]: '1px solid var(--react-ssg-c-divider-light)'
      })
    ],
    [
      'menu-item-before',
      {
        'margin-right': '12px',
        'margin-left': '12px',
        width: '1px',
        height: '24px',
        'background-color': 'var(--react-ssg-c-divider-light)',
        content: '" "'
      }
    ]
  ],
  theme: {
    colors: {
      brandLight: 'var(--react-ssg-c-brand-light)',
      brandDark: 'var(--react-ssg-c-brand-dark)',
      brand: 'var(--react-ssg-c-brand)',
      text: {
        1: 'var(--react-ssg-c-text-1)',
        2: 'var(--react-ssg-c-text-2)',
        3: 'var(--react-ssg-c-text-3)',
        4: 'var(--react-ssg-c-text-4)'
      },
      divider: {
        default: 'var(--react-ssg-c-divider)',
        light: 'var(--react-ssg-c-divider-light)',
        dark: 'var(--react-ssg-c-divider-dark)'
      },
      gray: {
        light: {
          1: 'var(--react-ssg-c-gray-light-1)',
          2: 'var(--react-ssg-c-gray-light-2)',
          3: 'var(--react-ssg-c-gray-light-3)',
          4: 'var(--react-ssg-c-gray-light-4)'
        }
      },
      bg: {
        default: 'var(--react-ssg-c-bg)',
        soft: 'var(--react-ssg-c-bg-soft)',
        mute: 'var(--react-ssg-c-bg-mute)'
      }
    }
  }
};

export default options;
