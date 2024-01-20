import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App, initPageData } from './App';
import { DataContext } from './hooks';

export interface RenderResult {
  appHtml: string;
  reactSsgProps: unknown[];
  reactSsgToPathMap: Record<string, string>;
}

// For ssr component render
export async function render(pagePath: string) {
  const pageData = await initPageData(pagePath);
  const { clearReactSsgData, data } = await import('./jsx-runtime');

  const { reactSsgProps, reactSsgToPathMap } = data;
  clearReactSsgData();
  const appHtml = renderToString(
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </DataContext.Provider>
  );
  return {
    appHtml,
    reactSsgProps,
    reactSsgToPathMap
  };
}

export { routes } from 'react-ssg:routes';
