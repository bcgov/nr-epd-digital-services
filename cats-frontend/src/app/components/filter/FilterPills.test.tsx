import { fireEvent, render, screen } from '@testing-library/react';
import FilterPills from './FilterPills';

vi.mock('../common/icon', () => ({
  XmarkIcon: () => <span>XmarkIcon</span>,
}));

describe('FilterPills', () => {
  const onRemoveFilter = vi.fn();
  const filters = [
    { key: 'id', value: '1', label: 'Application ID' },
    { key: 'priority', value: 'High', label: 'Priority' },
  ];

  beforeEach(() => {
    onRemoveFilter.mockReset();
  });

  it('renders each pill label and value', () => {
    render(<FilterPills filters={filters} onRemoveFilter={onRemoveFilter} />);

    expect(screen.getByText('Application ID : 1')).toBeInTheDocument();
    expect(screen.getByText('Priority : High')).toBeInTheDocument();
  });

  it('calls onRemoveFilter when a pill remove control is clicked', () => {
    render(<FilterPills filters={filters} onRemoveFilter={onRemoveFilter} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Remove Application ID filter' }),
    );

    expect(onRemoveFilter).toHaveBeenCalledWith(filters[0]);
  });

  it('renders an empty container when there are no pills', () => {
    render(<FilterPills filters={[]} onRemoveFilter={onRemoveFilter} />);

    expect(screen.getByTestId('filter-pill')).toBeEmptyDOMElement();
  });
});
