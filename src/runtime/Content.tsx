import { useRoutes } from 'react-router-dom';
import A from '../../docs/guide/A';
import B from '../../docs/guide/B';
import Index from '../../docs/guide/index';

const routes = [
  {
    path: '/guide',
    element: <Index />
  },
  {
    path: '/guide/a',
    element: <A />
  },
  {
    path: '/b',
    element: <B />
  }
];

export const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
