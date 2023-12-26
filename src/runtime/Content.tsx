import { useRoutes } from 'react-router-dom';
import { routes } from 'react-ssg:routes';

export const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
