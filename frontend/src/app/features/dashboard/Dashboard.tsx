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
    </div>
  )
}

export default Dashboard