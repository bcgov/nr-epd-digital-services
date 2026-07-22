import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Search from './Search';
import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RequestStatus } from '../../helpers/requests/status';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const mockStore = configureStore([thunk]);
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// I am confident these tests were copy-pasted from the SITE repo and were never actually green
// PLEASE FIX
describe('Search Component', () => {
  let store: MockStore;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
  });

  beforeEach(() => {
    store = mockStore({
      sites: {
        sites: [],
      },
      peoples: {
        peoples: [],
      },
      error: '',
      fetchStatus: RequestStatus.idle,
      deleteStatus: RequestStatus.idle,
      addedStatus: RequestStatus.idle,
      updateStatus: RequestStatus.idle,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
  });
  test('renders search input', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>
      </Provider>,
    );

    expect(screen.getByRole('Search')).toBeInTheDocument();
  });

  test('dispatches a typed search request when the user types 3 or more characters', () => {
    render(
      <Provider store={store}>
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>
      </Provider>,
    );

    const input = screen.getByPlaceholderText('Search People');
    fireEvent.change(input, { target: { value: 'sam' } });

    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: 'peoples/searchPeopleRequested',
        payload: expect.objectContaining({ searchParam: 'sam' }),
      }),
    );
  });

  test('dispatches a typed search request when the match mode changes', () => {
    store = mockStore({
      sites: { sites: [] },
      peoples: {
        peoples: [],
        searchQuery: 'sam',
        currentPage: 1,
        pageSize: 10,
        error: '',
        fetchStatus: RequestStatus.idle,
        deleteStatus: RequestStatus.idle,
        addedStatus: RequestStatus.idle,
        updateStatus: RequestStatus.idle,
      },
    });

    render(
      <Provider store={store}>
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>
      </Provider>,
    );
    store.clearActions();

    fireEvent.click(screen.getByLabelText('Match All (AND)'));

    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: 'peoples/searchPeopleRequested',
        payload: expect.objectContaining({ searchMode: 'AND' }),
      }),
    );
  });
});
