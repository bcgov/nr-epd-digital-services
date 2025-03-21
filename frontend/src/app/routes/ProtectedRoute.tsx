import { useAuth } from "react-oidc-context";
import { useParams, Navigate } from "react-router";
import { useLocation } from "react-router-dom";

export type ProtectedRouteProps = {
  element: JSX.Element;
};

function ProtectedRoute({ element }: ProtectedRouteProps) {
  const auth = useAuth();
  const prevLocation = useLocation();
  let { taskId } = useParams();
  if (auth.isLoading) {
    return <div>loading</div>;
  }
  if (auth.isAuthenticated) {
    return element;
  } else {
    sessionStorage.setItem("locationBeforeAuthRedirect", window.location.href);
    if (taskId !== undefined && taskId !== null) {
      return <Navigate to={"/redirect/bceid"} replace />;
    } else {
      return <Navigate to={"/"} replace />;
    }
  }
}

export default ProtectedRoute;
