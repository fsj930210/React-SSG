import { usePageData } from '../../runtime';
import { Nav } from '../components/Nav';
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout';
import 'uno.css';
import '../styles/base.css';
import '../styles/vars.css';

export function Layout() {
  const pageData = usePageData();
  // 获取pageType
  const { pageType } = pageData;
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
      <Nav />
      {getContent()}
    </div>
  );
}
