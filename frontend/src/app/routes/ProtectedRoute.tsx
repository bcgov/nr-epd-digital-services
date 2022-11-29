import { useAuth } from "react-oidc-context";
import { Navigate} from "react-router";


export type ProtectedRouteProps = {
    element: JSX.Element,    
}

function ProtectedRoute({element}: ProtectedRouteProps) {
    const auth = useAuth()
    console.log(element.type)
        if(auth.isLoading){
            return <div>loading</div>
        }
        if(auth.isAuthenticated){
            return element
        }else{
            console.log("Not authenticated")
            return <Navigate to={"/"} replace/>
        }
    }

export default ProtectedRoute