import { useEffect, useState } from 'react';

import { getGeolocationPermission } from '../app/helpers/utility';

/**
 * Allows querying the browser permissions to see if the geolocation
 * permission has been set (granted, prompt, denied).
 */
export function useGeolocationPermission(): PermissionState | undefined {
  const [state, setState] = useState<PermissionState | undefined>(undefined);

  useEffect(() => {
    // If there is an error - assume the permissions API is not supported
    // And the geolocation is probably still available
    getGeolocationPermission(setState, () => setState('prompt'));
  }, []);

  return state;
}
