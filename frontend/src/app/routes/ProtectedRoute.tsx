import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router";

export type ProtectedRouteProps = {
  element: JSX.Element;
};

function ProtectedRoute({ element }: ProtectedRouteProps) {
  const auth = useAuth();
  if (auth.isLoading) {
    return <div>loading</div>;
  }
  if (auth.isAuthenticated) {
    return element;
  } else {
    return <Navigate to={"/"} replace />;
  }
}

export default ProtectedRoute;
