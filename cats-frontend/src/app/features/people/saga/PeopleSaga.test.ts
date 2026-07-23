import { runSaga, stdChannel, Task } from 'redux-saga';
import {
  PEOPLE_SEARCH_RETRY_BASE_DELAY_MS,
  watchPeopleSearch,
} from './PeopleSaga';
import {
  searchPeople,
  PeopleSearchApiError,
  PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
} from '../api/PeopleApi';
import {
  searchPeopleFailed,
  searchPeopleRequested,
  searchPeopleSucceeded,
} from '../dto/PeopleSlice';
import { PeopleSearchCriteria } from '../dto/PeopleSearchTypes';
import { notifyError } from '../../../components/alert/Alert';

vi.mock('../api/PeopleApi', async () => {
  const actual = await vi.importActual<typeof import('../api/PeopleApi')>(
    '../api/PeopleApi',
  );
  return {
    ...actual,
    searchPeople: vi.fn(),
  };
});

vi.mock('../../../components/alert/Alert', () => ({
  notifyError: vi.fn(),
}));

const mockedSearchPeople = searchPeople as unknown as ReturnType<typeof vi.fn>;

const criteria: PeopleSearchCriteria = {
  searchParam: 'smith',
  page: 1,
  pageSize: 10,
  searchMode: 'OR',
  activeFilter: 'all',
};

const successResult = {
  persons: [{ id: '1', firstName: 'Jane', lastName: 'Smith' }],
  count: 1,
  page: 1,
  pageSize: 10,
};

