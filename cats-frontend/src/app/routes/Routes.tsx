// import Landing from "../features/landing/Landing"
import { createBrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import Dashboard from '../features/dashboard/Dashboard';
import App from '../../App';
import { getLoggedInUserType } from '../helpers/utility';

import Search from '../features/people/Search';
import Person from '../features/people/person/Person';
import ApplicationDetails from '../features/applications/application/ApplicationDetails';
import ApplicationSearch from '../features/applications/search/Search';
import Assignment from '../features/assignment/Assignment';

const roleBasedRoutes: any = {
  client: [
    { path: '/', element: <Search /> },
    { path: '/people', element: <Search /> },
    { path: '/person/:id', element: <Person /> },
    { path: '/person', element: <Person /> },
    { path: '/applications', element: <ApplicationSearch /> },
    { path: '/applications/:id', element: <ApplicationDetails /> },
  ],
  internal: [
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/people', element: <Search /> },
    { path: '/person/:id', element: <Person /> },
    { path: '/person', element: <Person /> },
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
