import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App, initPageData } from './App';
import { DataContext } from './hooks';
import { ComponentType } from 'react';

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
      <DataContext.Provider value={pageData}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataContext.Provider>
    );
  } else {
    // 生产环境下的 Partial Hydration
    const reactSsg = document.querySelectorAll('[__reactSsg__]');
    if (reactSsg.length === 0) {
      return;
    }
    for (const ssg of reactSsg) {
      // Aside:0
      const [id, index] = ssg.getAttribute('__reactSsg__').split(':');
      const Element = window.REACTSSG[id] as ComponentType<unknown>;
      hydrateRoot(ssg, <Element {...window.REACTSSG_PROPS[index]} />);
    }
  }
}

renderInBrowser();
