import { defineConfig } from '../dist';

export default defineConfig({
  title: 'react-ssg',
  description: 'react ssg框架',
  themeConfig:{
    nav: [
      {
        text: '主页',
        link: '/'
      },
      {
        text: '指南',
        link: '/guide/'
      },
    ],
  }
});