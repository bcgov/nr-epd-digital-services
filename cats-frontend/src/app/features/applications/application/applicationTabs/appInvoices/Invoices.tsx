import React, { useEffect } from 'react';
import InvoiceIndexTable from './components/index/table';
import { RequestStatus } from '@cats/helpers/requests/status';
import { InvoiceByApplicationIdDto } from '../../../../../../generated/types';
import { useGetInvoicesByApplicationIdQuery } from './getInvoicesByApplicationId.generated';
import { useParams } from 'react-router-dom';
import { TableColumn } from '@cats/components/table/TableColumn';
import { indexTableColumns } from './components/index/tableColumnConfig';
import { InvoiceFilter } from './components/index/filter';
import {
  invoiceSortBy as InvoiceSortBy,
  invoiceSortByDir as InvoiceSortByDir,
} from './components/index/sortBy';

export const Invoices: React.FC = () => {
  const [results, setResults] = React.useState<InvoiceByApplicationIdDto[]>([]);
  const [displayResults, setDisplayResults] = React.useState<
    InvoiceByApplicationIdDto[]
  >([]);
  const [filter, setFilter] = React.useState<InvoiceFilter>(InvoiceFilter.ALL);
  const [sortBy, setSortBy] = React.useState<InvoiceSortBy>(InvoiceSortBy.ID);
  const [sortByDir, setSortByDir] = React.useState<InvoiceSortByDir>(
    InvoiceSortByDir.ASC,
  );
  const [requestStatus, setRequestStatus] = React.useState<RequestStatus>(
    RequestStatus.idle,
  );
  const [columns, setColumns] =
    React.useState<TableColumn[]>(indexTableColumns);

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
    console.log('Sorting by:', column, 'Ascending:', ascending);
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

  return (
    <div>
      <div>
        <p>TODO: Financial Summary Will Go Here</p>
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
        />
      </div>
    </div>
  );
};
