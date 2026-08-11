import { useQuery } from '@tanstack/react-query';
import { getApplicationsV2FilterLookupOptions } from '../api/ApplicationsLookupsApi';
import {
  EMPTY_LOOKUP_OPTIONS,
  type ApplicationsV2LookupOptions,
} from '../filters/applicationsV2FilterConfig';
import { applicationsV2Keys } from './useApplicationsV2';

export type { ApplicationsV2LookupOptions };
export { EMPTY_LOOKUP_OPTIONS };

export const applicationsV2LookupKeys = {
  all: [...applicationsV2Keys.all, 'lookups'] as const,
};

export const useApplicationsV2FilterLookups = () => {
  const query = useQuery({
    queryKey: applicationsV2LookupKeys.all,
    queryFn: ({ signal }) => getApplicationsV2FilterLookupOptions(signal),
  });

  return {
    options: query.data ?? EMPTY_LOOKUP_OPTIONS,
    isLoading: query.isPending,
    isError: query.isError,
  };
};
