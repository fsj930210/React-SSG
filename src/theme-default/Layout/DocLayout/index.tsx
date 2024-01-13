import { Content, usePageData } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/index';
import { DocFooter } from '../../components/DocFooter';
import { Aside } from '../../components/Aside';
import Styles from './index.module.scss';

export function DocLayout() {
  const { siteData, toc, pagePath } = usePageData();
  const sidebarData = siteData.themeConfig?.sidebar || {};
  const { pathname } = useLocation();
  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchedSidebar = sidebarData[matchedSidebarKey] || [];

  return (
    <div>
      <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
      <div className={Styles.content} flex="~">
        <div className={Styles.docContent}>
          <div className="react-ssg-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
        <div className={Styles.asideContainer}>
          <Aside headers={toc} pagePath={pagePath} />
        </div>
      </div>
    </div>
  );
}
