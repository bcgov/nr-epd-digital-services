import { nanoid } from '@reduxjs/toolkit';
import { API } from './endpoints';
import axios from 'axios';
import { User } from 'oidc-client-ts';
import { getClientSettings } from '../auth/UserManagerSetting';
import { format, isValid } from 'date-fns';
import { UTCDate } from '@date-fns/utc';
import {
  FormFieldType,
  IFormField,
} from '../components/input-controls/IFormField';
import { RequestStatus } from './requests/status';
import { notifyError, notifySuccess } from '../components/alert/Alert';
import { TableColumn } from '../components/table/TableColumn';

// Define the type for the result cache
type ResultCache = {
  [key: string]: any; // Replace `any` with the actual type if known
};

// Cache to store fetched results
export const resultCache: ResultCache = {};

export interface UpdateDisplayTypeParams {
  indexToUpdate: number;
  updates: Partial<IFormField>; // Use Partial<IFormField> to allow partial updates
}

export const serializeDate = (data: any) => {
  const serializedData: any = { ...data };

  // Example: Serialize all Date objects to ISO string
  Object.keys(serializedData).forEach((key) => {
    if (serializedData[key] instanceof Date) {
      serializedData[key] = serializedData[key].toISOString();
    }
  });

  return serializedData;
};

export const formatDateRange = (
  range: [Date, Date],
  dateFormat: string = 'MMMM do, yyyy',
) => {
  const [startDate, endDate] = range;
  const formattedStartDate = format(startDate, dateFormat);
  const formattedEndDate = format(endDate, dateFormat);
  return `${formattedStartDate} - ${formattedEndDate}`;
};

//Normalize date returned in string format e.g. '2025-06-03' (string) will be normalized to 2025-06-03T00:00:00 local
export const parseLocalDate = (dateString: string) => {
   // Check if it's a full ISO string with time (UTC or timezone-aware)
   if (dateString.includes('T')) {
    const date = new Date(dateString);
    // Normalize to local midnight
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  //Handling edge case (for future-proofing)
  //If the server someday sends a non-standard format, e.g., '06/03/2025' or '03-Jun-2025', 
  //this function may break. So if you expect any non-ISO formats, you may want to do:
  if (!dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
    console.warn('Unexpected date format:', dateString);
    return new Date(dateString); // fallback
  }

  // Handle basic YYYY-MM-DD format
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d); // Local midnight
};

/* This creates a new Date object at midnight local time (00:00:00.000) for the selected day.
 It's a way to normalize the date without any timezone shifts caused by hours/minutes. */
export const normalizeDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatDate = (
  date: Date,
  dateFormat: string = 'MMMM do, yyyy',
) => {
  if (isValid(date)) {
    return format(date, dateFormat);
  }
  return '';
};

export const formatDateUTC = (
  date: Date | string,
  dateFormat: string = 'MMMM do, yyyy',
) => {
  const utcDate = new UTCDate(date);
  return formatDate(utcDate, dateFormat);
};

/*
Currently new Date() returns date in this format eg Fri Aug 16 2024 09:12:54 GMT-0700 (Pacific Daylight Time)
In our design we did not wanted to show the timezone name at the end thus this function helps to remove the timezone name present at the end
*/
export const formatDateWithNoTimzoneName = (date: Date) => {
  return date.toString().replace(/\s\([^)]+\)$/, '');
};

export const flattenFormRows = (arr: IFormField[][]): IFormField[] => {
  const flattened: IFormField[] = [];

  const flatten = (arr: IFormField[][]): void => {
    for (const item of arr) {
      for (const field of item) {
        if (field.type === FormFieldType.Group && field.children) {
          flattened.push(field);
          flatten([field.children]);
        } else {
          flattened.push(field);
        }
      }
    }
  };

  flatten(arr);
  return flattened;
};

