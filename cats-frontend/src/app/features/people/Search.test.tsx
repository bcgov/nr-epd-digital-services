import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Search from './Search';
import { RequestStatus } from '../../helpers/requests/status';
import { renderWithQueryRouter } from '../../../utilities/test/QueryTestUtils';
import * as PeopleApi from './api/PeopleApi';

const mockStore = configureStore([thunk]);
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('./api/PeopleApi', async () => {
  const actual =
    await vi.importActual<typeof import('./api/PeopleApi')>('./api/PeopleApi');
  return {
    ...actual,
    searchPeople: vi.fn(),
  };
});

vi.mock('../../components/alert/Alert', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyAlert: vi.fn(),
}));

vi.mock('../../helpers/utility', async () => {
  const actual = await vi.importActual('../../helpers/utility');
  return {
    ...actual,
    isBCEIDUserType: () => false,
  };
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const searchPeopleMock = vi.mocked(PeopleApi.searchPeople);

describe('Search Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      peoples: {
        peoples: [],
        error: '',
        fetchStatus: RequestStatus.idle,
        deleteStatus: RequestStatus.idle,
        addedStatus: RequestStatus.idle,
        updateStatus: RequestStatus.idle,
        searchQuery: '',
        currentPage: 1,
        pageSize: 5,
        resultsCount: 0,
      },
    });
    searchPeopleMock.mockReset();
    mockNavigate.mockReset();
  });

  const renderSearch = (initialEntries = ['/people']) =>
    renderWithQueryRouter(
      <Provider store={store}>
        <Search />
      </Provider>,
      { initialEntries },
    );

  test('renders search input', () => {
    renderSearch();
    expect(screen.getByRole('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Search input')).toBeInTheDocument();
  });

  test('debounced input drives a search and renders results', async () => {
    searchPeopleMock.mockResolvedValue({
      persons: [
        {
          id: 1,
          firstName: 'Ada',
          lastName: 'Lovelace',
          isTaxExempt: false,
          isActive: true,
          createdBy: 'test',
          createdDatetime: '2024-01-01',
        },
      ],
      count: 1,
      page: 1,
      pageSize: 5,
    } as any);

    renderSearch();

    await userEvent.type(screen.getByLabelText('Search input'), 'ada');

    await waitFor(() => expect(searchPeopleMock).toHaveBeenCalled(), {
      timeout: 2000,
    });

    expect(searchPeopleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        searchParam: 'ada',
      }),
      expect.any(AbortSignal),
    );

    await waitFor(() => {
      expect(screen.getByText('Ada')).toBeInTheDocument();
    });
  });
});
