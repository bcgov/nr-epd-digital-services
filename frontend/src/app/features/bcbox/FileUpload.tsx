// Needs to be moved to utility class later
import axios from "axios";
import { useState } from "react";


export const FileUpload = () => {


    const [bucketId,setBucketId] = useState('');
    const [fileToUpload,setFileToUpload] = useState();


    const bcBoxBaseURL =  "https://coms.api.gov.bc.ca";
    const bcBoxBucketURL = "/api/v1/bucket";
    const token = "";
  
    const findUserEmail = "api/v1/user?email=";

    const setBucketPermission = "https://coms.api.gov.bc.ca/api/v1/permission/bucket/";

    const fileUploadEndpoint= "api/v1/object?bucketId=";

    
    const axiosInstance =   axios.create({
        baseURL: bcBoxBaseURL,
        timeout: 1000,
        headers: {
        'Authorization': 'Bearer '+token,
        'Content-Type':'application/json'
        }
      });

      const axiosInstanceToFileUpload =   axios.create({
        baseURL: bcBoxBaseURL,
        timeout: 1000,
        headers: {
        'Authorization': 'Bearer '+token,
        'Content-Type':'text/plain',
        'Content-Disposition':"attachment; filename=latest2_bin.txt; filename*=UTF-8''latest2_bin.txt'"
        }
      });
  
    const createBucket = () => {
        console.log("create bucket");


          axiosInstance.put(bcBoxBucketURL,{
            "accessKeyId": "nr-srs-dlv",
            "active": true,
            "bucket": "vkophq",
            "bucketName": "application/06NOV1133",
            "endpoint": "https://nrs.objectstore.gov.bc.ca",
            "region": "ca-central-1",
            "secretAccessKey": "Ht53nIvXzmc7eGFcQwoP+0UsWWiATHeV/dW67gHO",
            "key": "application/06NOV1133"
          }).then((result)=>{
            console.log(result);
            if(result.data!=null && result.data.bucketId != '')
            setBucketId(result.data.bucketId);
          });

    }

    const findUser = () => {
        console.log("find user");
        axiosInstance.get(findUserEmail+"midhun.murali@aot-technologies.com").then((result)=>{
            console.log(result);
            result.data.forEach((user:any)=>{
             console.log(user)

             axiosInstance.put(setBucketPermission + bucketId,[{
                "permCode": "CREATE",
                "userId": user.userId
              }])
           
            
            })}            
        );
    }

    const uploadFile = (event:any) =>{
        console.log("upload file", event.target.files);
        setFileToUpload( event.target.files[0]);
    }

    const uploadFileSubmit = (event:any) =>{
        console.log("upload file", fileToUpload);
        //setFileToUpload( event.target.files[0]);

        axiosInstanceToFileUpload.put(fileUploadEndpoint+bucketId, window.URL.createObjectURL(fileToUpload)).then((result)=>{
            console.log('file upload',result);
          
          });
    }
  
    return (
    <div style={{ "margin-top": "65px" }}>
      <h2>Upload Files To Your Applications</h2>
      <input type="file" onChange={(e)=>{uploadFile(e)}}></input>
      <div>
        <input type="button" value="Create Bucket" onClick={()=>{createBucket()}}/>
        <br/>
        <input type="button" value="Find User"  onClick={()=>{findUser()}} />
        <br/>
        <input type="button" value="Upload File" onClick={(e)=>{uploadFileSubmit(e)}}  />
      </div>
    </div>
  );
};
