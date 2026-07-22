import { call, put } from 'redux-saga/effects';
import { searchPeopleWorker } from './PeopleSaga';
import { searchPeople, PeopleSearchApiError } from '../api/PeopleApi';
import { searchPeopleFailed, searchPeopleSucceeded } from '../dto/PeopleSlice';
import { PeopleSearchCriteria } from '../dto/PeopleSearchTypes';

const criteria: PeopleSearchCriteria = {
  searchParam: 'smith',
  page: 1,
  pageSize: 10,
  searchMode: 'OR',
  activeFilter: 'all',
};

describe('searchPeopleWorker', () => {
  it('calls the People API and dispatches success on a successful search', () => {
    const gen = searchPeopleWorker({
      type: 'peoples/searchPeopleRequested',
      payload: criteria,
    });

    expect(gen.next().value).toEqual(call(searchPeople, criteria));

    const result = { persons: [], count: 0, page: 1, pageSize: 10 };
    expect(gen.next(result).value).toEqual(put(searchPeopleSucceeded(result)));
    expect(gen.next().done).toBe(true);
  });

  it('dispatches a safe failure message from a PeopleSearchApiError', () => {
    const gen = searchPeopleWorker({
      type: 'peoples/searchPeopleRequested',
      payload: criteria,
    });

    gen.next();
    const apiError = new PeopleSearchApiError('safe search error');
    expect(gen.throw(apiError).value).toEqual(
      put(searchPeopleFailed({ message: 'safe search error' })),
    );
  });

  it('dispatches the default safe message for unexpected errors', () => {
    const gen = searchPeopleWorker({
      type: 'peoples/searchPeopleRequested',
      payload: criteria,
    });

    gen.next();
    expect(gen.throw(new Error('unexpected')).value).toEqual(
      put(
        searchPeopleFailed({
          message:
            'We were unable to search People right now. Please try again.',
        }),
      ),
    );
  });
});
