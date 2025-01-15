import React from 'react';
import { render, screen } from '@testing-library/react';
import SideBar from './SideBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../Store';
import { useAuth } from 'react-oidc-context';

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn().mockReturnValue({ isAuthenticated: false }),
}));

describe('SideBar Component', () => {
  test('renders SideBar component correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(
      <Provider store={store}>
        <Router>
          {' '}
          <SideBar />
        </Router>
      </Provider>,
    );

    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Text Search')).toBeInTheDocument();
  });
});
