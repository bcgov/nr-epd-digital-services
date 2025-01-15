import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileNavMenu from './MobileNavMenu';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../Store';

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn().mockReturnValue({ isAuthenticated: false }),
}));

describe('Mobile Menu Component', () => {
  test('renders SideBar component correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          {' '}
          <MobileNavMenu />
        </Router>
      </Provider>,
    );

    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Text Search')).toBeInTheDocument();
  });
});
