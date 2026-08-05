import { fireEvent, screen, waitFor } from '@testing-library/react';
import FilterPills from '../../../components/filter/FilterPills';
import { renderWithQueryRouter } from '../../../../utilities/test/QueryTestUtils';
import { ApplicationsV2FilterPanel } from './filters/ApplicationsV2FilterPanel';
import { useApplicationsV2SearchParams } from './hooks/useApplicationsV2SearchParams';

const FiltersFlow = () => {
  const {
    advancedFilters,
    filterPills,
    applyAdvancedFilters,
    resetAdvancedFilters,
    removeFilterPill,
    variables,
  } = useApplicationsV2SearchParams();

  return (
    <div>
      <ApplicationsV2FilterPanel
        appliedFilters={advancedFilters}
        onApply={applyAdvancedFilters}
        onReset={resetAdvancedFilters}
        onCancel={() => undefined}
      />
      <FilterPills filters={filterPills} onRemoveFilter={removeFilterPill} />
      <output data-testid="filter-id">{variables.filterId ?? ''}</output>
      <output data-testid="filter-priority">
        {variables.filterPriority ?? ''}
      </output>
      <output data-testid="page">{variables.page}</output>
    </div>
  );
};

describe('Applications V2 filters flow', () => {
  it('applies draft panel filters to URL variables and pills, resetting page', async () => {
    renderWithQueryRouter(<FiltersFlow />, {
      initialEntries: ['/applications-v2?page=3'],
    });

    fireEvent.change(screen.getByLabelText('Application ID'), {
      target: { value: '42' },
    });
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'High' },
    });

    expect(screen.getByTestId('filter-id')).toHaveTextContent('');
    expect(screen.getByTestId('page')).toHaveTextContent('3');

    fireEvent.click(screen.getByTestId('Apply Filters'));

    await waitFor(() => {
      expect(screen.getByTestId('filter-id')).toHaveTextContent('42');
      expect(screen.getByTestId('filter-priority')).toHaveTextContent('High');
      expect(screen.getByTestId('page')).toHaveTextContent('1');
    });

    expect(screen.getByText('Application ID : 42')).toBeInTheDocument();
    expect(screen.getByText('Priority : High')).toBeInTheDocument();
  });

  it('removes a pill from the URL and resets page', async () => {
    renderWithQueryRouter(<FiltersFlow />, {
      initialEntries: ['/applications-v2?page=2&id=9&priority=Low'],
    });

    expect(screen.getByText('Application ID : 9')).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove Application ID filter' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('filter-id')).toHaveTextContent('');
      expect(screen.getByTestId('filter-priority')).toHaveTextContent('Low');
      expect(screen.getByTestId('page')).toHaveTextContent('1');
    });
    expect(screen.queryByText('Application ID : 9')).not.toBeInTheDocument();
  });

  it('hydrates filters and pills from a shared URL', () => {
    renderWithQueryRouter(<FiltersFlow />, {
      initialEntries: [
        '/applications-v2?id=5&siteRiskClassification=pending',
      ],
    });

    expect(screen.getByLabelText('Application ID')).toHaveValue('5');
    expect(screen.getByLabelText('Site Risk Classification')).toHaveValue(
      'pending',
    );
    expect(screen.getByText('Application ID : 5')).toBeInTheDocument();
    expect(
      screen.getByText('Site Risk Classification : Pending'),
    ).toBeInTheDocument();
  });
});
