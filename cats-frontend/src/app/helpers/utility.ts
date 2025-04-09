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

export const getAxiosInstance = () => {
  const user = getUser();

  const instance = axios.create({
    baseURL: API,
    // timeout: 2000,
    headers: {
      Authorization: 'Bearer ' + user?.access_token,
      requestID: generateRequestId(),
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
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
  SR = 'sr',
  default = 'not-logged-in',
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
      case 'sr':
        return false;
      // const srUserRole =
      //   //  process.env?.REACT_APP_SITE_REGISTRAR_USER_ROLE
      //   // ?? ((window as any)?._env_?.REACT_APP_SITE_REGISTRAR_USER_ROLE) ??
      //   "site-site-registrar";

      // if (userRoles.includes(srUserRole)) {
      //   return true;
      // } else {
      //   return false;
      // }
    }
  }
};

export const getLoggedInUserType = () => {
  return isUserOfType(UserRoleType.INTERNAL)
    ? UserRoleType.INTERNAL
    : UserRoleType.default;
};

export const isUserRoleInternalUser = () => { };

export const isUserRoleSiteRegistrar = () => { };

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

export const bcBoxAppUrl = import.meta.env.VITE_BCBOX_APP_URL;
export const getBcBoxBucketIdApiUrl = import.meta.env.VITE_BCBOX_BUCKET_URL;
export const comsAccessKeyId = import.meta.env.VITE_COMS_ACCESS_KEY_ID;
export const comsBcBoxBucketId = import.meta.env.VITE_COMS_BUCKET;
export const comsEndPoint = import.meta.env.VITE_COMS_ENDPOINT;
export const comsAccessRegion = import.meta.env.VITE_COMS_ACCESS_REGION;
export const comsAccessKey = import.meta.env.VITE_COMS_ACCESS_KEY;

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
