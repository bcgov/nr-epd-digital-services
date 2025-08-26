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
import {
  getAxiosInstanceForComs,
  getAxiosInstanceForUsers,
} from "../../helpers/utility";
import { COMS, USERS } from "../../helpers/endpoints";

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

  const BCeID = "bceid";
  const BCSC = "bcsc";
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

  useEffect(() => {
    if (
      auth.user?.profile.identity_provider === BCeID ||
      auth.user?.profile.identity_provider === BCSC
    ) {
      assignGroupToUser();
      assignUserToBCbox();
    }
  }, []);

  const assignGroupToUser = () => {
    getAxiosInstanceForUsers()
      .post(USERS + "/addGroup", {
        userId: auth.user?.profile.sub,
      })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // const assignGroupToUser = () => {
  //   getAxiosInstanceForUsers()
  //     .post("/addGroup", {
  //       userId: auth.user?.profile.sub,
  //     })
  //     .then((response) => {
  //       if (response.data.success) {
  //         console.log(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };

  const assignUserToBCbox = () => {
    try {
      // Get the user's identity ID from auth.user.profile.sub
      const identityId = auth.user?.profile.sub;

      if (!identityId) {
        throw new Error("User identity ID is missing.");
      }
      // Make the Axios GET request with value in the query string
      getAxiosInstanceForComs()
        .get(COMS, {
          params: {
            identityId: auth.user?.profile.sub,
          },
        })
        .then((response) => {
          if (response.data) {
            console.info("Assign user to BCbox successfully.");
          } else {
            throw new Error("Failed to assign user to BCbox.");
          }
        })
        .catch((error) => {
          // Handle errors
          console.error("Error assigning user to BCbox:", error.message);
        });
    } catch (error: any) {
      // Handle errors
      console.error("Error assigning user to BCbox:", error.message);
    }
  };

  const handleFormsflowWebRedirection = () => {
    console.log("handleFormsflowWebRedirection");
    const formsFlowWebURL =
      import.meta.env.VITE_FORMSFLOW_WEB_URL ||
      ((window as any)._env_ && (window as any)._env_.VITE_FORMSFLOW_WEB_URL) ||
      "";
    const locationBeforeAuthRedirect = sessionStorage.getItem(
      "locationBeforeAuthRedirect"
    );
    if (
      locationBeforeAuthRedirect !== "" &&
      locationBeforeAuthRedirect !== null &&
      locationBeforeAuthRedirect.indexOf("/fileupload") !== -1
    ) {
      window.location.assign(locationBeforeAuthRedirect);
    } else {
      window.location.assign(locationBeforeAuthRedirect ?? formsFlowWebURL);
    }
  };
  //Automatically redirect to formsflow dashboard, don't render dashboard prototype
  handleFormsflowWebRedirection();

  const validUserRole = (rolename: string) => {
    const realmRoles: string[] = auth.user?.profile.realmroles as string[];
    if (realmRoles != null && realmRoles.length > 0) {
      return realmRoles.includes(rolename);
    }
    return false;
  };

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
                <input
                  type="button"
                  className="btn btn-success"
                  value="View/Submit Application"
                  onClick={() => handleFormsflowWebRedirection()}
                ></input>
              </div>
            </div>
          ) : validUserRole(getSDMUserRole()) ? (
            <SdmDashboard></SdmDashboard>
          ) : (
            <ReviewerDashoard></ReviewerDashoard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
