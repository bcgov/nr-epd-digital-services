import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router";
import { useLocation } from "react-router-dom";

export type ProtectedRouteProps = {
  element: JSX.Element;
};

function ProtectedRoute({ element }: ProtectedRouteProps) {
  const auth = useAuth();
  const prevLocation = useLocation();
  if (auth.isLoading) {
    return <div>loading</div>;
  }
  if (auth.isAuthenticated) {    
    return element;
  } else {   
    sessionStorage.setItem('locationBeforeAuthRedirect',window.location.href);
    return <Navigate to={"/"} replace />;
  }
}

export default ProtectedRoute;
