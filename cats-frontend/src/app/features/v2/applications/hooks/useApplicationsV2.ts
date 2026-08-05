import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notifyError } from '../../../../components/alert/Alert';
import {
  APPLICATIONS_SEARCH_ERROR_MESSAGE,
  DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
  searchApplications,
  type SearchApplicationsV2QueryVariables,
} from '../api/ApplicationsApi';

export const applicationsV2Keys = {
  all: ['applications', 'v2'] as const,
  list: (variables: SearchApplicationsV2QueryVariables) =>
    [...applicationsV2Keys.all, 'list', variables] as const,
};

export const useApplicationsV2 = (
  variables: SearchApplicationsV2QueryVariables = DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
) => {
  const query = useQuery({
    queryKey: applicationsV2Keys.list(variables),
    queryFn: ({ signal }) => searchApplications(variables, signal),
  });

  useEffect(() => {
    if (query.isError) {
      notifyError(
        APPLICATIONS_SEARCH_ERROR_MESSAGE,
        'Search could not be completed',
        'Please try again or contact support.',
      );
    }
  }, [query.isError, query.errorUpdatedAt]);

  return query;
};
