import { matchRoutes } from 'react-router-dom';
import siteData from 'react-ssg:site-data';
import { routes } from 'react-ssg:routes';
import { PageData } from 'shared/types';
import { Layout } from '../theme-default';

export function App() {
  return <Layout />;
}

export async function initPageData(routePath: string): Promise<PageData> {
  const matchedRoutes = matchRoutes(routes, routePath);
  if (matchedRoutes) {
    const moduleInfo = await matchedRoutes[0].route.preload();
    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath,
      toc: moduleInfo.toc,
      title: moduleInfo.title
    };
  }
  return {
    pageType: '404',
    siteData,
    frontmatter: {},
    pagePath: routePath,
    title: '404'
  };
}
