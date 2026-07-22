import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  searchPeople,
  PeopleSearchApiError,
  PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
} from '../api/PeopleApi';
import {
  searchPeopleRequested,
  searchPeopleSucceeded,
  searchPeopleFailed,
} from '../dto/PeopleSlice';
import { PeopleSearchCriteria } from '../dto/PeopleSearchTypes';

export function* searchPeopleWorker(
  action: PayloadAction<PeopleSearchCriteria>,
) {
  try {
    const result: Awaited<ReturnType<typeof searchPeople>> = yield call(
      searchPeople,
      action.payload,
    );
    yield put(searchPeopleSucceeded(result));
  } catch (err) {
    const message =
      err instanceof PeopleSearchApiError
        ? err.message
        : PEOPLE_SEARCH_SAFE_ERROR_MESSAGE;
    yield put(searchPeopleFailed({ message }));
  }
}

/**
 * People feature watcher, colocated with the People feature and composed by
 * the centralized root saga. Only the latest in-flight search is honored.
 */
export function* watchPeopleSearch() {
  yield takeLatest(searchPeopleRequested.type, searchPeopleWorker);
}
