import { useAuth } from 'react-oidc-context';
import { Link} from 'react-router-dom';

const Dashboard = () => {
  
  // const navigate = useNavigate();
  
  // const lastVisitedURL = useSelector(getLastVisitedURL);

  // useEffect(()=>{
  //   if(lastVisitedURL!=''&&lastVisitedURL!=undefined)
  //   {
  //       navigate("/"+lastVisitedURL)
  //   }
  // },[lastVisitedURL])
 
  const auth = useAuth();
  console.log(auth.user?.profile)
  return (

    <div>
        <ul>
            <li>
                <Link to="/users"> List of Users </Link>
            </li>
            <li>
                <Link to="/users/add"> Add New User </Link>
            </li>
        </ul>
        { auth.isLoading ? <div>Loading User</div> : <div>{auth.user?.profile.email}</div>}
        <p></p>
    </div>
  )
}

export default Dashboard