import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import ColumnSelect from './ColumnSelect';
import { TableColumn, ColumnSize } from '../table/TableColumn';
import { FormFieldType } from '../input-controls/IFormField';
import {
  useSaveUserColumnPreferencesMutation,
  useGetUserColumnPreferencesQuery,
} from '../../graphql/columnPreferences.generated';

vi.mock('../../graphql/columnPreferences.generated', () => ({
  useSaveUserColumnPreferencesMutation: vi.fn(),
  useGetUserColumnPreferencesQuery: vi.fn(),
}));

const mockColumns: TableColumn[] = [
  new TableColumn(
    1,
    'Application ID',
    true,
    'id',
    undefined,
    false,
    true,
    1,
    true,
    { type: FormFieldType.Label },
    undefined,
    false,
    ColumnSize.Default,
    '',
  ),
  new TableColumn(
    2,
    'Site ID',
    false,
    'siteId',
    undefined,
    false,
    true,
    2,
    false,
    { type: FormFieldType.Label },
    undefined,
    false,
    ColumnSize.Default,
    '',
  ),
];

describe('ColumnSelect Component', () => {
  const mockHandleColumnChange = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockSaveColumnPreferences = vi.fn();

  const defaultProps = {
    columns: mockColumns,
    handleColumnChange: mockHandleColumnChange,
    onSubmit: mockOnSubmit,
    page: 'applications',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSaveUserColumnPreferencesMutation as any).mockReturnValue([
      mockSaveColumnPreferences,
      { loading: false, error: null },
    ]);
    (useGetUserColumnPreferencesQuery as any).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  const renderComponent = (props = {}) => {
    return render(
      <MockedProvider mocks={[]}>
        <ColumnSelect {...defaultProps} {...props} />
      </MockedProvider>,
    );
  };

  it('should render columns', () => {
    renderComponent();
    expect(screen.getByText('Application ID')).toBeInTheDocument();
    expect(screen.getByText('Site ID')).toBeInTheDocument();
  });

  it('should toggle column when clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const siteIdCheckbox = screen.getByLabelText('Site ID');
    await user.click(siteIdCheckbox);

    expect(mockHandleColumnChange).toHaveBeenCalled();
  });
});
