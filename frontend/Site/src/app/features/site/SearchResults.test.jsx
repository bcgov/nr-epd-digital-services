import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchResults from './SearchResults';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; 
import { RequestStatus } from '../../helpers/requests/status';

const mockStore = configureStore([]);

describe('SearchResults Component', () => {

    let store;

  beforeEach(() => {
    store = mockStore({
        sites: [],
        error: '',
        fetchStatus: RequestStatus.loading,
        deleteStatus: RequestStatus.idle,
        addedStatus: RequestStatus.idle,
        updateStatus: RequestStatus.idle
      });
  });




  test('renders no results found when data is empty', () => {
    const emptyData = [];
    const { container } = render(<Provider store={store}><SearchResults data={emptyData} /></Provider>);
    const noResultsText = screen.getByText('No Results Found');
    expect(noResultsText).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('renders table rows with data', () => {
    const mockData = [
      {
        siteId: 1,
        id: 'site1',
        address: '123 Main St',
        city: 'Cityville',
        provState: 'State',
        whenCreated: '2024-04-04'
      },
      // Add more mock data as needed
    ];
    const { container } = render(<Provider store={store}><SearchResults data={mockData} /></Provider>);
    const siteIdLink = screen.getByText('site1');
    expect(siteIdLink).toBeInTheDocument();
    // Add more assertions as needed for the rendered data
    expect(container).toMatchSnapshot();
  });

  test('checkbox selects row when clicked', () => {
    const mockData = [
      {
        siteId: 1,
        id: 'site1',
        address: '123 Main St',
        city: 'Cityville',
        provState: 'State',
        whenCreated: '2024-04-04'
      },
      // Add more mock data as needed
    ];
    render( <Provider store={store}><SearchResults data={mockData} /></Provider>);
    const checkbox = screen.getByLabelText('Select Row');
    expect(checkbox).toBeInTheDocument();
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});