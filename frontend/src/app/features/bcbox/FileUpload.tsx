// Needs to be moved to utility class later
import axios from "axios";
import { useState } from "react";
import { getUser } from "../../helpers/utility";
import { useEffect } from "react";
import { builtinModules } from "module";
import { useAuth } from "react-oidc-context";

export const FileUpload = () => {
  const auth = useAuth();
  const [bucketId, setBucketId] = useState("");
  const [fileToUpload, setFileToUpload] = useState();
  const [appId, setAppId] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

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
      setIsDisabled(true);
      window.close();
      //return;
    } else {
      setIsDisabled(false);
    }
  }, []);

  console.log(auth);

  const bcBoxBaseURL =
    process.env.REACT_APP_BCBOX_BASE_URL ||
    ((window as any)._env_ && (window as any)._env_.REACT_APP_BCBOX_BASE_URL);
  const bcBoxBucketURL =
    process.env.REACT_APP_BCBOX_BUCKET_URL ||
    ((window as any)._env_ && (window as any)._env_.REACT_APP_BCBOX_BUCKET_URL);
  const token = getUser()?.access_token;

  const findUserEmail =
    process.env.REACT_APP_BCBOX_FIND_USER_ENDPOINT ||
    ((window as any)._env_ &&
      (window as any)._env_.REACT_APP_BCBOX_FIND_USER_ENDPOINT);
  const setBucketPermission =
    process.env.REACT_APP_BCBOX_SET_USER_PERMISSION ||
    ((window as any)._env_ &&
      (window as any)._env_.REACT_APP_BCBOX_SET_USER_PERMISSION);
  const fileUploadEndpoint =
    process.env.REACT_APP_BCBOX_FILE_UPLOAD_ENDPOINT ||
    ((window as any)._env_ &&
      (window as any)._env_.REACT_APP_BCBOX_FILE_UPLOAD_ENDPOINT);

  // const bcBoxBaseURL = "http://localhost:4050";
  // const bcBoxBucketURL = "/api/v1/bucket";

  // const findUserEmail = "api/v1/user?email=";

  // const setBucketPermission = "/api/v1/permission/bucket/";

  // const fileUploadEndpoint = "api/v1/object?bucketId=";

  const accessKeyId =
    process.env.REACT_APP_COMS_ACCESS_KEY_ID ||
    ((window as any)._env_ &&
      (window as any)._env_.REACT_APP_COMS_ACCESS_KEY_ID);
  const bucket =
    process.env.REACT_APP_COMS_BUCKET ||
    ((window as any)._env_ && (window as any)._env_.REACT_APP_COMS_BUCKET);
  const comsEndPoint =
    process.env.REACT_APP_COMS_ENDPOINT ||
    ((window as any)._env_ && (window as any)._env_.REACT_APP_COMS_ENDPOINT);
  const comsAccessKey =
    process.env.REACT_APP_COMS_ACCESS_KEY ||
    ((window as any)._env_ && (window as any)._env_.REACT_APP_COMS_ACCESS_KEY);
  const comsAccessRegion =
    process.env.REACT_APP_COMS_ACCESS_REGION ||
    ((window as any)._env_ &&
      (window as any)._env_.REACT_APP_COMS_ACCESS_REGION);

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
              setBucketId(result.data.bucketId);
          },
          (error) => {
            alert("Unable to Proceed. Please try again.");
            setIsDisabled(true);
          }
        );
    }
  }, [appId]);

  useEffect(() => {
    if (bucketId !== "" && bucketId !== null) {
      axiosInstance.get(findUserEmail + auth?.user?.profile.email).then(
        (result) => {
          console.log(result);
          result.data.forEach((user: any) => {
            console.log(user);

            axiosInstance.put(bcBoxBaseURL + setBucketPermission + bucketId, [
              {
                permCode: "CREATE",
                userId: user.userId,
              },
            ]);
          });
        },
        (error) => {
          alert("Unable to find user in BCBOX cannot proceed.");
          setIsDisabled(true);
        }
      );
    }
  }, [bucketId]);

  const axiosInstance = axios.create({
    baseURL: bcBoxBaseURL,
    timeout: 1000,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  const axiosInstanceToFileUpload = axios.create({
    baseURL: bcBoxBaseURL,
    timeout: 1000,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "text/plain",
      "Content-Disposition": 'attachment; filename="' + fileName + '"',
    },
  });

  const uploadFile = (event: any) => {
    console.log("upload file", event.target.files);
    setFileToUpload(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const uploadFileSubmit = (event: any) => {
    if (bucketId !== null && bucketId !== "")
      axiosInstanceToFileUpload
        .put(
          fileUploadEndpoint + bucketId,
          window.URL.createObjectURL(fileToUpload)
        )
        .then(
          (result) => {
            console.log("file upload", result);
            alert("File successfully upload.");
            window.close();
          },
          (error) => {
            console.log("file upload", error);
            if (error.response.status === 409) {
              alert("File already exists.");
            } else {
              alert("Failed to upload.");
            }
          }
        );
    else alert("Unable to find application upload location");
    //setFileToUpload( event.target.files[0]);
  };

  return (
    <div style={{ marginTop: "65px" }}>
      <div hidden={!isDisabled}>
        {" "}
        <b> You are not allowed to use this functionality </b>
      </div>
      <input
        disabled={isDisabled}
        type="file"
        onChange={(e) => {
          uploadFile(e);
        }}
      ></input>
      <div>
        <input
          disabled={isDisabled}
          className="btn btn-success"
          type="button"
          value="Upload File"
          onClick={(e) => {
            uploadFileSubmit(e);
          }}
        />
      </div>
    </div>
  );
};
