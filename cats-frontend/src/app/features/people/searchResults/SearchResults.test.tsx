import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchResults from './SearchResults';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RequestStatus } from '../../../helpers/requests/status';
import { getPeopleSearchResultsColumns } from '../dto/Columns';

describe('SearchResults Component', () => {
  test('renders no results found when data is empty', () => {
    render(
      <SearchResults
        data={[]}
        pageChange={() => {}}
        columns={[]}
        totalRecords={0}
        changeHandler={vi.fn}
        isLoading={RequestStatus.idle}
        currentPage={1}
        resultsPerPage={5}
      />,
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
            isLoading={RequestStatus.success}
            currentPage={1}
            resultsPerPage={5}
          />
        ),
        path: '/',
      },
    ]);

    render(<RouterProvider router={router} />);
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
            isLoading={RequestStatus.success}
            currentPage={1}
            resultsPerPage={5}
          />
        ),
        path: '/',
      },
    ]);
    render(<RouterProvider router={router} />);
    const checkbox = screen.getByLabelText('Select Row');

    expect(checkbox).toBeInTheDocument();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('receives loading state as a prop', () => {
    render(
      <SearchResults
        data={[]}
        pageChange={vi.fn()}
        columns={[]}
        totalRecords={0}
        changeHandler={vi.fn()}
        isLoading={RequestStatus.loading}
        currentPage={1}
        resultsPerPage={5}
      />,
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Searching')).toBeInTheDocument();
  });
});
