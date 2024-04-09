import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux'; // Import Provider
import Search from './Search';
import configureStore from 'redux-mock-store'; // Import configureStore
import { RequestStatus } from '../../helpers/requests/status';


const mockStore = configureStore([]);

describe('Search Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
        sites: [],
        error: '',
        fetchStatus: RequestStatus.idle,
        deleteStatus: RequestStatus.idle,
        addedStatus: RequestStatus.idle,
        updateStatus: RequestStatus.idle
      });
  });

  test('renders search input', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}> {/* Wrap your component with Provider and pass the mock store */}
        <Search />
      </Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();
  });

  // Add more test cases as needed
});
