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
  const [actualTaskId, setActualTaskId] = React.useState<string | null>(null);
  const [userType, setUserType] = React.useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      const containsUstp = taskId.includes("&ustp=so");
      const cleanTaskId = containsUstp ? taskId.split("&ustp=so")[0] : taskId;
      if (containsUstp) setUserType("so");
      setActualTaskId(cleanTaskId);
    }
  }, [taskId]);

  const API: string =
    import.meta.env.VITE_BACKEND_USERS_API ||
    ((window as any)._env_ && (window as any)._env_.VITE_BACKEND_USERS_API);

  const FORMS_URL: string =
    import.meta.env.VITE_FORMS_URL ||
    ((window as any)._env_ && (window as any)._env_.VITE_FORMS_URL);

  const assignTaskToUser = () => {
    getAxiosInstanceForCamunda()
      .post(actualTaskId + "/claim", {
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
    console.log("taskId", taskId);
    let endPoint = "";

    if (actualTaskId === undefined || actualTaskId === null) {
      return;
    }

    if (userType === "so") {
      endPoint = "/addUserToGroupForSiteOwners";
    } else {
      endPoint = "/addUserToGroupForMuncipalUsers";
    }

    getAxiosInstanceForUsers()
      .post(API + USERS + endPoint, {
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
    if (
      auth.user?.profile.identity_provider === "bceid" &&
      actualTaskId !== null
    ) {
      sessionStorage.removeItem("locationBeforeAuthRedirect");
      assignKeyCloakGroupToUser();
    } else if (
      auth.isAuthenticated &&
      actualTaskId !== null &&
      auth.user?.profile.identity_provider !== "bceid"
    ) {
      alert(
        "You are not logged in using BCeID. Please close this window and try again using BCeID."
      );
    }
  }, [actualTaskId]);

  return <div className="mt-3 pt-5 container-fluid">Please wait ...</div>;
};

export default TaskAssignment;
