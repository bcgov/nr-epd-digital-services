import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { OnChangeFn, VisibilityState } from '@tanstack/react-table';
import { notifyError, notifySuccess } from '../../../../components/alert/Alert';
import {
  COLUMN_PREFERENCES_SAVE_ERROR_MESSAGE,
  getApplicationsColumnPreferences,
  saveApplicationsColumnPreferences,
} from '../api/ColumnPreferencesApi';
import {
  mergeApplicationsV2ColumnVisibility,
  visibilityToColumnPreferences,
} from '../applicationsV2ColumnPreferences';
import { DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY } from '../applicationsV2Columns';
import { applicationsV2Keys } from './useApplicationsV2';

export const applicationsV2ColumnPreferenceKeys = {
  all: [...applicationsV2Keys.all, 'columnPreferences'] as const,
};

export const useApplicationsV2ColumnPreferences = () => {
  const queryClient = useQueryClient();
  const [columnVisibility, setColumnVisibilityState] =
    useState<VisibilityState>(DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY);
  const [hasInitialized, setHasInitialized] = useState(false);

  const preferencesQuery = useQuery({
    queryKey: applicationsV2ColumnPreferenceKeys.all,
    queryFn: ({ signal }) => getApplicationsColumnPreferences(signal),
  });

  useEffect(() => {
    if (hasInitialized || preferencesQuery.isPending) {
      return;
    }

    if (preferencesQuery.isSuccess) {
      setColumnVisibilityState(
        mergeApplicationsV2ColumnVisibility(
          DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
          preferencesQuery.data,
        ),
      );
    }

    setHasInitialized(true);
  }, [
    hasInitialized,
    preferencesQuery.isPending,
    preferencesQuery.isSuccess,
    preferencesQuery.data,
  ]);

  const setColumnVisibility: OnChangeFn<VisibilityState> = (updater) => {
    setColumnVisibilityState((previous) =>
      typeof updater === 'function' ? updater(previous) : updater,
    );
  };

  const resetColumnVisibility = () => {
    setColumnVisibilityState({ ...DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY });
  };

  const saveMutation = useMutation({
    mutationFn: (visibility: VisibilityState) =>
      saveApplicationsColumnPreferences(
        visibilityToColumnPreferences(visibility),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: applicationsV2ColumnPreferenceKeys.all,
      });
      notifySuccess('Column preferences saved.');
    },
    onError: () => {
      notifyError(
        COLUMN_PREFERENCES_SAVE_ERROR_MESSAGE,
        'Save could not be completed',
        'Please try again or contact support.',
      );
    },
  });

  return {
    columnVisibility,
    setColumnVisibility,
    resetColumnVisibility,
    saveColumnDefaults: () => saveMutation.mutateAsync(columnVisibility),
    isSavingColumnDefaults: saveMutation.isPending,
    isLoadingPreferences: preferencesQuery.isPending || !hasInitialized,
  };
};
