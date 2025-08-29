import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileNavMenu from './MobileNavMenu';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../Store';

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

    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });
});
