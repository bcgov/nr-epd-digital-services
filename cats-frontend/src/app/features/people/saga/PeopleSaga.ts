import { call, cancelled, delay, put, takeLatest } from 'redux-saga/effects';
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
import { notifyError } from '../../../components/alert/Alert';

/** Quiet period before a People search hits the API. */
export const PEOPLE_SEARCH_DEBOUNCE_MS = 300;

/** Retries after the initial attempt for transient failures. */
export const PEOPLE_SEARCH_MAX_RETRIES = 2;

/** Base delay (ms) for exponential backoff: base * 2^attempt. */
export const PEOPLE_SEARCH_RETRY_BASE_DELAY_MS = 200;

const isRetryablePeopleSearchError = (err: unknown): boolean =>
  err instanceof PeopleSearchApiError && err.retryable;

const retryDelayMs = (attemptIndex: number): number =>
  PEOPLE_SEARCH_RETRY_BASE_DELAY_MS * 2 ** attemptIndex;

export function* searchPeopleWorker(
  action: PayloadAction<PeopleSearchCriteria>,
) {
  // takeLatest cancels this delay when a newer request arrives, producing
  // debounce + latest-only behavior without a separate debounce helper.
  yield delay(PEOPLE_SEARCH_DEBOUNCE_MS);

  const controller = new AbortController();
  const maxAttempts = PEOPLE_SEARCH_MAX_RETRIES + 1;

  try {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result: Awaited<ReturnType<typeof searchPeople>> = yield call(
          searchPeople,
          action.payload,
          { signal: controller.signal },
        );
        yield put(searchPeopleSucceeded(result));
        return;
      } catch (err) {
        const retriesRemain = attempt < PEOPLE_SEARCH_MAX_RETRIES;
        if (!isRetryablePeopleSearchError(err) || !retriesRemain) {
          const message =
            err instanceof PeopleSearchApiError
              ? err.message
              : PEOPLE_SEARCH_SAFE_ERROR_MESSAGE;
          yield put(searchPeopleFailed({ message }));
          yield call(notifyError, message);
          return;
        }

        yield delay(retryDelayMs(attempt));
      }
    }
  } finally {
    if (yield cancelled()) {
      controller.abort();
    }
  }
}

/**
 * People feature watcher, colocated with the People feature and composed by
 * the centralized root saga. Debounced and latest-only: only the newest
 * search after a quiet period is honored, and superseded workers abort HTTP.
 */
export function* watchPeopleSearch() {
  yield takeLatest(searchPeopleRequested.type, searchPeopleWorker);
}
