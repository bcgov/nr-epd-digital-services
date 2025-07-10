import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import Dashboard, { DashboardCardsWidget } from './Dashboard';
import {
  GetRecentViewedApplicationsDocument,
  GetApplicationsDocument,
} from './graphql/dashboard.generated';
import { vi } from 'vitest';
import { getUser, parseLocalDate } from '../../helpers/utility';

vi.mock('../../helpers/utility', () => ({
  getUser: vi.fn(),
  parseLocalDate: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockRecentApplications = [
  {
    applicationId: 101,
    siteId: 202,
    address: '123 Test Street',
    applicationType: 'Permit',
    applicationStatus: 'Pending',
    priority: 'High',
    receivedDate: '2024-05-01',
  },
  {
    applicationId: 102,
    siteId: 203,
    address: '456 Another Ave',
    applicationType: 'License',
    applicationStatus: 'Approved',
    priority: 'Medium',
    receivedDate: '2024-04-15',
  },
];

const mockApplications = [
  {
    applicationId: 101,
    siteId: 202,
    address: 'Test Street 1',
    applicationType: 'Application',
    applicationStatus: 'Rejected',
    priority: 'High',
    receivedDate: '2024-05-01',
  },
  {
    applicationId: 102,
    siteId: 203,
    address: 'Test Street 2',
    applicationType: 'Compliance',
    applicationStatus: 'Review',
    priority: 'Medium',
    receivedDate: '2024-04-15',
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
          data: mockRecentApplications,
        },
      },
    },
  },
  {
    request: {
      query: GetApplicationsDocument,
    },
    result: {
      data: {
        getApplications: {
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
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Welcome, Alice/i)).toBeInTheDocument(),
    );
  });

  it('renders recent applications when data is returned', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>,
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
      </MemoryRouter>,
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
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(
        screen.getByText(/No recent applications visited by user/i),
      ).toBeInTheDocument(),
    );
  });

  it('renders without crashing when user is null', async () => {
    getUser.mockReturnValue(null);

    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>,
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
      </MemoryRouter>,
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
      />,
    );

    fireEvent.click(screen.getByText('TestApp'));
    expect(mockClick).toHaveBeenCalledWith(
      expect.objectContaining({ siteId: 111 }),
    );
  });

  it('DashboardCardsWidget renders fallback when no data is passed', () => {
    render(<DashboardCardsWidget data={[]} />);

    expect(
      screen.getByText(/No recent applications visited by user/i),
    ).toBeInTheDocument();
  });

  it('DashboardCardsWidget renders nothing when data is undefined', () => {
    render(<DashboardCardsWidget data={undefined} />);

    expect(
      screen.getByText(/No recent applications visited by user/i),
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      // Should not throw errors — fallback content may be blank
      expect(screen.getByText('Welcome, Bob')).toBeInTheDocument();
    });
  });

  it('renders action required applications when data is returned', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>,
    );

    await screen.findByText('Rejected');
    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('shows empty state when no action required applications are found', async () => {
    const emptyMocks = [
      {
        request: {
          query: GetApplicationsDocument,
        },
        result: {
          data: {
            getApplications: {
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/No data/i) ||
          screen.queryByText(/No recent applications/i),
      ).toBeInTheDocument();
    });
  });

  it('shows loading state for action required section', async () => {
    const slowMocks = [
      ...mocks,
      {
        request: {
          query: GetApplicationsDocument,
        },
        result: {
          data: {
            getApplications: {
              httpStatusCode: 200,
              success: true,
              message: 'Fetched',
              timestamp: new Date().toISOString(),
              data: [],
            },
          },
        },
        delay: 1000, // Simulate loading
      },
    ];

    render(
      <MemoryRouter>
        <MockedProvider mocks={slowMocks} addTypename={false}>
          <Dashboard />
        </MockedProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  it('renders gracefully when action required data has nulls', async () => {
    const malformedMocks = [
      {
        request: {
          query: GetApplicationsDocument,
        },
        result: {
          data: {
            getApplications: {
              httpStatusCode: 200,
              success: true,
              message: 'OK',
              timestamp: new Date().toISOString(),
              data: [
                {
                  applicationId: 999,
                  siteId: null,
                  address: null,
                  applicationType: null,
                  applicationStatus: null,
                  receivedDate: null,
                  priority: null,
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Action Required')).toBeInTheDocument();
    });
  });
});
