import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);

describe('Dashboard Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      dashboard: {
        recentView: {
          data: [
            {
              address: '4123 HILLY ROAD Demo',
              city: 'NORTH VANCOUVER',
              generalDescription:
                'LAT/LON DERIVED BY BC ENVIRONMENT REFERENCING RECTIFIED NAD 83 ORTHOPHOTOGRAPHY - JAN. 27,1997',
              siteId: '9',
              userId: 'xxx-ffff-oooo',
              whenUpdated: '2016-11-22T08:00:00.000Z',
            },
          ],
        },
      },
    });
  });

  it('renders Recently Viewed table', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>,
    );
    expect(getByText('Recently Viewed')).toBeInTheDocument();
  });
});
