import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);

describe('Dashboard Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
        dashboard: {},
        });
    });

  test('renders Recently Viewed table', () => {
    const { getByText } = render(<Provider store={store}><Dashboard /></Provider>);
    expect(getByText('Recently Viewed')).toBeInTheDocument();
  });

  test('renders Recently Modified Folios table', () => {
    const { getByText } = render(<Provider store={store}><Dashboard /></Provider>);
    expect(getByText('Recently Modified Folios')).toBeInTheDocument();
  });
});
