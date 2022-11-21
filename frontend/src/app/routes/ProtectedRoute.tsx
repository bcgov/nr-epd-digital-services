import { useAuth } from "react-oidc-context";
import { Navigate} from "react-router";


export type ProtectedRouteProps = {
    element: JSX.Element
    
}

function ProtectedRoute({element}: ProtectedRouteProps) {
        const {isAuthenticated} = useAuth()
        if(isAuthenticated){
            return element
        }else{
            return <Navigate to={"/"} replace/>
        }
    }

export default ProtectedRoute