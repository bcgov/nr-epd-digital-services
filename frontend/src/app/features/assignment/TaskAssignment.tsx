import React, { useEffect } from "react";
import {
  getAxiosInstanceForCamunda,
  getAxiosInstanceForUsers,
} from "../../helpers/utility";
import { useParams } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { USERS } from "../../helpers/endpoints";

const TaskAssignment = () => {
  const auth = useAuth();
  const { taskId } = useParams();

  const API: string =
    process.env.REACT_APP_BACKEND_USERS_API ||
    ((window as any)._env_ &&
      (window as any)._env_.REACT_APP_BACKEND_USERS_API);

  const FORMS_URL: string =
    process.env.REACT_APP_FORMS_URL ||
    ((window as any)._env_ && (window as any)._env_.REACT_APP_FORMS_URL);

  const assignTaskToUser = () => {
    getAxiosInstanceForCamunda()
      .post(taskId + "/claim", {
        userId: auth.user?.profile.preferred_username,
      })
      .then((response) => {
        window.location.href = FORMS_URL;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const assignKeyCloakGroupToUser = () => {
    getAxiosInstanceForUsers()
      .post(API + USERS + "/addUserToGroupForMuncipalUsers", {
        userId: auth.user?.profile.sub,
      })
      .then((response) => {
        if (response.data.success) {
          assignTaskToUser();
        } else {
          alert("Please try again or contact support.");
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
