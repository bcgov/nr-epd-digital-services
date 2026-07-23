import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';
import { renderWithQueryRouter } from '../../../utilities/test/QueryTestUtils';
import * as PeopleApi from './api/PeopleApi';

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
  beforeEach(() => {
    searchPeopleMock.mockReset();
    mockNavigate.mockReset();
  });

  const renderSearch = (initialEntries = ['/people']) =>
    renderWithQueryRouter(<Search />, { initialEntries });

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
