import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { ApplicationsV2SearchInput } from './ApplicationsV2SearchInput';
import { useApplicationsV2SearchParams } from './hooks/useApplicationsV2SearchParams';
import { renderWithQueryRouter } from '../../../../utilities/test/QueryTestUtils';

const SearchFlow = () => {
  const { search, setSearch, variables } = useApplicationsV2SearchParams();

  return (
    <div>
      <ApplicationsV2SearchInput search={search} onSearchChange={setSearch} />
      <output data-testid="search-param">{variables.searchParam}</output>
      <output data-testid="page">{variables.page}</output>
    </div>
  );
};

describe('Applications V2 search flow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces typing into URL search and query variables, resetting page', async () => {
    vi.useFakeTimers();

    renderWithQueryRouter(<SearchFlow />, {
      initialEntries: ['/applications?page=3'],
    });

    const input = screen.getByRole('searchbox', {
      name: /search applications/i,
    });

    fireEvent.change(input, { target: { value: 'site' } });

    expect(screen.getByTestId('search-param')).toHaveTextContent('');
    expect(screen.getByTestId('page')).toHaveTextContent('3');

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    vi.useRealTimers();

    await waitFor(() => {
      expect(screen.getByTestId('search-param')).toHaveTextContent('site');
      expect(screen.getByTestId('page')).toHaveTextContent('1');
    });
  });

  it('hydrates the input from a shared search URL', () => {
    renderWithQueryRouter(<SearchFlow />, {
      initialEntries: ['/applications?search=shared-link'],
    });

    expect(
      screen.getByRole('searchbox', { name: /search applications/i }),
    ).toHaveValue('shared-link');
    expect(screen.getByTestId('search-param')).toHaveTextContent('shared-link');
  });
});
