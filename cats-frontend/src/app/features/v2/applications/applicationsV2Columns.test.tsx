import { render, screen, within } from '@testing-library/react';
import type { VisibilityState } from '@tanstack/react-table';
import { MemoryRouter } from 'react-router-dom';
import { formatDateUTC } from '../../../helpers/utility';
import { DataTable } from '../../../components/data-table';
import {
  applicationsV2Columns,
  DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY,
  type ApplicationV2Row,
} from './applicationsV2Columns';
import { SORTABLE_COLUMN_IDS } from './applicationsV2Sort';

const columnIds = () => applicationsV2Columns.map((column) => column.id);

const resolveDefaultVisibility = (): VisibilityState => {
  const visibility: VisibilityState = {};
  for (const column of applicationsV2Columns) {
    const id = column.id;
    if (!id) {
      continue;
    }
    if (column.enableHiding === false) {
      visibility[id] = true;
      continue;
    }
    visibility[id] = DEFAULT_APPLICATIONS_V2_COLUMN_VISIBILITY[id] ?? true;
  }
  return visibility;
};

const sampleRow: ApplicationV2Row = {
  id: '42',
  siteId: 'SITE-99',
  siteAddress: '123 Main St',
  applicationType: 'Type A',
  lastUpdated: '2024-06-15T12:00:00.000Z',
  status: 'Open',
  staffAssigned: [
    { firstName: 'Ada', lastName: 'Lovelace' },
    { firstName: 'Grace', lastName: 'Hopper' },
  ],
  priority: 'High',
  url: 'https://example.test/site/SITE-99',
  siteRiskClassification: 'High',
  csapReference: 'CSAP-1',
  serviceType: 'Service A',
  commonName: 'Common',
  receivedDate: '2024-01-10T08:00:00.000Z',
  dateCompleted: null,
};

const renderColumnsTable = (
  row: ApplicationV2Row = sampleRow,
  columnVisibility: VisibilityState = {},
) =>
  render(
    <MemoryRouter>
      <DataTable
        data={[row]}
        columns={applicationsV2Columns}
        ariaLabel="Applications"
        getRowId={(r) => r.id}
        columnVisibility={columnVisibility}
      />
    </MemoryRouter>,
  );

describe('applicationsV2Columns', () => {
  it('exposes sixteen columns with v1-matching default visibility', () => {
    expect(columnIds()).toEqual([
      'id',
      'siteId',
      'siteAddress',
      'applicationType',
      'lastUpdated',
      'dateReceived',
      'dateCompleted',
      'status',
      'staffAssigned',
      'priority',
      'siteRiskClassification',
      'csapReference',
      'serviceType',
      'commonName',
      'view',
      'actions',
    ]);

    expect(resolveDefaultVisibility()).toEqual({
      id: true,
      siteId: true,
      siteAddress: true,
      applicationType: true,
      lastUpdated: true,
      dateReceived: false,
      dateCompleted: false,
      status: true,
      staffAssigned: true,
      priority: true,
      siteRiskClassification: false,
      csapReference: false,
      serviceType: false,
      commonName: false,
      view: true,
      actions: true,
    });
  });

  it('keeps sorting enabled only on the nine backend-supported columns', () => {
    const sortableIds = applicationsV2Columns
      .filter((column) => column.enableSorting !== false)
      .map((column) => column.id);

    expect(sortableIds).toHaveLength(SORTABLE_COLUMN_IDS.length);
    expect(sortableIds).toEqual(expect.arrayContaining([...SORTABLE_COLUMN_IDS]));
  });

  it('does not allow hiding the View column', () => {
    const viewColumn = applicationsV2Columns.find(
      (column) => column.id === 'view',
    );
    expect(viewColumn?.enableHiding).toBe(false);
  });

  it('links Application ID and View to the application detail page', () => {
    renderColumnsTable();

    expect(screen.getByRole('link', { name: '42' })).toHaveAttribute(
      'href',
      '/applications/42',
    );
    expect(
      screen.getByRole('link', { name: 'View application 42' }),
    ).toHaveAttribute('href', '/applications/42');
  });

  it('links Site ID to the external Site Registry', () => {
    vi.stubEnv('VITE_SITE_REGISTRY_URL', 'https://registry.test');

    renderColumnsTable();

    const siteLink = screen.getByRole('link', { name: /SITE-99/i });
    expect(siteLink).toHaveAttribute(
      'href',
      'https://registry.test/site/details/SITE-99',
    );
    expect(siteLink).toHaveAttribute('target', '_blank');
    expect(siteLink).toHaveAttribute('rel', 'noopener noreferrer');

    vi.unstubAllEnvs();
  });

  it('navigates Manage Staff to the assignment screen for the row', () => {
    renderColumnsTable();

    expect(
      screen.getByRole('link', {
        name: 'Manage staff for application 42',
      }),
    ).toHaveAttribute('href', '/assignment/42');
  });

  it('keeps the Actions column sticky on the right', () => {
    renderColumnsTable();

    expect(
      screen.getByRole('columnheader', { name: 'Actions' }),
    ).toHaveClass('data-table__cell--sticky-right');

    const manageStaffCell = screen
      .getByRole('link', {
        name: 'Manage staff for application 42',
      })
      .closest('td');
    expect(manageStaffCell).toHaveClass('data-table__cell--sticky-right');
  });

  it('formats date columns with consistent UTC formatting', () => {
    renderColumnsTable(sampleRow, {
      dateReceived: true,
      dateCompleted: true,
    });

    expect(
      screen.getByText(formatDateUTC(sampleRow.lastUpdated)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatDateUTC(sampleRow.receivedDate!)),
    ).toBeInTheDocument();

    const completedHeader = screen.getByRole('columnheader', {
      name: 'Date Completed',
    });
    const table = screen.getByRole('table', { name: 'Applications' });
    const headers = within(table).getAllByRole('columnheader');
    const completedIndex = headers.indexOf(completedHeader);
    const cells = within(table).getAllByRole('cell');
    expect(cells[completedIndex]).toHaveTextContent('');
  });

  it('renders Staff Assigned with the ported avatar cell', () => {
    renderColumnsTable();

    expect(
      screen.getByRole('button', { name: 'Staff assigned' }),
    ).toBeInTheDocument();
    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(screen.getByText('GH')).toBeInTheDocument();
  });
});
