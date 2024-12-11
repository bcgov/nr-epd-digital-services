import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from './Form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FormFieldType } from '../input-controls/IFormField';

const mockStore = configureStore([thunk]);
describe('Form component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      Form: {},
    });
  });
  const formRows = [
    [
      {
        type: FormFieldType.Text,
        label: 'Site ID',
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: 'id',
        value: '',
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: 'Site ID can only contain numbers and commas',
        },
        allowNumbersOnly: true,
        colSize: 'col-lg-4 col-md-6 col-sm-12',
      },
      {
        type: FormFieldType.Text,
        label: 'Site Address',
        placeholder: 'Type keywords',
        graphQLPropertyName: 'addrLine_1',
        value: '',
        colSize: 'col-lg-4 col-md-6 col-sm-12',
      },
    ],
    [
      {
        type: FormFieldType.DropDown,
        label: 'Site Remediation Status',
        placeholder: 'Select Code',
        graphQLPropertyName: 'srStatus',
        options: [
          { key: 'Y', value: 'Yes' },
          { key: 'N', value: 'No' },
        ],
        value: '',
        colSize: 'col-lg-4 col-md-6 col-sm-12',
      },
    ],
  ];

  const formData = {
    id: '123',
    addrLine_1: '15288 89 Ave',
    srStatus: 'Y',
  };

  const handleInputChange = jest.fn();

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        {' '}
        <Form
          formRows={formRows}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </Provider>,
    );
  });

  it('renders form rows correctly', () => {
    const { getByLabelText, getByText } = render(
      <Provider store={store}>
        <Form
          formRows={formRows}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </Provider>,
    );
    expect(getByLabelText('Site ID')).toBeInTheDocument();
    expect(getByLabelText('Site Address')).toBeInTheDocument();
    expect(getByLabelText('Site Remediation Status')).toBeInTheDocument();
    expect(getByText('Yes')).toBeInTheDocument();
  });

  it('calls handleInputChange when a form field is changed', () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <Form
          formRows={formRows}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </Provider>,
    );

    fireEvent.change(getByLabelText('Site Remediation Status'), {
      target: { value: 'Y' },
    });
    expect(handleInputChange).toHaveBeenCalledWith('srStatus', 'Y');
  });
});
