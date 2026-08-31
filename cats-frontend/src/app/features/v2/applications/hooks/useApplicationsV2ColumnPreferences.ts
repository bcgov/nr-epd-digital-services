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
    useState<VisibilityState | null>(null);

  const preferencesQuery = useQuery({
    queryKey: applicationsV2ColumnPreferenceKeys.all,
    queryFn: ({ signal }) => getApplicationsColumnPreferences(signal),
  });

  useEffect(() => {
    if (columnVisibility !== null || preferencesQuery.isPending) {
      return;
    }

    setColumnVisibilityState(
      preferencesQuery.isSuccess
        ? mergeApplicationsV2ColumnVisibility(
            DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
            preferencesQuery.data,
          )
        : { ...DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY },
    );
  }, [
    columnVisibility,
    preferencesQuery.isPending,
    preferencesQuery.isSuccess,
    preferencesQuery.data,
  ]);

  const setColumnVisibility: OnChangeFn<VisibilityState> = (updater) => {
    setColumnVisibilityState((previous) => {
      const base = previous ?? DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY;
      return typeof updater === 'function' ? updater(base) : updater;
    });
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

  const resolvedVisibility =
    columnVisibility ?? DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY;

  return {
    columnVisibility: resolvedVisibility,
    setColumnVisibility,
    resetColumnVisibility,
    saveColumnDefaults: () => saveMutation.mutateAsync(resolvedVisibility),
    isSavingColumnDefaults: saveMutation.isPending,
    isLoadingPreferences: columnVisibility === null,
  };
};
