import { createBrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import App from '../../App';
import { getLoggedInUserType, UserRoleType } from '../helpers/utility';
import Search from '../features/people/Search';
import Person from '../features/people/person/Person';
import ApplicationDetails from '../features/applications/application/ApplicationDetails';
import ApplicationSearch from '../features/applications/search/Search';
import StaffDashboard from '../features/staff/Staff';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '@cats/features/dashboard/Dashboard';
import Invoice from '@cats/features/applications/application/applicationTabs/appInvoices/invoice/Invoice';

const roleBasedRoutes: any = {
  [UserRoleType.INTERNAL]: [
    { path: '/', element: <Search /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/people', element: <Search /> },
    { path: '/person/:id', element: <Person /> },
    { path: '/person', element: <Person /> },
    { path: '/applications', element: <ApplicationSearch /> },
    { path: '/applications/:id', element: <ApplicationDetails /> },
    { path: '/applications/:applicationId/invoice', element: <Invoice />},
    { path: '/applications/:applicationId/invoice/:id', element: <Invoice />},
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
const siteRouter = createBrowserRouter(
  createRoutesForRole(UserRoleType.INTERNAL),
);

export default siteRouter;
