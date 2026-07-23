import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { SearchResultsActions } from './SearchResultsActions';
import { RequestStatus } from '../../../helpers/requests/status';
import { updatePeopleRequested } from '../dto/PeopleSlice';
import * as utility from '../../../helpers/utility';

vi.mock('../../../helpers/utility', async () => {
  const actual = await vi.importActual<
    typeof import('../../../helpers/utility')
  >('../../../helpers/utility');
  return {
    ...actual,
    getUser: vi.fn(),
  };
});

const mockStore = configureStore([]);

const selectedRows = [
  {
    id: 1,
    firstName: 'Jane',
    lastName: 'Smith',
    isTaxExempt: false,
    isEnvConsultant: false,
    loginUserName: 'jsmith',
    address_1: '1 Main',
    address_2: '',
    city: 'Victoria',
    prov: 'BC',
    country: 'CA',
    postal: 'V8V1A1',
    phone: '250-555-0100',
    mobile: '',
    fax: '',
    email: 'jane@example.com',
  },
];

const renderActions = (updateStatus: string) => {
  const store: MockStoreEnhanced<unknown, {}> = mockStore({
    peoples: {
      updateStatus,
    },
  });

  render(
    <Provider store={store}>
      <SearchResultsActions selectedRows={selectedRows} />
    </Provider>,
  );

  return store;
};

describe('SearchResultsActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (utility.getUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      profile: { preferred_username: 'jsmith' },
    });
  });

  it('disables mutation controls while update status is loading', () => {
    renderActions(RequestStatus.loading);

    expect(
      screen.getByRole('button', { name: /Set Active Status/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /Delete Selected/i }),
    ).toBeDisabled();
  });

  it('dispatches updatePeopleRequested with ISO timestamps on activate', async () => {
    const user = userEvent.setup();
    const store = renderActions(RequestStatus.idle);

    await user.click(
      screen.getByRole('button', { name: /Set Active Status/i }),
    );
    await user.click(screen.getByText('Active'));

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe(updatePeopleRequested.type);
    expect(actions[0].payload[0].isActive).toBe(true);
    expect(typeof actions[0].payload[0].updatedDatetime).toBe('string');
    expect(actions[0].payload[0].updatedDatetime).toMatch(
      /^\d{4}-\d{2}-\d{2}T/,
    );
  });

  it('keeps controls enabled when idle and rows are selected', () => {
    renderActions(RequestStatus.idle);

    expect(
      screen.getByRole('button', { name: /Set Active Status/i }),
    ).not.toBeDisabled();
    expect(
      screen.getByRole('button', { name: /Delete Selected/i }),
    ).not.toBeDisabled();
  });
});
