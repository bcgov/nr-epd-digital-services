import { createAppStore } from './Store';
import {
  searchPeopleRequested,
  updatePeopleRequested,
} from './features/people/dto/PeopleSlice';
import { RequestStatus } from './helpers/requests/status';

vi.mock('./features/people/api/PeopleApi', () => ({
  searchPeople: vi.fn().mockResolvedValue({
    persons: [{ id: '1' }],
    count: 1,
    page: 1,
    pageSize: 10,
  }),
  updatePeople: vi.fn().mockResolvedValue(undefined),
  PeopleSearchApiError: class PeopleSearchApiError extends Error {},
  PeopleUpdateApiError: class PeopleUpdateApiError extends Error {},
  PEOPLE_SEARCH_SAFE_ERROR_MESSAGE: 'safe message',
  PEOPLE_UPDATE_SAFE_ERROR_MESSAGE: 'safe update message',
}));

vi.mock('./components/alert/Alert', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
}));

// Store startup smoke test: verifies the root saga is registered and can
// process a request action without Redux thunk middleware being involved.
describe('Store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts the root saga so a search request reaches success state', async () => {
    const store = createAppStore();

    store.dispatch(
      searchPeopleRequested({
        searchParam: 'smith',
        page: 1,
        pageSize: 10,
        searchMode: 'OR',
        activeFilter: 'all',
      }),
    );

    expect(store.getState().peoples.fetchStatus).toBe(RequestStatus.loading);

    await vi.advanceTimersByTimeAsync(300);
    await Promise.resolve();

    expect(store.getState().peoples.fetchStatus).toBe(RequestStatus.success);
    expect(store.getState().peoples.peoples).toEqual([{ id: '1' }]);
  });

  it('rejects thunk function dispatches because thunk middleware is disabled', () => {
    const store = createAppStore();

    expect(() =>
      store.dispatch((() => ({ type: 'thunk/should-not-run' })) as any),
    ).toThrow(/plain objects/i);
  });

  it('accepts serializable Manage People update payloads with the serializability check enabled', async () => {
    const store = createAppStore();

    store.dispatch(
      searchPeopleRequested({
        searchParam: 'smith',
        page: 1,
        pageSize: 10,
        searchMode: 'OR',
        activeFilter: 'all',
        filter: {
          whenCreated: 'January 1st, 2026 - January 31st, 2026',
        },
      }),
    );

    await vi.advanceTimersByTimeAsync(300);
    await Promise.resolve();

    store.dispatch(
      updatePeopleRequested([
        {
          id: 1,
          firstName: 'Jane',
          lastName: 'Smith',
          isActive: true,
          updatedDatetime: '2026-07-22T12:00:00.000Z',
        },
      ]),
    );

    await Promise.resolve();
    await Promise.resolve();

    expect(store.getState().peoples.updateStatus).toBe(RequestStatus.success);
    expect(store.getState().peoples.lastSearchCriteria?.filter).toEqual({
      whenCreated: 'January 1st, 2026 - January 31st, 2026',
    });
  });
});
