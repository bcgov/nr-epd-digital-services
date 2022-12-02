import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate} from 'react-router-dom';
import { AppDispatch } from '../../Store';
import { fetchUserProfileVerification, isProfileVerified } from '../users/UsersSlice';

const Dashboard = () => {

  const dispatch = useDispatch<AppDispatch>();

  const userIsProfileVerifiedValue = useSelector(isProfileVerified);
  
   const navigate = useNavigate();
  
  // const lastVisitedURL = useSelector(getLastVisitedURL);

  // useEffect(()=>{
  //   if(lastVisitedURL!=''&&lastVisitedURL!=undefined)
  //   {
  //       navigate("/"+lastVisitedURL)
  //   }
  // },[lastVisitedURL])
 
  const auth = useAuth();
  console.log(auth.user?.access_token)

  useEffect(()=>{
    if(auth.user?.profile)
    {
      console.log("invoking action",auth.user.profile.sub)
      dispatch(fetchUserProfileVerification(auth.user.profile.sub));
    }
  },[])


  useEffect(()=>{

    console.log('isProfileVerified value at ' + new Date().getMinutes() + '--'+new Date().getSeconds(),userIsProfileVerifiedValue)

    if(userIsProfileVerifiedValue===false)
    {
      navigate("/userprofile")
    }

  },[userIsProfileVerifiedValue])



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
        {auth.isLoading ? <div>Loading User</div> : <div>{auth.user?.profile.email}</div>}
        <p></p>
    </div>
  )
}

export default Dashboard