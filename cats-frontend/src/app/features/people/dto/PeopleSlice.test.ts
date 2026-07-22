import peopleReducer, {
  searchPeopleRequested,
  searchPeopleSucceeded,
  searchPeopleFailed,
} from './PeopleSlice';
import { PeopleState } from './PeopleState';
import { RequestStatus } from '../../../helpers/requests/status';
import { PeopleSearchCriteria } from './PeopleSearchTypes';

const criteria: PeopleSearchCriteria = {
  searchParam: 'smith',
  page: 2,
  pageSize: 25,
  searchMode: 'AND',
  activeFilter: 'active',
};

describe('PeopleSlice search lifecycle reducers', () => {
  const baseState: PeopleState = {
    ...new PeopleState(),
    error: 'stale error from a previous failed search',
    fetchStatus: RequestStatus.idle,
  };

  it('searchPeopleRequested records the latest criteria, clears errors, and sets loading', () => {
    const state = peopleReducer(baseState, searchPeopleRequested(criteria));

    expect(state.lastSearchCriteria).toEqual(criteria);
    expect(state.error).toBe('');
    expect(state.fetchStatus).toBe(RequestStatus.loading);
  });

  it('searchPeopleSucceeded stores results and result count', () => {
    const result = {
      persons: [{ id: '1' } as any],
      count: 1,
      page: 2,
      pageSize: 25,
    };

    const state = peopleReducer(
      { ...baseState, fetchStatus: RequestStatus.loading },
      searchPeopleSucceeded(result),
    );

    expect(state.peoples).toEqual(result.persons);
    expect(state.resultsCount).toBe(1);
    expect(state.fetchStatus).toBe(RequestStatus.success);
  });

  it('searchPeopleFailed records a safe message without touching results', () => {
    const state = peopleReducer(
      { ...baseState, fetchStatus: RequestStatus.loading, peoples: [] },
      searchPeopleFailed({ message: 'safe failure message' }),
    );

    expect(state.fetchStatus).toBe(RequestStatus.failed);
    expect(state.error).toBe('safe failure message');
    expect(state.peoples).toEqual([]);
  });
});
