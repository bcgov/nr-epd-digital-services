import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchResultsActions } from './SearchResultsActions';
import { renderWithQueryRouter } from '../../../../utilities/test/QueryTestUtils';
import * as PeopleApi from '../api/PeopleApi';

vi.mock('../api/PeopleApi', async () => {
  const actual =
    await vi.importActual<typeof import('../api/PeopleApi')>(
      '../api/PeopleApi',
    );
  return {
    ...actual,
    updatePeople: vi.fn(),
  };
});

vi.mock('../../../components/alert/Alert', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyAlert: vi.fn(),
}));

vi.mock('../../../helpers/utility', async () => {
  const actual = await vi.importActual('../../../helpers/utility');
  return {
    ...actual,
    getUser: () => ({ profile: { preferred_username: 'tester' } }),
  };
});

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    signinRedirect: vi.fn(),
  }),
}));

const updatePeopleMock = vi.mocked(PeopleApi.updatePeople);

const selectedRows = [
  {
    id: 1,
    firstName: 'Ada',
    lastName: 'Lovelace',
    isTaxExempt: false,
    isEnvConsultant: false,
    loginUserName: 'ada',
    address_1: '',
    address_2: '',
    city: '',
    prov: '',
    country: '',
    postal: '',
    phone: '',
    mobile: '',
    fax: '',
    email: 'ada@example.com',
  },
];

describe('SearchResultsActions', () => {
  beforeEach(() => {
    updatePeopleMock.mockReset();
  });

  it('disables bulk-action controls while an update is in flight', async () => {
    let resolveUpdate: (value: unknown) => void = () => undefined;
    updatePeopleMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    renderWithQueryRouter(<SearchResultsActions selectedRows={selectedRows} />);

    const deleteButton = screen.getByRole('button', {
      name: /Delete Selected/i,
    });
    expect(deleteButton).not.toBeDisabled();

    await userEvent.click(deleteButton);

    await waitFor(() => expect(deleteButton).toBeDisabled());
    expect(updatePeopleMock).toHaveBeenCalledTimes(1);
    expect(updatePeopleMock.mock.calls[0][0][0].updatedDatetime).toEqual(
      expect.any(String),
    );

    resolveUpdate({
      message: 'Updated',
      httpStatusCode: 200,
      success: true,
      timestamp: '2026-07-22T12:00:00.000Z',
    });

    await waitFor(() => expect(deleteButton).not.toBeDisabled());
  });
});
