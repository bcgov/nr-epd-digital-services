import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Actions from './Actions';

const mockStore = configureStore([thunk]);
describe('Action component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      Action: {},
    });
  });
  const items = [
    { label: 'Action 1', value: 'Action 1' },
    { label: 'Action 2', value: 'Action 2' },
  ];

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Actions label="Actions" items={items} onItemClick={() => {}} />
      </Provider>,
    );
  });

  it('displays dropdown label', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Actions label="Actions" items={items} onItemClick={() => {}} />
      </Provider>,
    );
    expect(getByText('Actions')).toBeInTheDocument();
  });
});
