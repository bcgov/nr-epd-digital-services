import peopleReducer, {
  searchPeopleRequested,
  searchPeopleSucceeded,
  searchPeopleFailed,
  updatePeopleRequested,
  updatePeopleSucceeded,
  updatePeopleFailed,
} from './PeopleSlice';
import { PeopleState } from './PeopleState';
import { RequestStatus } from '../../../helpers/requests/status';
import { PeopleSearchCriteria } from './PeopleSearchTypes';
import { PeopleUpdateInput } from './PeopleUpdateTypes';

const criteria: PeopleSearchCriteria = {
  searchParam: 'smith',
  page: 2,
  pageSize: 25,
  searchMode: 'AND',
  activeFilter: 'active',
};

const updateInput: PeopleUpdateInput[] = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    isActive: true,
    updatedDatetime: '2026-07-22T12:00:00.000Z',
  },
];

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

describe('PeopleSlice update lifecycle reducers', () => {
  const baseState: PeopleState = {
    ...new PeopleState(),
    error: 'stale error from a previous failed update',
    updateStatus: RequestStatus.idle,
  };

  it('updatePeopleRequested clears prior errors and sets loading', () => {
    const state = peopleReducer(baseState, updatePeopleRequested(updateInput));

    expect(state.error).toBe('');
    expect(state.updateStatus).toBe(RequestStatus.loading);
  });

  it('updatePeopleSucceeded sets success status', () => {
    const state = peopleReducer(
      { ...baseState, updateStatus: RequestStatus.loading },
      updatePeopleSucceeded(),
    );

    expect(state.updateStatus).toBe(RequestStatus.success);
  });

  it('updatePeopleFailed sets failed status and a safe message', () => {
    const state = peopleReducer(
      { ...baseState, updateStatus: RequestStatus.loading },
      updatePeopleFailed({ message: 'safe update failure' }),
    );

    expect(state.updateStatus).toBe(RequestStatus.failed);
    expect(state.error).toBe('safe update failure');
  });
});
