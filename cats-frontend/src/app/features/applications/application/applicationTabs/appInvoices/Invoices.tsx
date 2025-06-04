import React, { useEffect, useState } from 'react';
import InvoiceIndexTable from './components/index/table';
import { RequestStatus } from '@cats/helpers/requests/status';
import { InvoiceByApplicationIdDto } from '../../../../../../generated/types';
import { useGetInvoicesByApplicationIdQuery } from './getInvoicesByApplicationId.generated';
import { useNavigate, useParams } from 'react-router-dom';
import { TableColumn } from '@cats/components/table/TableColumn';
import { indexTableColumns } from './components/index/tableColumnConfig';
import { InvoiceFilter } from './components/index/filter';
import {
  InvoiceSortBy as InvoiceSortBy,
  InvoiceSortByDir as InvoiceSortByDir,
} from './components/index/sortBy';
import { Button } from '@cats/components/button/Button';
import { Plus } from '@cats/components/common/icon';

export const Invoices: React.FC = () => {
  const [results, setResults] = useState<InvoiceByApplicationIdDto[]>([]);
  const [displayResults, setDisplayResults] = useState<
    InvoiceByApplicationIdDto[]
  >([]);
  const [filter, setFilter] = useState<InvoiceFilter>(InvoiceFilter.ALL);
  const [sortBy, setSortBy] = useState<InvoiceSortBy>(InvoiceSortBy.ID);
  const [sortByDir, setSortByDir] = useState<InvoiceSortByDir>(
    InvoiceSortByDir.ASC,
  );
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.idle,
  );
  const [columns, setColumns] =
    React.useState<TableColumn[]>(indexTableColumns);
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);
  const { data, error } = useGetInvoicesByApplicationIdQuery({
    variables: {
      applicationId: applicationId,
    },
  });

  const handleFilterChange = (filter: InvoiceFilter) => {
    setFilter(filter);
  };

  const handleSortChange = (column: TableColumn, ascending: boolean) => {
    let newSortBy = InvoiceSortBy.ID;
    let newSortByDir = ascending ? InvoiceSortByDir.ASC : InvoiceSortByDir.DESC;
    switch (column.graphQLPropertyName) {
      case 'id':
        newSortBy = InvoiceSortBy.ID;
        break;
      case 'subject':
        newSortBy = InvoiceSortBy.SUBJECT;
        break;
      case 'issuedDate':
        newSortBy = InvoiceSortBy.ISSUED_DATE;
        break;
      case 'dueDate':
        newSortBy = InvoiceSortBy.DUE_DATE;
        break;
      case 'status':
        newSortBy = InvoiceSortBy.STATUS;
        break;
      case 'totalInCents':
        newSortBy = InvoiceSortBy.TOTAL_IN_CENTS;
        break;
    }
    setSortBy(newSortBy);
    setSortByDir(newSortByDir);
  };

  useEffect(() => {
    // Apply filtering
    let filteredResults = results;
    if (filter !== InvoiceFilter.ALL) {
      filteredResults = results.filter(
        (invoice) => invoice.status.toLowerCase() === filter.toLowerCase(),
      );
    }

    // Apply sorting
    const sortedResults = [...filteredResults].sort((left, right) => {
      let leftValue: any;
      let rightValue: any;

      switch (sortBy) {
        case InvoiceSortBy.ID:
          leftValue = left.id;
          rightValue = right.id;
          break;
        case InvoiceSortBy.SUBJECT:
          leftValue = left.subject || '';
          rightValue = right.subject || '';
          break;
        case InvoiceSortBy.ISSUED_DATE:
          leftValue = left.issuedDate || '';
          rightValue = right.issuedDate || '';
          break;
        case InvoiceSortBy.DUE_DATE:
          leftValue = left.dueDate || '';
          rightValue = right.dueDate || '';
          break;
        case InvoiceSortBy.STATUS:
          leftValue = left.status || '';
          rightValue = right.status || '';
          break;
        case InvoiceSortBy.TOTAL_IN_CENTS:
          leftValue = left.totalInCents || 0;
          rightValue = right.totalInCents || 0;
          break;
        default:
          leftValue = left.id;
          rightValue = right.id;
      }

      if (leftValue < rightValue)
        return sortByDir === InvoiceSortByDir.ASC ? -1 : 1;
      if (leftValue > rightValue)
        return sortByDir === InvoiceSortByDir.ASC ? 1 : -1;
      return 0;
    });

    setDisplayResults(sortedResults);
  }, [filter, sortBy, sortByDir, results]);

  useEffect(() => {
    if (data) {
      setResults(data.getInvoicesByApplicationId.invoices || []);
      setRequestStatus(RequestStatus.success);
    } else if (error) {
      setRequestStatus(RequestStatus.failed);
    }
  }, [data, error]);

  const handleCreateInvoiceClick = () => {
    navigate(`/applications/${applicationId}/invoices/create`);
  };

  const createInvoiceButton = (
    <Button variant="secondary" onClick={handleCreateInvoiceClick}>
      <Plus /> Create Invoice
    </Button>
  );

  return (
    <div>
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <p>Financial Summary Will Go Here</p>
      </div>
      <div>
        <InvoiceIndexTable
          requestStatus={requestStatus}
          results={displayResults}
          columns={columns}
          handleColumnChange={setColumns}
          filter={filter}
          handleFilterChange={handleFilterChange}
          sortHandler={handleSortChange}
          createInvoiceButton={createInvoiceButton}
        />
      </div>
    </div>
  );
};
