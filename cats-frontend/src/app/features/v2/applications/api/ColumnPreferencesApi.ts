import { print } from 'graphql';
import type { ColumnConfigInput } from '../../../../../generated/types';
import {
  GetUserColumnPreferencesDocument,
  SaveUserColumnPreferencesDocument,
} from '../../../../graphql/columnPreferences.generated';
import { GRAPHQL } from '../../../../helpers/endpoints';
import { getAxiosInstance } from '../../../../helpers/utility';
import {
  APPLICATIONS_COLUMN_PREFERENCES_PAGE,
  type SavedColumnPreference,
} from '../applicationsV2ColumnPreferences';

export const COLUMN_PREFERENCES_ERROR_MESSAGE =
  'Unable to load column preferences. Please try again.';

export const COLUMN_PREFERENCES_SAVE_ERROR_MESSAGE =
  'Unable to save column preferences. Please try again.';

export class ColumnPreferencesApiError extends Error {
  constructor(message: string = COLUMN_PREFERENCES_ERROR_MESSAGE) {
    super(message);
    this.name = 'ColumnPreferencesApiError';
  }
}

const rethrowUnlessCanceled = (error: unknown, message: string): never => {
  if (error instanceof ColumnPreferencesApiError) {
    throw error;
  }
  if (
    (error as { name?: string })?.name === 'CanceledError' ||
    (error as { name?: string })?.name === 'AbortError'
  ) {
    throw error;
  }
  throw new ColumnPreferencesApiError(message);
};

export const getApplicationsColumnPreferences = async (
  signal?: AbortSignal,
): Promise<SavedColumnPreference[] | null> => {
  try {
    const response = await getAxiosInstance().post(
      GRAPHQL,
      {
        query: print(GetUserColumnPreferencesDocument),
        variables: { page: APPLICATIONS_COLUMN_PREFERENCES_PAGE },
      },
      { signal },
    );

    if (response.data?.errors?.length > 0) {
      throw new ColumnPreferencesApiError();
    }

    const payload = response.data?.data?.getUserColumnPreferences;
    if (!payload) {
      throw new ColumnPreferencesApiError();
    }

    return payload.data?.columns ?? null;
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    return rethrowUnlessCanceled(error, COLUMN_PREFERENCES_ERROR_MESSAGE);
  }
};

export const saveApplicationsColumnPreferences = async (
  columns: ColumnConfigInput[],
  signal?: AbortSignal,
): Promise<void> => {
  try {
    const response = await getAxiosInstance().post(
      GRAPHQL,
      {
        query: print(SaveUserColumnPreferencesDocument),
        variables: {
          columnPreferences: {
            page: APPLICATIONS_COLUMN_PREFERENCES_PAGE,
            columns,
          },
        },
      },
      { signal },
    );

    if (response.data?.errors?.length > 0) {
      throw new ColumnPreferencesApiError(COLUMN_PREFERENCES_SAVE_ERROR_MESSAGE);
    }

    const payload = response.data?.data?.saveUserColumnPreferences;
    if (!payload?.success) {
      throw new ColumnPreferencesApiError(COLUMN_PREFERENCES_SAVE_ERROR_MESSAGE);
    }
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    return rethrowUnlessCanceled(error, COLUMN_PREFERENCES_SAVE_ERROR_MESSAGE);
  }
};
