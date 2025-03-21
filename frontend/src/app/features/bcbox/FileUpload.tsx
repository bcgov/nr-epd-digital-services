// Needs to be moved to utility class later
import axios from "axios";
import { useState } from "react";
import { getUser } from "../../helpers/utility";
import { useEffect } from "react";
// import { builtinModules } from "module";
import { useAuth } from "react-oidc-context";

export const FileUpload = () => {
  const auth = useAuth();
  const [appId, setAppId] = useState("");
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const applicationId = urlParams.get("appId");
    setAppId(applicationId as string);

    if (
      auth != null &&
      auth.user != null &&
      auth.user.profile != null &&
      auth.user.profile.identity_provider !== "bceid"
    ) {
      alert("You are not allowed to use this functionality");
      window.close();
    } else {
    }
  }, []);

  console.log(auth);

  const bcBoxAPPUI =
    import.meta.env.VITE_BCBOX_APP_URL ||
    ((window as any)._env_ && (window as any)._env_.VITE_BCBOX_APP_URL);

  const bcBoxBaseURL =
    import.meta.env.VITE_BCBOX_BASE_URL ||
    ((window as any)._env_ && (window as any)._env_.VITE_BCBOX_BASE_URL);
  const bcBoxBucketURL =
    import.meta.env.VITE_BCBOX_BUCKET_URL ||
    ((window as any)._env_ && (window as any)._env_.VITE_BCBOX_BUCKET_URL);
  const token = getUser()?.access_token;

  const accessKeyId =
    import.meta.env.VITE_COMS_ACCESS_KEY_ID ||
    ((window as any)._env_ && (window as any)._env_.VITE_COMS_ACCESS_KEY_ID);
  const bucket =
    import.meta.env.VITE_COMS_BUCKET ||
    ((window as any)._env_ && (window as any)._env_.VITE_COMS_BUCKET);
  const comsEndPoint =
    import.meta.env.VITE_COMS_ENDPOINT ||
    ((window as any)._env_ && (window as any)._env_.VITE_COMS_ENDPOINT);
  const comsAccessKey =
    import.meta.env.VITE_COMS_ACCESS_KEY ||
    ((window as any)._env_ && (window as any)._env_.VITE_COMS_ACCESS_KEY);
  const comsAccessRegion =
    import.meta.env.VITE_COMS_ACCESS_REGION ||
    ((window as any)._env_ && (window as any)._env_.VITE_COMS_ACCESS_REGION);

  const axiosInstance = axios.create({
    baseURL: bcBoxBaseURL,
    timeout: 1000,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    if (appId !== "") {
      axiosInstance
        .put(bcBoxBucketURL, {
          accessKeyId: accessKeyId,
          active: true,
          bucket: bucket,
          bucketName: "application/" + appId,
          endpoint: comsEndPoint,
          region: comsAccessRegion,
          secretAccessKey: comsAccessKey,
          key: "application/" + appId,
        })
        .then(
          (result) => {
            console.log(result);
            if (result.data != null && result.data.bucketId != "")
              window.location.assign(
                bcBoxAPPUI + "/list/objects?bucketId=" + result.data.bucketId
              );
          },
          (error) => {
            alert("Unable to Proceed. Please try again.");
          }
        );
    }
  }, [appId]);

  return <div>Redirecting to BC BOX please wait</div>;
};
