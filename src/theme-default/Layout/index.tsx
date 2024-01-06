import { usePageData } from '../../runtime';
import 'uno.css';

export function Layout() {
  const pageData = usePageData();
  // 获取pageType
  const { pageType } = pageData;
  // 根据pageType渲染不同内容
  const getContent = () => {
    switch (pageType) {
      case 'home':
        return <div>Home 页面</div>;
      case 'doc':
        return <div>Doc 页面</div>;
      default:
        return <div>404 页面</div>;
    }
  };
  return <div>{getContent()}</div>;
}
