import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Widget from './Widget';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);

describe('Widget component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      dashboard: {},
    });
  });
  const tableColumns = []; // Define sample tableColumns array
  const tableData = []; // Define sample tableData array

  it('renders without crashing', () => {
    render(
      <Widget
        title="Test Widget"
        tableColumns={tableColumns}
        tableIsLoading={false}
        tableData={tableData}
      />,
    );
  });

  it('renders title when title prop is provided', () => {
    const { getByText } = render(
      <Widget
        title="Test Widget"
        tableColumns={tableColumns}
        tableIsLoading={false}
        tableData={tableData}
      />,
    );
    expect(getByText('Test Widget')).toBeInTheDocument();
  });

  it('does not render title when hideTitle prop is true', () => {
    const { queryByText } = render(
      <Widget
        hideTitle={true}
        tableColumns={tableColumns}
        tableIsLoading={false}
        tableData={tableData}
      />,
    );
    expect(queryByText('Test Widget')).toBeNull();
  });
});
