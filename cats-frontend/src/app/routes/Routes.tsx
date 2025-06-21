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
import StaffDashboard from '../features/staff/Staff';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from 'react-oidc-context';
import { getClientSettings } from '@cats/auth/UserManagerSetting';
import { UserManagerSettings } from 'oidc-client-ts';
import CreateInvoice from '../features/applications/application/applicationTabs/appInvoices/components/create/CreateInvoice';
import Dashboard from '@cats/features/dashboard/Dashboard';
import ViewInvoice from '../features/applications/application/applicationTabs/appInvoices/components/view/ViewInvoice';

const roleBasedRoutes: any = {
  [UserRoleType.INTERNAL]: [
    { path: '/', element: <Search /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/people', element: <Search /> },
    { path: '/person/:id', element: <Person /> },
    { path: '/person', element: <Person /> },
    { path: '/applications', element: <ApplicationSearch /> },
    { path: '/applications/:id', element: <ApplicationDetails /> },
    { path: '/applications/:id/invoices/create', element: <CreateInvoice /> },
    {
      path: '/applications/:applicationId/invoices/:id/view',
      element: <ViewInvoice />,
    },
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
