import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NavigationPills from './NavigationPills';

describe('NavigationPills Component', () => {
  const components = [
    { value: 'tab1', label: 'Tab 1', component: <div>Content 1</div> },
    { value: 'tab2', label: 'Tab 2', component: <div>Content 2</div> },
  ];

  const renderWithRouter = (initialEntries?: string[]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route
            path="/"
            element={
              <NavigationPills components={components} tabSearchKey="testTab" />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('renders all tabs', () => {
    renderWithRouter();

    expect(screen.getAllByText('Tab 1')).toHaveLength(2); // both desktop and mobile view controls are in the DOM
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  test('displays the correct content when a tab is clicked', () => {
    renderWithRouter();

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  describe.skip('Initial Tab Logic', () => {
    test('sets the initial tab based on search params', () => {
      renderWithRouter(['/?testTab=tab2']);
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    test('defaults to the first tab if search param is not found', () => {
      renderWithRouter(['/']);
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    test('defaults to the first tab if search param is invalid', () => {
      renderWithRouter(['/?testTab=invalidTab']);
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });
});
