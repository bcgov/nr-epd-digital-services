import React, { useState } from 'react';
import type { VisibilityState } from '@tanstack/react-table';
import PageContainer from '../../../components/simple/PageContainer';
import { DataTable, DataTablePagination } from '../../../components/data-table';
import { useApplicationsV2 } from './hooks/useApplicationsV2';
import { useApplicationsV2SearchParams } from './hooks/useApplicationsV2SearchParams';
import { applicationsV2Columns } from './applicationsV2Columns';
import { APPLICATIONS_SEARCH_ERROR_MESSAGE } from './api/ApplicationsApi';
import './ApplicationsV2.css';

const ApplicationsV2: React.FC = () => {
  const { page, pageSize, setPage, setPageSize, variables } =
    useApplicationsV2SearchParams();
  const { data, isPending, isFetching, isError } = useApplicationsV2(variables);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const applications = data?.applications ?? [];
  const totalCount = data?.count ?? 0;
  // Full loading row only on the first fetch; subsequent page changes keep
  // previous rows and use a subtler in-place fetching affordance.
  const showInitialLoading = isPending && !data;

  return (
    <PageContainer role="ApplicationsV2">
      {isError && <p>{APPLICATIONS_SEARCH_ERROR_MESSAGE}</p>}
      <div className="applications-v2__table">
        <DataTable
          title="Applications"
          data={applications}
          columns={applicationsV2Columns}
          ariaLabel="Applications"
          isLoading={showInitialLoading}
          isFetching={!showInitialLoading && isFetching}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          getRowId={(row) => row.id}
          manualSorting
        />
        {!isError && (
          <DataTablePagination
            page={data?.page ?? page}
            pageSize={data?.pageSize ?? pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default ApplicationsV2;
