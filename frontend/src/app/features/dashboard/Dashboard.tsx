import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getLastVisitedURL } from '../applications/ApplicationSlice';


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