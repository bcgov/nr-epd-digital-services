// import Landing from "../features/landing/Landing"
import { createBrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import Dashboard from '../features/dashboard/Dashboard';
import App from '../../App';
import {
  getLoggedInUserType
} from '../helpers/utility';

const roleBasedRoutes: any = {
  client: [
    { path: '/', element: <Dashboard /> },
  ],
  internal: [
    { path: '/dashboard', element: <Dashboard /> },
  ],
};

// Create routes based on the user's role
const createRoutesForRole = (role: string) => [
  {
    element: (
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <App />
      </QueryParamProvider>
    ),
    errorElement: <h1>Page not found</h1>,
    children: roleBasedRoutes[role]?.map((route: any) => ({
      path: route.path,
      element: route.element,
      children: route.children,
    })),
  },
];

const userType = getLoggedInUserType();
const siteRouter = createBrowserRouter(createRoutesForRole('client'));

export default siteRouter;