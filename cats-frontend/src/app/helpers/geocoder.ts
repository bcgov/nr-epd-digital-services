import axios, { AxiosResponse, AxiosError, Method } from 'axios';
import { GEOCODER_API } from './endpoints';

// Set up axios instance for default configuration
const axiosInstance = axios.create({
  baseURL: GEOCODER_API,
});

// General API call function
export const apiCall = async <T>(
  url: string,
  method: Method,
  data?: object,
  headers?: object,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url,
      method,
      data,
      headers: headers || {},
    });
    return response.data;
  } catch (error) {
    // Handle error gracefully
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      console.error(`Error: ${err.message}`, err.response?.data);
      throw err.response?.data || err.message;
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
};

// Example GET request to fetch users (id can be passed as a parameter in the URL)
export const getAddress = async (
  address: string,
  minScore: string = '50',
  maxResults: string = '5',
  echo: boolean = true,
  brief: boolean = true,
  autoComplete: boolean = true,
  exactSpelling: boolean = false,
  fuzzyMatch: boolean = false,
  locationDescriptor: string = 'parcelPoint',
): Promise<any> => {
  const url = `/addresses.json?minScore=${minScore}&maxResults=${maxResults}&echo=${echo}&brief=${brief}&autoComplete=${autoComplete}&exactSpelling=${exactSpelling}&fuzzyMatch=${fuzzyMatch}&locationDescriptor=${locationDescriptor}&addressString=${address}`;
  return apiCall<any>(url, 'GET');
};
