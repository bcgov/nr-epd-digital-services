import { act, waitFor } from '@testing-library/react';
import { usePeopleUpdate } from './usePeopleUpdate';
import { usePeopleSearch } from './usePeopleSearch';
import { renderHookWithQueryRouter } from '../../../../utilities/test/QueryTestUtils';
import * as PeopleApi from '../api/PeopleApi';
import { PEOPLE_UPDATE_ERROR_MESSAGE, PeopleApiError } from '../api/PeopleApi';
import { notifyError, notifySuccess } from '../../../components/alert/Alert';

vi.mock('../api/PeopleApi', async () => {
  const actual =
    await vi.importActual<typeof import('../api/PeopleApi')>(
      '../api/PeopleApi',
    );
  return {
    ...actual,
    searchPeople: vi.fn(),
    updatePeople: vi.fn(),
  };
});

vi.mock('../../../components/alert/Alert', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyAlert: vi.fn(),
}));

const searchPeopleMock = vi.mocked(PeopleApi.searchPeople);
const updatePeopleMock = vi.mocked(PeopleApi.updatePeople);

const updateInput = [
  {
    id: 1,
    firstName: 'Ada',
    lastName: 'Lovelace',
    isTaxExempt: false,
    isActive: true,
    updatedBy: '',
    updatedDatetime: '2026-07-22T12:00:00.000Z',
  },
];

const searchResult = {
  persons: [{ id: 1, firstName: 'Ada', lastName: 'Lovelace' }],
  count: 1,
  page: 1,
  pageSize: 5,
};

const updateResult = {
  message: 'Updated',
  httpStatusCode: 200,
  success: true,
  timestamp: '2026-07-22T12:00:00.000Z',
};

describe('usePeopleUpdate', () => {
  beforeEach(() => {
    searchPeopleMock.mockReset();
    updatePeopleMock.mockReset();
    vi.mocked(notifyError).mockReset();
    vi.mocked(notifySuccess).mockReset();
  });

  it('invalidates and refetches the current search once on success and notifies', async () => {
    searchPeopleMock.mockResolvedValue(searchResult as any);
    updatePeopleMock.mockResolvedValue(updateResult);

    const { result } = renderHookWithQueryRouter(
      () => ({
        search: usePeopleSearch(),
        update: usePeopleUpdate(),
      }),
      {
        initialEntries: ['/people?search=ada&page=1&pageSize=5'],
      },
    );

    await waitFor(() => expect(result.current.search.isSuccess).toBe(true));
    expect(searchPeopleMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.update.mutateAsync(updateInput);
    });

    await waitFor(() => expect(searchPeopleMock).toHaveBeenCalledTimes(2));
    expect(notifySuccess).toHaveBeenCalled();
    expect(notifyError).not.toHaveBeenCalled();
  });

  it('shows a failure notification and does not refetch on error', async () => {
    searchPeopleMock.mockResolvedValue(searchResult as any);
    updatePeopleMock.mockRejectedValue(
      new PeopleApiError(PEOPLE_UPDATE_ERROR_MESSAGE),
    );

    const { result } = renderHookWithQueryRouter(
      () => ({
        search: usePeopleSearch(),
        update: usePeopleUpdate(),
      }),
      {
        initialEntries: ['/people?search=ada&page=1&pageSize=5'],
      },
    );

    await waitFor(() => expect(result.current.search.isSuccess).toBe(true));
    expect(searchPeopleMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await expect(
        result.current.update.mutateAsync(updateInput),
      ).rejects.toBeInstanceOf(PeopleApiError);
    });

    expect(notifyError).toHaveBeenCalledWith(
      PEOPLE_UPDATE_ERROR_MESSAGE,
      'Update could not be completed',
      'Please try again or contact support.',
    );
    expect(notifySuccess).not.toHaveBeenCalled();
    expect(searchPeopleMock).toHaveBeenCalledTimes(1);
  });

  it('does not automatically retry a failed mutation', async () => {
    updatePeopleMock.mockRejectedValue(
      new PeopleApiError(PEOPLE_UPDATE_ERROR_MESSAGE),
    );

    const { result } = renderHookWithQueryRouter(() => usePeopleUpdate());

    await act(async () => {
      await expect(
        result.current.mutateAsync(updateInput),
      ).rejects.toBeInstanceOf(PeopleApiError);
    });

    expect(updatePeopleMock).toHaveBeenCalledTimes(1);
  });
});
