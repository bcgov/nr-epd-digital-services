import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Assignment from './Assignment';
import { MockedProvider } from '@apollo/client/testing';

describe('Assignment Component', () => {
  it('renders the Assignment component with site info', async () => {
    const mockClose = vi.fn();
    const mockSave = vi.fn();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Assignment
          id="1"
          modalCloseHandler={mockClose}
          modalSaveHandler={mockSave}
        />
      </MockedProvider>,
    );

    expect(screen.getByText('Site Information')).toBeInTheDocument();
  });
});
