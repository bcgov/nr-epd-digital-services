import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterControls from './FilterControls';
import { IFilterOption } from './IFilterControls';

describe('FilterControls Component', () => {
  const mockOnClick1 = vi.fn();
  const mockOnClick2 = vi.fn();

  const mockOptions: IFilterOption[] = [
    {
      label: 'Option 1',
      value: 'option1',
      onClick: mockOnClick1,
      isSelected: false,
    },
    {
      label: 'Option 2',
      value: 'option2',
      onClick: mockOnClick2,
      isSelected: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (options = mockOptions) => {
    return render(<FilterControls options={options} />);
  };

  it('should render filter options', () => {
    renderComponent();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should apply active class to selected options', () => {
    renderComponent();
    const option1Button = screen.getByText('Option 1').closest('button');
    const option2Button = screen.getByText('Option 2').closest('button');

    expect(option1Button).not.toHaveClass('table-controls__button--selected');
    expect(option2Button).toHaveClass('table-controls__button--selected');
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Option 1'));
    expect(mockOnClick1).toHaveBeenCalledTimes(1);
  });
});
