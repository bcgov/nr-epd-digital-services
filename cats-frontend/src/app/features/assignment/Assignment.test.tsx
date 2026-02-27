import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Assignment from './Assignment';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('Assignment Component', () => {
  it('renders the Assignment component with site info', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter initialEntries={['/assignment/1']}>
          <Routes>
            <Route path="/assignment/:id" element={<Assignment />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Site Information')).toBeInTheDocument();
  });
});
