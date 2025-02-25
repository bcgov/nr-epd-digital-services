import React, { useEffect } from "react";
import {
  getAxiosInstanceForCamunda,
  getAxiosInstanceForUsers,
} from "../../helpers/utility";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { USERS } from "../../helpers/endpoints";

const TaskAssignment = () => {
  const auth = useAuth();
  const { taskId } = useParams();
  const navigate = useNavigate();

  const API: string =
    process.env.REACT_APP_BACKEND_USERS_API ||
    ((window as any)._env_ &&
      (window as any)._env_.REACT_APP_BACKEND_USERS_API);

  const assignTaskToUser = () => {
    console.log(auth.user);
    getAxiosInstanceForCamunda()
      .post(taskId + "/claim", {
        userId: auth.user?.profile.preferred_username,
      })
      .then((response) => {
        window.location.href =
          "https://forms-flow-web-root-config-dev.apps.silver.devops.gov.bc.ca/";
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const assignKeyCloakGroupToUser = () => {
    getAxiosInstanceForUsers()
      .post(API + "/addUserToGroupForMuncipalUsers", {
        userId: auth.user?.profile.sub,
      })
      .then((response) => {
        if (response.data.success) {
          //console.log(response.data.message);
          assignTaskToUser();
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    assignKeyCloakGroupToUser();
  }, []);

  return <div className="mt-3 pt-5 container-fluid">Please wait ...</div>;
};

export default TaskAssignment;
