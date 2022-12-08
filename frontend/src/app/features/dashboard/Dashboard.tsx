import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../Store";
import {
  fetchUserProfileVerification,
  isProfileVerified,
} from "../users/UsersSlice";
import { toast } from "react-toastify";
import "./Dashboard.css";

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

  useEffect(() => {
    if (
      auth.user?.profile &&
      auth.user?.profile.identity_provider === "bceid"
    ) {
      dispatch(fetchUserProfileVerification(auth.user.profile.sub));
    }
  }, []);

  useEffect(() => {
    if (
      userIsProfileVerifiedValue === false &&
      auth.user?.profile.identity_provider === "bceid"
    ) {
      navigate("/profile");
    }
  }, [userIsProfileVerifiedValue]);

  return (
    <div className="container-fluid dashboard-content">
      <div className="row">
        <div className="col-12 ">
          {auth.isLoading ? (
            <div>Loading User</div>
          ) : auth.user?.profile.identity_provider === "bceid" ? (
            <h1>External User Dashboard</h1>
          ) : (
            <h1> Internal User Dashboard</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
