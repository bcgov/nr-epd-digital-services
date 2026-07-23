import { runSaga, stdChannel, Task } from 'redux-saga';
import {
  PEOPLE_SEARCH_RETRY_BASE_DELAY_MS,
  watchPeopleSearch,
  watchPeopleUpdates,
} from './PeopleSaga';
import {
  searchPeople,
  updatePeople,
  PeopleSearchApiError,
  PeopleUpdateApiError,
  PEOPLE_SEARCH_SAFE_ERROR_MESSAGE,
  PEOPLE_UPDATE_SAFE_ERROR_MESSAGE,
} from '../api/PeopleApi';
import {
  searchPeopleFailed,
  searchPeopleRequested,
  searchPeopleSucceeded,
  updatePeopleFailed,
  updatePeopleRequested,
  updatePeopleSucceeded,
} from '../dto/PeopleSlice';
import { PeopleSearchCriteria } from '../dto/PeopleSearchTypes';
import { PeopleUpdateInput } from '../dto/PeopleUpdateTypes';
import { notifyError, notifySuccess } from '../../../components/alert/Alert';

vi.mock('../api/PeopleApi', async () => {
  const actual = await vi.importActual<typeof import('../api/PeopleApi')>(
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
}));

const mockedSearchPeople = searchPeople as unknown as ReturnType<typeof vi.fn>;
const mockedUpdatePeople = updatePeople as unknown as ReturnType<typeof vi.fn>;

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

const updateInput: PeopleUpdateInput[] = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    isActive: true,
    updatedDatetime: '2026-07-22T12:00:00.000Z',
  },
];

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

describe('People update saga', () => {
  let channel: ReturnType<typeof stdChannel>;
  let dispatched: unknown[];
  let task: Task;
  let state: { peoples: { lastSearchCriteria: PeopleSearchCriteria | null } };

  beforeEach(() => {
    vi.clearAllMocks();
    dispatched = [];
    channel = stdChannel();
    state = { peoples: { lastSearchCriteria: criteria } };
    task = runSaga(
      {
        channel,
        dispatch: (action) => {
          dispatched.push(action);
        },
        getState: () => state,
      },
      watchPeopleUpdates,
    );
  });

  afterEach(() => {
    task.cancel();
  });

  it('ignores duplicate update requests while one mutation is running', async () => {
    let resolveUpdate!: () => void;
    mockedUpdatePeople.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    channel.put(updatePeopleRequested(updateInput));
    channel.put(
      updatePeopleRequested([{ ...updateInput[0], id: 2, isActive: false }]),
    );
    await flushMicrotasks();

    expect(mockedUpdatePeople).toHaveBeenCalledTimes(1);
    expect(mockedUpdatePeople).toHaveBeenCalledWith(updateInput);

    resolveUpdate();
    await flushMicrotasks();

    expect(mockedUpdatePeople).toHaveBeenCalledTimes(1);
  });

  it('succeeds once, shows the success toast, and refreshes with latest criteria', async () => {
    mockedUpdatePeople.mockResolvedValue(undefined);

    channel.put(updatePeopleRequested(updateInput));
    await flushMicrotasks();

    expect(mockedUpdatePeople).toHaveBeenCalledTimes(1);
    expect(dispatched).toContainEqual(updatePeopleSucceeded());
    expect(notifySuccess).toHaveBeenCalledTimes(1);
    expect(dispatched).toContainEqual(searchPeopleRequested(criteria));
    expect(
      dispatched.filter(
        (action: any) => action.type === searchPeopleRequested.type,
      ),
    ).toHaveLength(1);
  });

  it('does not refresh search results when lastSearchCriteria is missing', async () => {
    state.peoples.lastSearchCriteria = null;
    mockedUpdatePeople.mockResolvedValue(undefined);

    channel.put(updatePeopleRequested(updateInput));
    await flushMicrotasks();

    expect(dispatched).toContainEqual(updatePeopleSucceeded());
    expect(dispatched).not.toContainEqual(
      expect.objectContaining({ type: searchPeopleRequested.type }),
    );
  });

  it('fails once, shows a safe error toast, and does not refresh or retry', async () => {
    mockedUpdatePeople.mockRejectedValue(
      new PeopleUpdateApiError(PEOPLE_UPDATE_SAFE_ERROR_MESSAGE),
    );

    channel.put(updatePeopleRequested(updateInput));
    await flushMicrotasks();

    expect(mockedUpdatePeople).toHaveBeenCalledTimes(1);
    expect(dispatched).toContainEqual(
      updatePeopleFailed({ message: PEOPLE_UPDATE_SAFE_ERROR_MESSAGE }),
    );
    expect(notifyError).toHaveBeenCalledWith(PEOPLE_UPDATE_SAFE_ERROR_MESSAGE);
    expect(notifySuccess).not.toHaveBeenCalled();
    expect(dispatched).not.toContainEqual(
      expect.objectContaining({ type: searchPeopleRequested.type }),
    );
    expect(dispatched).not.toContainEqual(updatePeopleSucceeded());
  });
});
