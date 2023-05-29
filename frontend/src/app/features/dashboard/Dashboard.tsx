import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../Store";
import {
  fetchUserProfileVerification,
  isProfileVerified,
} from "../users/UsersSlice";
import "./Dashboard.css";
import { SdmDashboard } from "./sdmDashboard/SdmDashboard";
import { ReviewerDashoard } from "./reviewerDashboard/ReviewerDashoard";
import { getSDMUserRole } from "../../helpers/envManager";

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


  const handleFormsflowWebRedirection = () => {
    const formsFlowWebURL = process.env.REACT_APP_FORMSFLOW_WEB_URL || ((window as any)._env_ && (window as any)._env_.REACT_APP_FORMSFLOW_WEB_URL) || "";

    window.location.assign(formsFlowWebURL);

  }
  //Automatically redirect to formsflow dashboard, don't render dashboard prototype
  handleFormsflowWebRedirection()

  const validUserRole = (rolename:string)=>{
    const realmRoles:string[] = auth.user?.profile.realmroles as string[];
    if(realmRoles!=null && realmRoles.length > 0 )
    {
      return realmRoles.includes(rolename);
    }
    return false;
  }

  return (
    <div className="container-fluid dashboard-content">
      <div className="row">
        <div className="col-12">
          {auth.isLoading ? (
            <div>Loading User</div>
          ) : auth.user?.profile.identity_provider === "bceid" ? (
          
            <div>
            <h3>External User Dashboard</h3>
            <div>
            <input type="button" className="btn btn-success" value="View/Submit Application" onClick={()=>handleFormsflowWebRedirection()}></input>
          </div>
          </div> 
          ) : (

           validUserRole(getSDMUserRole()) ? (<SdmDashboard></SdmDashboard>):(
              <ReviewerDashoard></ReviewerDashoard>
           )
                
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
