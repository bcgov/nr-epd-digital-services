import { getAxiosInstance } from "@cats/helpers/utility";
import { HttpStatusCode } from "axios";


const COMS_API: string =  import.meta.env.VITE_COMS_API ||  ((window as any)._env_ && (window as any)._env_.VITE_COMS_API);
const S3_STORAGE_REGION: string =  import.meta.env.VITE_S3_STORAGE_REGION ||  ((window as any)._env_ && (window as any)._env_.VITE_S3_STORAGE_REGION);
const S3_STORAGE_BUCKET: string =  import.meta.env.VITE_S3_STORAGE_BUCKET ||  ((window as any)._env_ && (window as any)._env_.VITE_S3_STORAGE_BUCKET);
const S3_STORAGE_ENDPOINT: string =  import.meta.env.VITE_S3_STORAGE_ENDPOINT ||  ((window as any)._env_ && (window as any)._env_.VITE_S3_STORAGE_ENDPOINT);
const S3_STORAGE_ACCESS_KEY_ID: string =  import.meta.env.VITE_S3_STORAGE_ACCESS_KEY_ID ||  ((window as any)._env_ && (window as any)._env_.VITE_S3_STORAGE_ACCESS_KEY_ID);
const S3_STORAGE_SECRET_ACCESS_KEY: string =  import.meta.env.VITE_S3_STORAGE_SECRET_ACCESS_KEY ||  ((window as any)._env_ && (window as any)._env_.VITE_S3_STORAGE_SECRET_ACCESS_KEY);


type DownloadType = 'url' | 'proxy';

export const COMS_ENDPOINTS = {
  BUCKET: '/bucket',
  OBJECT: '/object',
  VERSION: '/version',
  CHILD: '/child',
  USER: '/user',
};

const CREATE_BUCKET_PARAMS = {
  accessKeyId: S3_STORAGE_ACCESS_KEY_ID,
  active: true,
  bucket: S3_STORAGE_BUCKET,
  endpoint: S3_STORAGE_ENDPOINT,
  region: S3_STORAGE_REGION,
  secretAccessKey: S3_STORAGE_SECRET_ACCESS_KEY,
};

export const createBucket = async (bucketName: string, bucketKey: string) => {
  try {
    const params = {
      ...CREATE_BUCKET_PARAMS,
      bucketName: bucketName,
      key: bucketKey,
    };
    const response = await getAxiosInstance(COMS_API).put(
      COMS_ENDPOINTS.BUCKET,
      params,
    );
    // Check if the response has data and return it
    if (response?.data) {
      return response.data; // Return the response data to the calling method
    }
  } catch (error) {
    console.error(`Error: Uploading Document-createBucket: ${error}`);
    throw error;
  }
};

export const deleteBucket = async (bucketId: string) => {
  try {
    const response = await getAxiosInstance(COMS_API).delete(
      `${COMS_ENDPOINTS.BUCKET}/${bucketId}`,
    );

    // Check if the response has data and return it
    if (response?.data) {
      return response.data; // Return the response data to the calling method
    }
  } catch (error) {
    console.error('Error in deleting bucket:', error);
    throw error;
  }
};

export const createObject = async (bucketId: string, file: any) => {
  try {
    const config = {
      headers: {
        'Content-Disposition': setDispositionHeader(file.name),
        'Content-Type': file?.type ?? 'application/octet-stream',
      },
      params: {
        bucketId: bucketId,
      },
    };

    const response = await getAxiosInstance(COMS_API).put(
      COMS_ENDPOINTS.OBJECT,
      file,
      config,
    );

    // Check if the response has data and return it
    if (response?.data) {
      return response.data; // Return the response data to the calling method
    }
  } catch (error: any) {
    if (error?.response?.status === HttpStatusCode.Conflict) {
      return error?.response;
    } else {
      console.error(`Error: Uploading Document createObject: ${error}`);
      throw error;
    }
  }
};

export const getObject = async (
  objectId: string,
  downloadType: DownloadType = 'url',
) => {
  try {
    // Initialize configuration and params
    const params: any = { download: downloadType }; // Always include the download type in params
    const config: any = {}; // Configuration object for axios

    // Adjust the configuration based on the download type
    if (downloadType === 'proxy') {
      config.responseType = 'blob'; // For 'proxy', set responseType to 'blob'
    }

    // Make the request using the appropriate configuration and params
    const response = await getAxiosInstance(COMS_API).get(
      `${COMS_ENDPOINTS.OBJECT}/${objectId}`,
      { params, ...config },
    );

    // Check if the response has data and return it
    if (response?.data) {
      return response.data; // Return the response data (it will be a Blob if 'proxy')
    }
  } catch (error) {
    console.error('Error in getting object details:', error);
    throw error;
  }
};

export const setFilePublic = async (objectId: string) => {
  try {
    // Define query parameters dynamically
    const queryParams = {
      public: true, // This is the query parameter: ?public=true
    };

    // Construct the URL
    const url = `${COMS_ENDPOINTS.OBJECT}/${objectId}/public`;

    // Send the PATCH request using Axios
    const response = await getAxiosInstance(COMS_API).patch(url, null, {
      params: queryParams,
    });

    // Check if the response contains data and return it
    if (response?.data) {
      return response.data; // Return the response data to the calling method
    }
  } catch (error: any) {
    // Improved error handling
    console.error(
      `Error in makeFilePublic for objectId ${objectId}: ${error?.response?.data?.message || error.message || error}`,
    );
    throw error; // Re-throw the error for the calling function to handle
  }
};

export const deleteObject = async (objectId: string, objVersion?: string) => {
  try {
    let params: any = {};
    if (objVersion) {
      params = { s3VersionId: objVersion };
    }
    const DELETE_OBJECT_ENDPOINT = `${COMS_ENDPOINTS.OBJECT}/${objectId}`;
    const response = await getAxiosInstance(COMS_API).delete(
      DELETE_OBJECT_ENDPOINT,
      { params },
    );

    // Check if the response has data and return it
    if (response?.data) {
      return response.data; // Return the response data to the calling method
    }
  } catch (error) {
    console.error('Error in deleting object:', error);
    throw error;
  }
};

/**
 * @function setDispositionHeader
 * Constructs a valid RFC 6266 'Content-Disposition' header
 * and optionally handles RFC 8187 UTF-8 encoding when necessary
 * @param  {string} filename The file name to check if encoding is needed
 * @returns {string} The value for the key 'Content-Disposition'
 */
export function setDispositionHeader(filename: string) {
  const dispositionHeader = `attachment; filename="${filename}"`;
  const encodedFilename = encodeURIComponent(filename).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );

  if (filename === encodedFilename) {
    return dispositionHeader;
  } else {
    return dispositionHeader.concat(`; filename*=UTF-8''${encodedFilename}`);
  }
}