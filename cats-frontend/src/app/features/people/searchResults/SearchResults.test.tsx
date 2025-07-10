import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchResults from './SearchResults';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { RequestStatus } from '../../../helpers/requests/status';
import { getPeopleSearchResultsColumns } from '../dto/Columns';

const mockStore = configureStore([]);

describe('SearchResults Component', () => {
  let store: MockStoreEnhanced<unknown, {}>;

  beforeEach(() => {
    store = mockStore({
      peoples: [],
      error: '',
      fetchStatus: RequestStatus.loading,
      deleteStatus: RequestStatus.idle,
      addedStatus: RequestStatus.idle,
      updateStatus: RequestStatus.idle,
    });
  });

  test('renders no results found when data is empty', () => {
    const emptyData: any[] = [];
    const { container } = render(
      <Provider store={store}>
        <SearchResults
          data={emptyData}
          pageChange={() => {}}
          columns={[]}
          totalRecords={0}
          changeHandler={vi.fn}
        />
      </Provider>,
    );
    const noResultsText = screen.getByText('No Results Found');
    expect(noResultsText).toBeInTheDocument();
  });

  test('renders table rows with data', () => {
    const mockData = [
      {
        peopleId: 1,
        id: 'people1',
        address: '123 Main St',
        city: 'Cityville',
        provState: 'State',
        whenCreated: '2024-04-04',
      },
    ];

    const router = createBrowserRouter([
      {
        element: (
          <SearchResults
            data={mockData}
            pageChange={(currentPage, resultsPerPage) => {}}
            columns={getPeopleSearchResultsColumns()}
            totalRecords={0}
            changeHandler={vi.fn}
          />
        ),
        path: '/',
      },
    ]);

    const { container } = render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
    );
    const peopleIdLink = screen.getByText('View');
    expect(peopleIdLink).toBeInTheDocument();
  });

  test('checkbox selects row when clicked', async () => {
    const mockData = [
      {
        peopleId: 1,
        id: 'people1',
        address: '123 Main St',
        city: 'Cityville',
        provState: 'State',
        whenCreated: '2024-04-04',
      },
    ];
    const router = createBrowserRouter([
      {
        element: (
          <SearchResults
            data={mockData}
            columns={getPeopleSearchResultsColumns()}
            pageChange={vi.fn()}
            totalRecords={0}
            changeHandler={vi.fn()}
          />
        ),
        path: '/',
      },
    ]);
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
    );
    const checkbox = screen.getByLabelText('Select Row');

    expect(checkbox).toBeInTheDocument();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('renders with no columns provided', () => {
    const columns = getPeopleSearchResultsColumns();

    const mockData = [
      {
        peopleId: 1,
        id: 'people1',
        address: '123 Main St',
        city: 'Cityville',
        provState: 'State',
        whenCreated: '2024-04-04',
      },
    ];

    const router = createBrowserRouter([
      {
        element: (
          <SearchResults
            data={mockData}
            columns={columns}
            pageChange={vi.fn()}
            totalRecords={0}
            changeHandler={vi.fn}
          />
        ),
        path: '/',
      },
    ]);
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
    );
    const peopleIdLink = screen.getByText('View');
    expect(peopleIdLink).toBeInTheDocument();
  });
});
