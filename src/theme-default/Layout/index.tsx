import { Helmet } from 'react-helmet-async';
import { usePageData } from '../../runtime';
import { Nav } from '../components/Nav';
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout';

import 'uno.css';
import '../styles/base.css';
import '../styles/vars.css';
import '../styles/doc.css';

export function Layout() {
  const pageData = usePageData();
  // 获取pageType
  const { pageType, title } = pageData;
  // 根据pageType渲染不同内容
  const getContent = () => {
    switch (pageType) {
      case 'home':
        return <HomeLayout />;
      case 'doc':
        return <DocLayout />;
      default:
        return <div>404 页面</div>;
    }
  };
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <section
        style={{
          paddingTop: 'var(--react-ssg-nav-height)'
        }}
      >
        {getContent()}
      </section>
    </div>
  );
}
