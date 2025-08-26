import { createBrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import App from '../../App';
import {
  getLoggedInUserType,
  isBCEIDUserType,
  UserRoleType,
} from '../helpers/utility';
import Search from '../features/people/Search';
import Person from '../features/people/person/Person';
import ApplicationDetails from '../features/applications/application/ApplicationDetails';
import ApplicationSearch from '../features/applications/search/Search';
import StaffDashboard from '../features/staff/Staff';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '@cats/features/dashboard/Dashboard';
import Invoice from '@cats/features/applications/application/applicationTabs/appInvoices/invoice/Invoice';
import ApplicationTabsRouter from '../features/applications/application/ApplicationTabsRouter';
import MyTasks from '../features/mytasks/mytasks';

const roleBasedRoutes: any = {
  [UserRoleType.INTERNAL]: [
    { path: '/error', element: <h1>You are not authorized</h1> },
    { path: '/', element: <Search /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/people', element: <Search /> },
    { path: '/person/:id', element: <Person /> },
    { path: '/person', element: <Person /> },
    { path: '/applications', element: <ApplicationSearch /> },
    { path: '/mytasks', element: <MyTasks /> },
    {
      path: '/applications/:id',
      element: <ApplicationDetails />,
      children: [{ path: '*', element: <ApplicationTabsRouter /> }],
    },
    { path: '/applications/:applicationId/invoice', element: <Invoice /> },
    { path: '/applications/:applicationId/invoice/:id', element: <Invoice /> },
    {
      path: '/staff',
      element: (
        <ProtectedRoute
          requiredRoles={[UserRoleType.MANAGER]}
          element={<StaffDashboard />}
        />
      ),
    },
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

const externalUser = isBCEIDUserType();

const siteRouter = externalUser
  ? createBrowserRouter([
    {
      path: '*',
      element: (
        <h1>ERROR!!! You are not authorized to access this appplication</h1>
      ),
    },
  ])
  : createBrowserRouter(createRoutesForRole(UserRoleType.INTERNAL));

export default siteRouter;
