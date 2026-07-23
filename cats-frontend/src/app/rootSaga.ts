import { all, fork } from 'redux-saga/effects';
import {
  watchPeopleSearch,
  watchPeopleUpdates,
} from './features/people/saga/PeopleSaga';

/**
 * Single root saga for the CATS store. Feature watchers stay colocated with
 * their feature and are composed here so the store has one clear startup
 * point for all Saga-driven side effects.
 */
export function* rootSaga() {
  yield all([fork(watchPeopleSearch), fork(watchPeopleUpdates)]);
}
