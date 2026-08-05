import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notifyError } from '../../../../components/alert/Alert';
import {
  APPLICATIONS_SEARCH_ERROR_MESSAGE,
  DEFAULT_APPLICATIONS_SEARCH_VARIABLES,
  searchApplications,
} from '../api/ApplicationsApi';

export const applicationsV2Keys = {
  all: ['applications', 'v2'] as const,
  list: () => [...applicationsV2Keys.all, 'list'] as const,
};

export const useApplicationsV2 = () => {
  const query = useQuery({
    queryKey: applicationsV2Keys.list(),
    queryFn: ({ signal }) =>
      searchApplications(DEFAULT_APPLICATIONS_SEARCH_VARIABLES, signal),
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
