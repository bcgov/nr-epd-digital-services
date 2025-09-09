import React from 'react';
import { render, screen } from '@testing-library/react';
import SideBar from './SideBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../Store';

describe('SideBar Component', () => {
  test('renders SideBar component correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          {' '}
          <SideBar />
        </Router>
      </Provider>,
    );

    expect(screen.getAllByRole('menu').length).toBeGreaterThan(0);
  });
});
