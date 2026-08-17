import { print } from 'graphql';
import {
  GetUserColumnPreferencesDocument,
  SaveUserColumnPreferencesDocument,
} from '../../../../graphql/columnPreferences.generated';
import { GRAPHQL } from '../../../../helpers/endpoints';
import { APPLICATIONS_COLUMN_PREFERENCES_PAGE } from '../applicationsV2ColumnPreferences';
import {
  COLUMN_PREFERENCES_ERROR_MESSAGE,
  ColumnPreferencesApiError,
  getApplicationsColumnPreferences,
  saveApplicationsColumnPreferences,
} from './ColumnPreferencesApi';

const mockPost = vi.fn();

vi.mock('../../../../helpers/utility', () => ({
  getAxiosInstance: () => ({
    post: mockPost,
  }),
}));

describe('ColumnPreferencesApi', () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it('fetches saved column preferences for the applications page', async () => {
    const columns = [
      { id: 1, displayName: 'Application ID', active: true, sortOrder: 1 },
    ];
    mockPost.mockResolvedValue({
      data: {
        data: {
          getUserColumnPreferences: {
            success: true,
            data: {
              page: 'applications',
              columns,
            },
          },
        },
      },
    });

    const result = await getApplicationsColumnPreferences();

    expect(mockPost).toHaveBeenCalledWith(
      GRAPHQL,
      {
        query: print(GetUserColumnPreferencesDocument),
        variables: { page: APPLICATIONS_COLUMN_PREFERENCES_PAGE },
      },
      { signal: undefined },
    );
    expect(result).toEqual(columns);
  });

  it('returns null when no preferences are saved yet', async () => {
    mockPost.mockResolvedValue({
      data: {
        data: {
          getUserColumnPreferences: {
            success: true,
            data: null,
          },
        },
      },
    });

    await expect(getApplicationsColumnPreferences()).resolves.toBeNull();
  });

  it('saves column preferences under the applications page key', async () => {
    const columns = [
      {
        id: 1,
        displayName: 'Application ID',
        active: true,
        sortOrder: 1,
        selectionOrder: 1,
      },
    ];
    mockPost.mockResolvedValue({
      data: {
        data: {
          saveUserColumnPreferences: {
            success: true,
            data: { page: 'applications', columns },
          },
        },
      },
    });

    await saveApplicationsColumnPreferences(columns);

    expect(mockPost).toHaveBeenCalledWith(
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
      { signal: undefined },
    );
  });

  it('throws a safe domain error on GraphQL transport errors', async () => {
    mockPost.mockResolvedValue({
      data: {
        errors: [{ message: 'boom' }],
      },
    });

    await expect(getApplicationsColumnPreferences()).rejects.toEqual(
      new ColumnPreferencesApiError(COLUMN_PREFERENCES_ERROR_MESSAGE),
    );
  });
});
