import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App, initPageData } from './App';
import { DataContext } from './hooks';
import { HelmetProvider } from 'react-helmet-async';

export interface RenderResult {
  appHtml: string;
  reactSsgProps: unknown[];
  reactSsgToPathMap: Record<string, string>;
}

// For ssr component render
export async function render(pagePath: string, helmetContext: object) {
  const pageData = await initPageData(pagePath);
  const { clearReactSsgData, data } = await import('./jsx-runtime');
  clearReactSsgData();
  const { reactSsgProps, reactSsgToPathMap } = data;

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <DataContext.Provider value={pageData}>
        <StaticRouter location={pagePath}>
          <App />
        </StaticRouter>
      </DataContext.Provider>
    </HelmetProvider>
  );
  return {
    appHtml,
    reactSsgProps,
    reactSsgToPathMap
  };
}

export { routes } from 'react-ssg:routes';
