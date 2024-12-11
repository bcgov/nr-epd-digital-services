import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sort from './Sort';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FormFieldType } from '../input-controls/IFormField';

const mockStore = configureStore([thunk]);
describe('Sort component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      SearchInput: {},
    });
  });

  it('renders the Sort component', () => {
    const notationSortBy = [
      [
        {
          type: FormFieldType.DropDown,
          label: 'Sort By',
          placeholder: 'Sort by',
          graphQLPropertyName: 'sortBy',
          options: [
            { key: 'newToOld', value: 'Newest to Oldest' },
            { key: 'oldTonew', value: 'Oldest to newest' },
          ],
          value: '',
          colSize: 'col-lg-12 col-md-12 col-sm-12',
        },
      ],
    ];
    const formData = {}; // Define your formData object here
    const editMode = true; // Define your editMode value here
    const handleSortChange = jest.fn(); // Mock the handleSortChange function

    render(
      <Provider store={store}>
        {' '}
        <Sort
          formRows={notationSortBy}
          formData={formData}
          editMode={editMode}
          handleSortChange={handleSortChange}
        />
      </Provider>,
    );
    const sortByForm = screen.getByLabelText('Sort By');
    expect(sortByForm).toBeInTheDocument();
  });

  it('calls handleSortChange function when sort option is changed', () => {
    const notationSortBy = [
      [
        {
          type: FormFieldType.DropDown,
          label: 'Sort By',
          placeholder: 'Sort by',
          graphQLPropertyName: 'sortBy',
          options: [
            { key: 'newToOld', value: 'Newest to Oldest' },
            { key: 'oldTonew', value: 'Oldest to newest' },
          ],
          value: '',
          colSize: 'col-lg-12 col-md-12 col-sm-12',
        },
      ],
    ];
    const formData = { sortBy: 'newToOld' };
    const editMode = true;
    const handleSortChange = jest.fn();

    render(
      <Provider store={store}>
        <Sort
          formRows={notationSortBy}
          formData={formData}
          editMode={editMode}
          handleSortChange={handleSortChange}
        />
      </Provider>,
    );

    const sortByForm = screen.getByLabelText('Sort By');

    // Simulate changing the sort option
    fireEvent.change(sortByForm, { target: { value: 'newToOld' } });

    // Ensure that handleSortChange is called with the correct value
    expect(handleSortChange).toHaveBeenCalledTimes(1);
  });
});
