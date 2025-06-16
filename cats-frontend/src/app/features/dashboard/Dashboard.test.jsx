import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import Dashboard, { DashboardCardsWidget } from './Dashboard';
import { GetRecentViewedApplicationsDocument } from './graphql/dashboard.generated';
import { vi } from 'vitest';
import { getUser } from '../../helpers/utility';


vi.mock('../../helpers/utility', () => ({
  getUser: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockApplications = [
  {
    userId: 'u1',
    applicationId: 101,
    siteId: 202,
    address: '123 Test Street',
    applicationType: 'Permit',
  },
  {
    userId: 'u1',
    applicationId: 102,
    siteId: 203,
    address: '456 Another Ave',
    applicationType: 'License',
  },
];

const mocks = [
  {
    request: {
      query: GetRecentViewedApplicationsDocument,
    },
    result: {
      data: {
        getRecentViewedApplications: {
          httpStatusCode: 200,
          success: true,
          message: 'Fetched',
          timestamp: new Date().toISOString(),
          data: mockApplications,
        },
      },
    },
  },
];

describe('Dashboard Component', () => {

  beforeEach(() => {
    getUser.mockReturnValue({
      profile: { given_name: 'Alice' },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
  });

  it('renders welcome message with user name', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Welcome, Alice/i)).toBeInTheDocument()
    );
  });

  it('renders recent applications when data is returned', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>
    );

    await screen.findByText('Permit');
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.getByText('License')).toBeInTheDocument();
  });

  it('navigates to application detail on card click', async () => {
    getUser.mockReturnValue({ profile: { given_name: 'Alice' } });

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>
    );

    await screen.findByText('Permit');
    fireEvent.click(screen.getByText('Permit'));

    expect(mockNavigate).toHaveBeenCalledWith('/applications/101', {
      state: { from: 'Dashboard' },
    });
  });

  it('shows fallback when no applications returned', async () => {
    const emptyMocks = [
      {
        request: {
          query: GetRecentViewedApplicationsDocument,
        },
        result: {
          data: {
            getRecentViewedApplications: {
              httpStatusCode: 200,
              success: true,
              message: 'Fetched',
              timestamp: new Date().toISOString(),
              data: [],
            },
          },
        },
      },
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={emptyMocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(/No recent applications visited by user/i)
      ).toBeInTheDocument()
    );
  });

  it('renders without crashing when user is null', async () => {
    getUser.mockReturnValue(null);

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>
    );

    await screen.findByText('Welcome');
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('shows loading state while fetching data', async () => {
    getUser.mockReturnValue({ profile: { given_name: 'Alice' } });

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome, Alice/i)).toBeInTheDocument();
    // While loading, nothing should be rendered yet
    expect(screen.queryByText('Permit')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Permit')).toBeInTheDocument();
    });
  });

  it('DashboardCardsWidget invokes onButtonClick when card is clicked', async () => {
    const mockClick = vi.fn();

    render(
      <DashboardCardsWidget
        data={[
          {
            applicationType: 'TestApp',
            siteId: 111,
            address: '777 Road',
          },
        ]}
        onButtonClick={mockClick}
      />
    );

    fireEvent.click(screen.getByText('TestApp'));
    expect(mockClick).toHaveBeenCalledWith(
      expect.objectContaining({ siteId: 111 })
    );
  });

  it('DashboardCardsWidget renders fallback when no data is passed', () => {
    render(<DashboardCardsWidget data={[]} />);

    expect(
      screen.getByText(/No recent applications visited by user/i)
    ).toBeInTheDocument();
  });

  it('DashboardCardsWidget renders nothing when data is undefined', () => {
    render(<DashboardCardsWidget data={undefined} />);

    expect(
      screen.getByText(/No recent applications visited by user/i)
    ).toBeInTheDocument();
  });

  it('renders gracefully with malformed application data (null fields)', async () => {
    getUser.mockReturnValue({ profile: { given_name: 'Bob' } });

    const malformedMocks = [
      {
        request: {
          query: GetRecentViewedApplicationsDocument,
        },
        result: {
          data: {
            getRecentViewedApplications: {
              httpStatusCode: 200,
              success: true,
              message: 'OK',
              timestamp: new Date().toISOString(),
              data: [
                {
                  userId: 'u1',
                  applicationId: 999,
                  siteId: null,
                  address: null,
                  applicationType: null,
                },
              ],
            },
          },
        },
      },
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={malformedMocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Should not throw errors — fallback content may be blank
      expect(screen.getByText('Welcome, Bob')).toBeInTheDocument();
    });
  });
});
