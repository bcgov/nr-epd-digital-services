import { isUserOfType, UserRoleType } from '@cats/helpers/utility';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router';

export type ProtectedRouteProps = {
  element: JSX.Element;
  requiredRoles: UserRoleType[];
};

function ProtectedRoute({ requiredRoles, element }: ProtectedRouteProps) {
  const auth = useAuth();
  const isValidUser = requiredRoles.some(role => isUserOfType(role));
  if (auth.isLoading) {
    return <div>loading</div>;
  }
  if (auth.isAuthenticated && isValidUser) 
  {
    return element;
  } 
  else 
  {
    sessionStorage.setItem('locationBeforeAuthRedirect', window.location.href);
    return <Navigate to={'/'} replace />;
  }
}

export default ProtectedRoute;
