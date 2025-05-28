// src/app/features/people/person/Person.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Person from './Person';
import { MockedProvider } from '@apollo/client/testing';
import { GET_PERSON_BY_ID } from './graphql/PersonQueries';
import { fetchPerson } from './services/PersonService';  // Import the service function

vi.mock('./services/PersonService', () => ({
  fetchPerson: vi.fn(),  // Mocked version of the function
}));

// Mocked GraphQL responses
const mocks = [
  {
    request: {
      query: GET_PERSON_BY_ID,
      variables: { id: 1 },  // Match the query parameters
    },
    result: {
      data: {
        findPersonById: {
          message: "Person fetched",
          httpStatusCode: 200,
          success: true,
          timestamp: new Date().toISOString(),
          data: {
            id: '1',
            firstName: 'John',
            middleName: 'Doe',
            lastName: 'Smith',
            isTaxExempt: false,
            loginUserName: 'john.doe',
            address_1: '123 Main St',
            address_2: '',
            city: 'Sample City',
            prov: 'SC',
            email: 'john.doe@example.com',
            country: 'Country',
            postal: '12345',
            phone: '123-456-7890',
            mobile: '987-654-3210',
            fax: '321-654-9870',
            isActive: true,
            permissionIds: [1, 2],
          },
        },
      },
    },
  },
];

describe('Person Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Person />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Create New Person/i)).toBeInTheDocument();
  });

   it('shows the correct title when a person is fetched', async () => {
    const mockPersonData = {
      firstName: 'John',
      middleName: 'Doe',
      lastName: 'Smith',
    };
    fetchPerson.mockResolvedValueOnce(mockPersonData);

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
        
            <Route path="/person/:id" element={  <MockedProvider mocks={mocks} addTypename={false}><Person /></MockedProvider>} />
          
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe Smith')).toBeInTheDocument();
    });
  });

  it('shows LoadingOverlay when loading data', async () => {
    fetchPerson.mockResolvedValueOnce(new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          firstName: 'John',
          middleName: 'Doe',
          lastName: 'Smith',
        });
      }, 500);
    }));

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
          <Route path="/person/:id" element={<MockedProvider mocks={mocks} addTypename={false}><Person /></MockedProvider>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe Smith')).toBeInTheDocument();
    });
  });

  it('opens the note modal when Add Notes is clicked', async () => {
    const mockPersonData = {
      firstName: 'John',
      middleName: 'Doe',
      lastName: 'Smith',
    };

    fetchPerson.mockResolvedValueOnce(mockPersonData);

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
          <Route path="/person/:id" element={<MockedProvider mocks={mocks} addTypename={false}><Person /></MockedProvider>} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText('John Doe Smith');

    fireEvent.click(screen.getByText(/New Note/i));

    const modalElements = await screen.findAllByText('New Note');
    expect(modalElements.length).toBeGreaterThan(0); // Ensure the modal appears
  });
});
