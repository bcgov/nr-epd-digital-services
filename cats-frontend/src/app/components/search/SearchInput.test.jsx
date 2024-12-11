import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
describe('SearchInput', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      SearchInput: {},
    });
  });

  it('renders without crashing', () => {
    const handleSearchChange = jest.fn();
    const clearSearch = jest.fn();
    render(
      <Provider store={store}>
        {' '}
        <SearchInput
          label="Search"
          searchTerm=""
          clearSearch={clearSearch}
          handleSearchChange={handleSearchChange}
        />
      </Provider>,
    );
    const searchInput = screen.getByLabelText('Search');
    expect(searchInput).toBeInTheDocument();
  });

  it('displays label if provided', () => {
    const handleSearchChange = jest.fn();
    const clearSearch = jest.fn();
    render(
      <Provider store={store}>
        {' '}
        <SearchInput
          label="Search"
          searchTerm=""
          clearSearch={clearSearch}
          handleSearchChange={handleSearchChange}
        />
      </Provider>,
    );
    const searchInputLabel = screen.getByText('Search');
    expect(searchInputLabel).toBeInTheDocument();
  });

  it('invokes handleSearchChange on input change', () => {
    const handleSearchChange = jest.fn();
    const clearSearch = jest.fn();
    render(
      <Provider store={store}>
        {' '}
        <SearchInput
          label="Search"
          searchTerm=""
          clearSearch={clearSearch}
          handleSearchChange={handleSearchChange}
        />
      </Provider>,
    );
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(handleSearchChange).toHaveBeenCalledTimes(1);
  });

  it('displays search icon when searchTerm is empty', () => {
    const handleSearchChange = jest.fn();
    const clearSearch = jest.fn();
    const { container } = render(
      <Provider store={store}>
        {' '}
        <SearchInput
          label="Search"
          searchTerm=""
          clearSearch={clearSearch}
          handleSearchChange={handleSearchChange}
        />
      </Provider>,
    );
    const searchIcon = container.querySelector('#search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('displays clear icon when searchTerm is not empty', () => {
    const handleSearchChange = jest.fn();
    const clearSearch = jest.fn();
    const { container } = render(
      <Provider store={store}>
        {' '}
        <SearchInput
          label="Search"
          searchTerm="test"
          clearSearch={clearSearch}
          handleSearchChange={handleSearchChange}
        />
      </Provider>,
    );
    const clearIcon = container.querySelector('#clear-icon');
    expect(clearIcon).toBeInTheDocument();
  });

  it('invokes clearSearch function when clear icon is clicked', () => {
    const handleSearchChange = jest.fn();
    const clearSearch = jest.fn();
    const { container } = render(
      <Provider store={store}>
        {' '}
        <SearchInput
          label="Search"
          searchTerm="test"
          clearSearch={clearSearch}
          handleSearchChange={handleSearchChange}
        />
      </Provider>,
    );
    const clearIcon = container.querySelector('#clear-icon');
    fireEvent.click(clearIcon);
    expect(clearSearch).toHaveBeenCalledTimes(1);
  });
});
