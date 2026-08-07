import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('applies the active class when active is true', () => {
    render(
      <Button variant="tertiary" active>
        Filter
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Filter' })).toHaveClass(
      'btn-active',
    );
  });

  it('omits the active class when active is false', () => {
    render(<Button variant="tertiary">Filter</Button>);

    expect(screen.getByRole('button', { name: 'Filter' })).not.toHaveClass(
      'btn-active',
    );
  });

  it('merges a custom className with variant and size classes', () => {
    render(
      <Button variant="secondary" size="small" className="custom-class">
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('SITE-Button', 'secondary', 'small');
    expect(button).toHaveClass('custom-class');
  });
});
