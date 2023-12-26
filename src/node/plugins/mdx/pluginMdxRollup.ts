import type { Plugin as VitePlugin } from 'vite';
import pluginMdx from '@mdx-js/rollup';
// GFM 全称为 GitHub flavored markdown，是一个比较知名的 Markdown 语法规范
import remarkPluginGFM from 'remark-gfm';
// 这两插件一起使用给标题加锚点
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';
// 解析页面的元信息，然后作为模块编译后所导出(export)的一部分 元信息必须在md文档开头不能有空格
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';

export function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [remarkPluginMDXFrontMatter as any, { name: 'frontmatter' }]
    ],
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ]
    ]
  }) as unknown as VitePlugin;
}
