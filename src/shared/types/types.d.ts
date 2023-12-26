declare module 'react-ssg:site-data' {
  import type { UserConfig } from 'shared/types';
  const siteData: UserConfig;
  export default siteData;
}
declare module 'react-ssg:routes' {
  import type { Route } from 'node/plugins/routes';
  export const routes: Route[];
}
