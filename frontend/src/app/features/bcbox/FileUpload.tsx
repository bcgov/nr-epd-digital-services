// Needs to be moved to utility class later
import axios from "axios";
import { useState } from "react";
import { getUser } from "../../helpers/utility";
import { useEffect } from "react";
import { builtinModules } from "module";

export const FileUpload = () => {
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const applicationId = urlParams.get("appId");
    setAppId(applicationId as string);
  }, []);

  const [bucketId, setBucketId] = useState("");
  const [fileToUpload, setFileToUpload] = useState();
  const [appId, setAppId] = useState("");
  const [fileName, setFileName] = useState("");

  const bcBoxBaseURL = "http://localhost:4050";
  const bcBoxBucketURL = "/api/v1/bucket";
  const token = getUser()?.access_token;

  const findUserEmail = "api/v1/user?email=";

  const setBucketPermission = "http://localhost:4050/api/v1/permission/bucket/";

  const fileUploadEndpoint = "api/v1/object?bucketId=";



  useEffect(() => {
    if (appId !== "") {
      axiosInstance
        .put(bcBoxBucketURL, {
          accessKeyId: "nr-srs-dlv",
          active: true,
          bucket: "vkophq",
          bucketName: "application/" + appId,
          endpoint: "https://nrs.objectstore.gov.bc.ca",
          region: "ca-central-1",
          secretAccessKey: "Ht53nIvXzmc7eGFcQwoP+0UsWWiATHeV/dW67gHO",
          key: "application/" + appId,
        })
        .then((result) => {
          console.log(result);
          if (result.data != null && result.data.bucketId != "")
            setBucketId(result.data.bucketId);
        });
    }
  }, [appId]);

  useEffect(() => {
    if (bucketId !== "" && bucketId !== null) {
      axiosInstance
        .get(findUserEmail + "midhun.murali@aot-technologies.com")
        .then((result) => {
          console.log(result);
          result.data.forEach((user: any) => {
            console.log(user);

            axiosInstance.put(setBucketPermission + bucketId, [
              {
                permCode: "CREATE",
                userId: user.userId,
              },
            ]);
          });
        });
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
      "Content-Disposition":
        "attachment; filename=\""+fileName+"\"",
    },
  });

  const uploadFile = (event: any) => {
    console.log("upload file", event.target.files);
    setFileToUpload(event.target.files[0]);
    setFileName(event.target.files[0].name)
  };

  const uploadFileSubmit = (event: any) => {
    if (bucketId !== null && bucketId !== "")
      axiosInstanceToFileUpload
        .put(
          fileUploadEndpoint + bucketId,
          window.URL.createObjectURL(fileToUpload)
        )
        .then((result) => {
          console.log("file upload", result);
          alert('File successfully upload.')
        });
    else alert("Unable to find application upload location");
    //setFileToUpload( event.target.files[0]);
  };

  return (
    <div style={{ marginTop: "65px" }}>
      <h2>Please Upload File To Your Application # {appId} </h2>
      <input
        type="file"
        onChange={(e) => {
          uploadFile(e);
        }}
      ></input>
      <div>
        <input
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
