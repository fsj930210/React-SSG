import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App, initPageData } from './App';
import { DataContext } from './hooks';
import { ComponentType } from 'react';
import { HelmetProvider } from 'react-helmet-async';

declare global {
  interface Window {
    REACTSSG: Record<string, ComponentType<unknown>>;
    REACTSSG_PROPS: unknown[];
  }
}

async function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  if (import.meta.env.DEV) {
    const pageData = await initPageData(location.pathname);
    createRoot(containerEl).render(
      <HelmetProvider>
        <DataContext.Provider value={pageData}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DataContext.Provider>
      </HelmetProvider>
    );
  } else {
    // 生产环境下的 Partial Hydration
    const reactSsg = document.querySelectorAll('[__reactSsg]');
    if (reactSsg.length === 0) {
      return;
    }
    for (const ssg of reactSsg) {
      // Aside:0
      const [id, index] = ssg.getAttribute('__reactSsg').split(':');
      const Element = window.REACTSSG[id] as ComponentType<unknown>;
      hydrateRoot(ssg, <Element {...window.REACTSSG_PROPS[index]} />);
    }
  }
}

renderInBrowser();