// This should only be used outside of the <AuthContext> component tree (redux slice, axios calls, etc)
// In React components, use `const {user} = useAuth()`
export function getUser() {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:` +
      getClientSettings().authority +
      `:` +
      getClientSettings().client_id,
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export const consoleLog = (identifier: string, message: any) => {
  console.log(identifier, message);
};

export const generateRequestId = () => {
  return nanoid();
};

export const getAxiosInstance = (URL?: string, customHeaders?: any) => {
  const user = getUser(); // Get user info to get the access token
  let requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (customHeaders) {
    requestHeaders = {
      ...requestHeaders,
      ...customHeaders,
    };
  } else {
    requestHeaders = {
      Authorization: `Bearer ${user?.access_token || ''}`,
    };
  }
  // Conditionally add requestID and Access-Control-Allow-Origin based on the URL
  if (!URL) {
    requestHeaders['requestID'] = generateRequestId(); // Generate a unique request ID
    requestHeaders['Access-Control-Allow-Origin'] = '*'; // Allow all origins (CORS header)
  }

  const instance = axios.create({
    baseURL: URL ?? API, // Use the provided URL or default to the API constant
    headers: requestHeaders,
  });

  return instance;
};

//Searches for a specific search term in a object properties.
export const deepSearch = (obj: any, searchTerm: string): boolean => {
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object') {
      if (deepSearch(value, searchTerm)) {
        return true;
      }
    }

    const stringValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : String(value).toLowerCase();

    if (key === 'effectiveDate' || key === 'endDate') {
      const date = new Date(value);
      const formattedDate = date
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        .toLowerCase();
      const ordinalSuffixPattern = /\b(\d+)(st|nd|rd|th)\b/g;
      searchTerm = searchTerm.replace(ordinalSuffixPattern, '$1');
      if (formattedDate.includes(searchTerm)) {
        return true;
      }
    }

    if (stringValue.includes(searchTerm)) {
      return true;
    }
  }
  return false;
};

export const showNotification = (
  currentStatus: RequestStatus,
  successMessage?: string,
  errorMessage?: string,
) => {
  if (currentStatus === RequestStatus.success) {
    notifySuccess(successMessage);
  } else if (currentStatus === RequestStatus.failed) {
    notifyError(errorMessage);
  }
};

export enum UserRoleType {
  INTERNAL = 'internal',
  DEFAULT = 'not-logged-in',
  CSSA_MANAGER = 'cssa-manager',
}

export const isUserOfType = (roleType: UserRoleType) => {
  const user = getUser();
  if (user !== null) {
    const userRoles: any = user.profile?.role;
    switch (roleType) {
      case 'internal':
        const internalUserRole =
          import.meta.env.VITE_SITE_INTERNAL_USER_ROLE || 'site-internal-user';
        if (userRoles.includes(internalUserRole)) {
          return true;
        } else {
          return false;
        }
      case 'cssa-manager':
        const cssaManagerRole = import.meta.env.VITE_CATS_CSSA_MANAGER_ROLE;
        if (userRoles.includes(cssaManagerRole)) {
          return true;
        } else {
          return false;
        }
    }
  }

  return false;
};

export const getLoggedInUserType = () => {
  return isUserOfType(UserRoleType.INTERNAL)
    ? UserRoleType.INTERNAL
    : UserRoleType.DEFAULT;
};

export const isUserRoleInternalUser = () => {};

export const isUserRoleSiteRegistrar = () => {};

export const updateTableColumn = (
  columns: TableColumn[],
  params: UpdateDisplayTypeParams,
): TableColumn[] => {
  const { indexToUpdate, updates } = params;

  if (indexToUpdate === -1) {
    return columns;
  }

  const itemToUpdate = columns[indexToUpdate];

  const updatedItem: TableColumn = {
    ...itemToUpdate,
    displayType: {
      ...itemToUpdate.displayType, // Use fallback if displayType is undefined
      ...updates, // Apply the updates
      type:
        updates.type ?? itemToUpdate.displayType?.type ?? FormFieldType.Text, // Provide a default type
      label: updates.label ?? itemToUpdate.displayType?.label ?? '', // Provide a default label
    },
  };

  return [
    ...columns.slice(0, indexToUpdate),
    updatedItem,
    ...columns.slice(indexToUpdate + 1),
  ];
};

export const updateFields = (
  fieldArray: IFormField[][],
  params: UpdateDisplayTypeParams,
): IFormField[][] => {
  const { indexToUpdate, updates } = params;

  if (indexToUpdate < 0 || indexToUpdate >= fieldArray.length) {
    return fieldArray; // Return the original array if index is out of bounds
  }

  // Update fields in the specified row
  const updatedRow = fieldArray[indexToUpdate].map((field) => ({
    ...field,
    ...updates,
    type: updates.type ?? field.type,
    label: updates.label ?? field.label,
  }));

  return [
    ...fieldArray.slice(0, indexToUpdate),
    updatedRow,
    ...fieldArray.slice(indexToUpdate + 1),
  ];
};

export const bcBoxAppUrl =
  import.meta.env.VITE_BCBOX_APP_URL || window?._env_?.VITE_BCBOX_APP_URL;
export const getBcBoxBucketIdApiUrl =
  import.meta.env.VITE_BCBOX_BUCKET_URL || window?._env_?.VITE_BCBOX_BUCKET_URL;
export const comsAccessKeyId =
  import.meta.env.VITE_COMS_ACCESS_KEY_ID ||
  window?._env_?.VITE_COMS_ACCESS_KEY_ID;
export const comsBcBoxBucketId =
  import.meta.env.VITE_COMS_BUCKET || window?._env_?.VITE_COMS_BUCKET;
export const comsEndPoint =
  import.meta.env.VITE_COMS_ENDPOINT || window?._env_?.VITE_COMS_ENDPOINT;
export const comsAccessRegion =
  import.meta.env.VITE_COMS_ACCESS_REGION ||
  window?._env_?.VITE_COMS_ACCESS_REGION;
export const comsAccessKey =
  import.meta.env.VITE_COMS_ACCESS_KEY || window?._env_?.VITE_COMS_ACCESS_KEY;

type PermissionSuccessCallback = (state: PermissionState) => void;
type PermissionErrorCallback = (error: Error) => void;

/**
 * Queries the permissions API to see if geolocation has been granted
 * or denied
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query
 */
export function getGeolocationPermission(
  onSuccess: PermissionSuccessCallback,
  onError: PermissionErrorCallback | undefined = undefined,
) {
  // Not supported on Safari (e2e)
  const { permissions: perms } = navigator;
  if (typeof perms?.query === 'function') {
    perms
      .query({ name: 'geolocation' })
      .then((result) => {
        onSuccess(result.state);
        return result;
      })
      .catch((ex: any) => {
        if (onError) {
          onError(ex);
        }
      });
  } else if (onError) {
    onError(new Error('Not supported'));
  }
}

/**
 * Sorts an array of objects based on a specified property and direction.
 *
 * @param array - The array of objects to sort.
 * @param property - The property to sort by. Should be a key of the object type.
 * @param ascDir - A boolean indicating the sort direction:
 *                 true for ascending and false for descending.
 * @returns A new sorted array.
 */
export function sortArray<T>(
  array: T[],
  property: keyof T,
  ascDir: boolean,
): T[] {
  return array.sort((a, b) => {
    // Replace null or undefined values with an empty string for comparison
    const aValue = a[property] == null ? '' : a[property];
    const bValue = b[property] == null ? '' : b[property];

    // Perform the sorting based on the ascending/descending direction specified by ascDir
    if (ascDir) {
      // For ascending order, compare aValue and bValue
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      // For descending order, reverse the comparison
      return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
    }
  });
}
