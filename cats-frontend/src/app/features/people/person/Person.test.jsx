import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Person from './Person';
import { fetchPerson } from './services/PersonService';

// Mocking the API call
// jest.mock('./services/PersonService', () => ({
//   fetchPerson: jest.fn(),
// }));

describe.skip('Person Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clears the mock state to prevent stale values
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Person />
      </MemoryRouter>,
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
          <Route path="/person/:id" element={<Person />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe Smith')).toBeInTheDocument();
    });
  });

  it('shows LoadingOverlay when loading data', () => {
    fetchPerson.mockResolvedValueOnce(null); // Mock to simulate loading

    render(
      <MemoryRouter initialEntries={['/person/1']}>
        <Routes>
          <Route path="/person/:id" element={<Person />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
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
          <Route path="/person/:id" element={<Person />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe Smith')).toBeInTheDocument();
      fireEvent.click(screen.getByText(/New Note/i)); // assuming button contains this text
      const modalElements = screen.getAllByText('New Note');
      expect(modalElements.length).toBeGreaterThan(0); // Ensure at least one "New Note" is found
    });
  });
});
