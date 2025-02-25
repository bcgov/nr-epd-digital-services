import React from 'react';
import { render, screen } from '@testing-library/react';
import SideBar from './SideBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../Store';

describe.skip('SideBar Component', () => {
  test('renders SideBar component correctly', () => {
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
