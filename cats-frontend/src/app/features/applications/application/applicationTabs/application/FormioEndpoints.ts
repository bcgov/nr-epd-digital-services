import { getAxiosInstance, getUser } from '../../../../../helpers/utility';

const FORM_API: string =
  import.meta.env.VITE_FORM_API || window._env_.VITE_FORM_API;
const FORM_BACKEND_API: string =
  import.meta.env.VITE_FORM_BACKEND_API || window._env_.VITE_FORM_BACKEND_API;
const FORM_FLOW_API: string =
  import.meta.env.VITE_FORM_FLOW_API || window._env_.VITE_FORM_FLOW_API;
const COMS_ENDPOINTS = {
  FORM: '/form',
  SUBMISSION: '/submission',
  BUNDLES: '/bundles',
  FORMIO: '/formio',
  ROLES: '/roles',
};

/**
 * @description Fetches the details of a form based on the form ID from the Forms API.
 * @param {string} [formId] - The ID of the form to retrieve the details of
 * @returns {Promise<AxiosResponse<FormioForm>>} - A promise that resolves to the form details
 * @throws {Error} - If there is an error while fetching the form details
 */
export const getFormDetails = async (formId?: string) => {
  try {
    const GET_FORM_ENDPOINT = `${COMS_ENDPOINTS.FORM}/formid/${formId}`;
    const response = await getAxiosInstance(FORM_API).get(GET_FORM_ENDPOINT);

    // Check if the response has data and return it
    if (response?.data) {
      return response; // Return the response data to the calling method
    }
  } catch (error) {
    console.error('Error in getting form details:', error);
    throw error;
  }
};

/**
 * @description Fetches the details of a form based on the form ID from the FormFlow API.
 * @param {string} [formId] - The ID of the form to retrieve the details of
 * @returns {Promise<AxiosResponse<FormioForm>>} - A promise that resolves to the form details
 * @throws {Error} - If there is an error while fetching the form details
 */
export const getApplicationForm = async (formId?: string) => {
  try {
    const token = await getToken();
    const GET_FORM_ENDPOINT = `${COMS_ENDPOINTS.FORM}/${formId}`;
    const response = await getAxiosInstance(FORM_FLOW_API, {
      Accept: 'application/json',
      'X-Jwt-Token': token?.headers['x-jwt-token'],
    }).get(GET_FORM_ENDPOINT);

    // Check if the response has data and return it
    if (response?.data) {
      return response; // Return the response data to the calling method
    }
  } catch (error) {
    console.error('Error in getting application details:', error);
    throw error;
  }
};

/**
 * @description Fetches the form data for a given form ID and submission ID from the FormFlow API.
 * @param {string} formId - The ID of the form to retrieve the data of
 * @param {string} submissionId - The ID of the submission to retrieve the data of
 * @returns {Promise<AxiosResponse<FormioSubmission>>} - A promise that resolves to the form submission data
 * @throws {Error} - If there is an error while fetching the form data
 */
export const getApplicationFormData = async (
  formId: string,
  submissionId: string,
) => {
  try {
    const FORM_SUBMISSION_ENDPOINT = `${COMS_ENDPOINTS.FORM}/${formId}${COMS_ENDPOINTS.SUBMISSION}/${submissionId}`;
    const response = await getAxiosInstance(FORM_BACKEND_API).get(
      FORM_SUBMISSION_ENDPOINT,
    );

    // Check if the response has data and return it
    if (response?.data) {
      return response; // Return the response data to the calling method
    }
  } catch (error) {
    console.error('Error in getting application details:', error);
    throw error;
  }
};

/**
 * @description Fetches the forms belonging to a given bundle ID from the FormFlow API.
 * @param {string} mapperId - The ID of the bundle to retrieve the forms of
 * @returns {Promise<AxiosResponse<FormioForm[]>>} - A promise that resolves to the array of form data
 * @throws {Error} - If there is an error while fetching the forms
 */

export const getBundleForms = async (mapperId: any) => {
  try {
    const GET_BUNDLE_ENDPOINT = `${COMS_ENDPOINTS.FORM}/${mapperId}${COMS_ENDPOINTS.BUNDLES}`;
    const response = await getAxiosInstance(FORM_API).get(GET_BUNDLE_ENDPOINT);

    // Check if the response has data and return it
    if (response?.data) {
      return response; // Return the response data to the calling method
    }
  } catch (error) {
    console.error('Error in getting application details:', error);
    throw error;
  }
};

/**
 * @description Fetches a token for the Formio API from the Forms API.
 * @returns {Promise<AxiosResponse<any>>} - A promise that resolves to the token data
 * @throws {Error} - If there is an error while fetching the token
 */

export const getToken = async () => {
  try {
    const GET_TOKEN_ENDPOINT = `${COMS_ENDPOINTS.FORMIO}${COMS_ENDPOINTS.ROLES}`;
    const response = await getAxiosInstance(FORM_API).get(GET_TOKEN_ENDPOINT);

    // Check if the response has data and return it
    if (response?.data) {
      return response; // Return the response data to the calling method
    }
  } catch (error) {
    console.error('Error in getting application details:', error);
    throw error;
  }
};