const flushMicrotasks = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('People search saga', () => {
  let channel: ReturnType<typeof stdChannel>;
  let dispatched: unknown[];
  let task: Task;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    dispatched = [];
    channel = stdChannel();
    task = runSaga(
      {
        channel,
        dispatch: (action) => {
          dispatched.push(action);
        },
        getState: () => ({}),
      },
      watchPeopleSearch,
    );
  });

  afterEach(() => {
    task.cancel();
    vi.useRealTimers();
  });

  it('waits for a 300ms quiet period before calling the API', async () => {
    mockedSearchPeople.mockResolvedValue(successResult);

    channel.put(searchPeopleRequested(criteria));
    await vi.advanceTimersByTimeAsync(299);
    await flushMicrotasks();

    expect(mockedSearchPeople).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await flushMicrotasks();

    expect(mockedSearchPeople).toHaveBeenCalledTimes(1);
    expect(dispatched).toContainEqual(searchPeopleSucceeded(successResult));
  });

  it('only lets the latest search update Redux results', async () => {
    const firstCriteria = { ...criteria, searchParam: 'smi' };
    const latestCriteria = { ...criteria, searchParam: 'smith' };
    const latestResult = {
      ...successResult,
      persons: [{ id: '2', firstName: 'Sam', lastName: 'Smith' }],
      count: 1,
    };

    mockedSearchPeople.mockImplementation((searchCriteria) => {
      if (searchCriteria.searchParam === 'smi') {
        return new Promise(() => {
          // Intentionally never resolves — superseded request must not win.
        });
      }
      return Promise.resolve(latestResult);
    });

    channel.put(searchPeopleRequested(firstCriteria));
    await vi.advanceTimersByTimeAsync(300);
    await flushMicrotasks();

    channel.put(searchPeopleRequested(latestCriteria));
    await vi.advanceTimersByTimeAsync(300);
    await flushMicrotasks();

    expect(mockedSearchPeople).toHaveBeenCalledWith(
      latestCriteria,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(dispatched).toContainEqual(searchPeopleSucceeded(latestResult));
    expect(dispatched).not.toContainEqual(
      searchPeopleSucceeded(successResult),
    );
  });

  it('aborts the in-flight Axios request when a newer search supersedes it', async () => {
    const signals: AbortSignal[] = [];

    mockedSearchPeople.mockImplementation((_criteria, options) => {
      signals.push(options.signal as AbortSignal);
      return new Promise(() => {
        // Stay pending so cancellation can abort the signal.
      });
    });

    channel.put(searchPeopleRequested({ ...criteria, searchParam: 'smi' }));
    await vi.advanceTimersByTimeAsync(300);
    await flushMicrotasks();

    expect(signals).toHaveLength(1);
    expect(signals[0].aborted).toBe(false);

    channel.put(searchPeopleRequested(criteria));
    await flushMicrotasks();

    expect(signals[0].aborted).toBe(true);
  });

  it('retries a transient failure and succeeds without notifying the user', async () => {
    mockedSearchPeople
      .mockRejectedValueOnce(
        new PeopleSearchApiError(PEOPLE_SEARCH_SAFE_ERROR_MESSAGE, true),
      )
      .mockResolvedValueOnce(successResult);

    channel.put(searchPeopleRequested(criteria));
    await vi.advanceTimersByTimeAsync(300);
    await flushMicrotasks();

    expect(mockedSearchPeople).toHaveBeenCalledTimes(1);
    expect(dispatched).not.toContainEqual(
      searchPeopleSucceeded(successResult),
    );

    await vi.advanceTimersByTimeAsync(PEOPLE_SEARCH_RETRY_BASE_DELAY_MS);
    await flushMicrotasks();

    expect(mockedSearchPeople).toHaveBeenCalledTimes(2);
    expect(dispatched).toContainEqual(searchPeopleSucceeded(successResult));
    expect(notifyError).not.toHaveBeenCalled();
    expect(dispatched).not.toContainEqual(
      expect.objectContaining({ type: searchPeopleFailed.type }),
    );
  });

  it('uses exponential backoff between transient retries', async () => {
    mockedSearchPeople
      .mockRejectedValueOnce(
        new PeopleSearchApiError(PEOPLE_SEARCH_SAFE_ERROR_MESSAGE, true),
      )
      .mockRejectedValueOnce(
        new PeopleSearchApiError(PEOPLE_SEARCH_SAFE_ERROR_MESSAGE, true),
      )
      .mockResolvedValueOnce(successResult);

    channel.put(searchPeopleRequested(criteria));
    await vi.advanceTimersByTimeAsync(300);
    await flushMicrotasks();
    expect(mockedSearchPeople).toHaveBeenCalledTimes(1);

    // First backoff: base * 2^0 = 200ms
    await vi.advanceTimersByTimeAsync(PEOPLE_SEARCH_RETRY_BASE_DELAY_MS - 1);
    await flushMicrotasks();
    expect(mockedSearchPeople).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    await flushMicrotasks();
    expect(mockedSearchPeople).toHaveBeenCalledTimes(2);

    // Second backoff: base * 2^1 = 400ms
    await vi.advanceTimersByTimeAsync(
      PEOPLE_SEARCH_RETRY_BASE_DELAY_MS * 2 - 1,
    );
    await flushMicrotasks();
    expect(mockedSearchPeople).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(1);
    await flushMicrotasks();
    expect(mockedSearchPeople).toHaveBeenCalledTimes(3);
    expect(dispatched).toContainEqual(searchPeopleSucceeded(successResult));
  });

  it('exhausts retries, sets failed state, and shows a safe error toast', async () => {
    mockedSearchPeople.mockRejectedValue(
      new PeopleSearchApiError(PEOPLE_SEARCH_SAFE_ERROR_MESSAGE, true),
    );

    channel.put(searchPeopleRequested(criteria));
    await vi.advanceTimersByTimeAsync(300);
    await flushMicrotasks();

    // Initial + two retries with backoff between them
    await vi.advanceTimersByTimeAsync(PEOPLE_SEARCH_RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    await vi.advanceTimersByTimeAsync(PEOPLE_SEARCH_RETRY_BASE_DELAY_MS * 2);
    await flushMicrotasks();

    expect(mockedSearchPeople).toHaveBeenCalledTimes(3);
    expect(dispatched).toContainEqual(
      searchPeopleFailed({ message: PEOPLE_SEARCH_SAFE_ERROR_MESSAGE }),
    );
    expect(notifyError).toHaveBeenCalledWith(PEOPLE_SEARCH_SAFE_ERROR_MESSAGE);
  });

  it('does not retry permanent failures and shows a safe error toast', async () => {
    mockedSearchPeople.mockRejectedValue(
      new PeopleSearchApiError(PEOPLE_SEARCH_SAFE_ERROR_MESSAGE, false),
    );

    channel.put(searchPeopleRequested(criteria));
    await vi.advanceTimersByTimeAsync(300);
    await flushMicrotasks();

    expect(mockedSearchPeople).toHaveBeenCalledTimes(1);
    expect(dispatched).toContainEqual(
      searchPeopleFailed({ message: PEOPLE_SEARCH_SAFE_ERROR_MESSAGE }),
    );
    expect(notifyError).toHaveBeenCalledWith(PEOPLE_SEARCH_SAFE_ERROR_MESSAGE);
    expect(notifyError).not.toHaveBeenCalledWith(
      expect.stringMatching(/raw|internal|GraphQL|ECONN/i),
    );
  });
});
