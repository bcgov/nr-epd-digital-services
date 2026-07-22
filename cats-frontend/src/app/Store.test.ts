import { createAppStore } from './Store';
import { searchPeopleRequested } from './features/people/dto/PeopleSlice';
import { RequestStatus } from './helpers/requests/status';

vi.mock('./features/people/api/PeopleApi', () => ({
  searchPeople: vi.fn().mockResolvedValue({
    persons: [{ id: '1' }],
    count: 1,
    page: 1,
    pageSize: 10,
  }),
  PeopleSearchApiError: class PeopleSearchApiError extends Error {},
  PEOPLE_SEARCH_SAFE_ERROR_MESSAGE: 'safe message',
}));

// Store startup smoke test: verifies the root saga is registered and can
// process a request action without Redux thunk middleware being involved.
describe('Store', () => {
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

    await vi.waitFor(() => {
      expect(store.getState().peoples.fetchStatus).toBe(RequestStatus.success);
    });

    expect(store.getState().peoples.peoples).toEqual([{ id: '1' }]);
  });
});
