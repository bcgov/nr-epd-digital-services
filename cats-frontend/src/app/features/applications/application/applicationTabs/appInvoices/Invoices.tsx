import React, { useEffect, useState } from 'react';
import { RequestStatus } from '@cats/helpers/requests/status';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TableColumn } from '@cats/components/table/TableColumn';
import { Button } from '@cats/components/button/Button';
import { FilterIcon, Plus } from '@cats/components/common/icon';
import Widget from '@cats/components/widget/Widget';
import FilterControls from '@cats/components/filter/FilterControls';
import { IFilterOption } from '@cats/components/filter/IFilterControls';
import { GetInvoicesConfig } from './InvoicesConfig';
import './Invoices.css';
import { useGetInvoicesQuery } from './graphql/Invoice.generated';
import { ViewInvoice } from '../../../../../../generated/types';
import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import { useGetHeaderDetailsByApplicationIdQuery } from '../../ApplicationDetails.generated';
import { InvoiceFilter } from './enums/filter';
import { InvoiceSortBy, InvoiceSortByDir } from './enums/sortBy';

type Invoices = Pick<
  ViewInvoice,
  'id' | 'subject' | 'invoiceStatus' | 'totalInCents' | 'issuedDate' | 'dueDate'
>;
export const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);
  const { invoiceTableConfig } = GetInvoicesConfig(applicationId);

  // Parse URL search params to check for refresh=true
  const searchParams = new URLSearchParams(location.search);
  const shouldRefresh = searchParams.get('refresh') === 'true';

  const { data, error, refetch } = useGetInvoicesQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      applicationId: applicationId,
    },
  });

  // Fetch application details for the header
  const { data: applicationData } = useGetHeaderDetailsByApplicationIdQuery({
    fetchPolicy: 'cache-and-network',
    variables: { applicationId: applicationId },
    skip: !applicationId || isNaN(applicationId),
  });

  const [results, setResults] = useState<Invoices[]>([]);
  const [displayResults, setDisplayResults] = useState<Invoices[]>([]);
  const [filter, setFilter] = useState<InvoiceFilter>(InvoiceFilter.ALL);
  const [sortBy, setSortBy] = useState<InvoiceSortBy>(InvoiceSortBy.ID);
  const [sortByDir, setSortByDir] = useState<InvoiceSortByDir>(
    InvoiceSortByDir.ASC,
  );
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.idle,
  );
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<{ id: any }[]>([]);
  const [selectedType, setSelectedType] = useState('blank-invoice');

  // If refresh=true is in the URL, refetch data and remove the parameter
  useEffect(() => {
    if (shouldRefresh) {
      refetch().then(() => {
        // Remove refresh=true from the URL after refetching
        navigate(`/applications/${applicationId}/invoices`, {
          replace: true,
        });
      });
    }
  }, [shouldRefresh, refetch, navigate, applicationId]);

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
        (invoice) =>
          invoice.invoiceStatus.toLowerCase() === filter.toLowerCase(),
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
          leftValue = left.invoiceStatus || '';
          rightValue = right.invoiceStatus || '';
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
      setResults(data?.getInvoices?.data || []);
      setRequestStatus(RequestStatus.success);
    } else if (error) {
      setRequestStatus(RequestStatus.failed);
    }
  }, [data, error]);

  const handleTableChange = (event: any) => {
    const { property, value, row, selected } = event;

    if (!property.includes('select_all') && !property.includes('select_row'))
      return;

    const rows = property === 'select_row' ? [row] : value;
    const isSelecting = property === 'select_row' ? value : selected;

    setSelectedRows((prevSelectedRows) => {
      const rowIds = new Set(rows.map((r: any) => r.id));

      if (isSelecting) {
        // Avoid duplicates
        const existingIds = new Set(prevSelectedRows.map((r) => r.id));
        const newSelections = rows
          .filter((r: any) => !existingIds.has(r.id))
          .map((r: any) => ({ id: r.id }));
        return [...prevSelectedRows, ...newSelections];
      } else {
        // Remove deselected rows
        return prevSelectedRows.filter((r) => !rowIds.has(r.id));
      }
    });
  };

  const invoiceFilter: IFilterOption[] = [
    {
      label: 'All',
      value: InvoiceFilter.ALL,
      onClick: () => handleFilterChange(InvoiceFilter.ALL),
      isSelected: filter === InvoiceFilter.ALL,
    },
    {
      label: 'Draft',
      value: InvoiceFilter.DRAFT,
      onClick: () => handleFilterChange(InvoiceFilter.DRAFT),
      isSelected: filter === InvoiceFilter.DRAFT,
    },
    {
      label: 'Unpaid',
      value: InvoiceFilter.RECEIVED,
      onClick: () => handleFilterChange(InvoiceFilter.RECEIVED),
      isSelected: filter === InvoiceFilter.RECEIVED,
    },
    {
      label: 'Filters',
      value: 'filters',
      onClick: () => {},
      icon: <FilterIcon />,
    },
  ];

  return (
    <div>
      {/* <div className="d-flex justify-content-between mb-3 align-items-center">
        <p>Financial Summary Will Go Here</p>
      </div> */}
      <div>
        <Widget
          customWidgetCss="gap-4"
          title="Invoices"
          tableIsLoading={requestStatus}
          tableColumns={invoiceTableConfig}
          tableData={displayResults}
          sortHandler={handleSortChange}
          changeHandler={handleTableChange}
          filter={<FilterControls options={invoiceFilter} />}
          currentPage={1}
          allowRowsSelect={true}
          primaryKeycolumnName="id"
        >
          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="secondary"
              onClick={() => setIsNewInvoiceOpen(true)}
            >
              <Plus /> New Invoice
            </Button>
            <Button
              variant="secondary"
              disabled={selectedRows.length <= 0}
              onClick={() => {}}
            >
              <span>Send Invoice to Client</span>
            </Button>
          </div>
        </Widget>
      </div>
      {isNewInvoiceOpen && (
        <ModalDialog
          label="Create New Invoice"
          customHeaderTextCss="custom-invoice-heading"
          saveBtnLabel="Confirm"
          showTickIcon={true}
          customContentCss='custom-invoice-modal-content'
          closeHandler={(response) => {
            if (response) {
              switch (selectedType) {
                case 'prepaid-invoice':
                  break;
                case 'postpaid-invoice':
                  break;
                case 'blank-invoice':
                  navigate(`/applications/${applicationId}/invoice`);
                  break;
                default:
                  navigate(`/applications/${applicationId}/invoice`);
                  break;
              }
            }
            setIsNewInvoiceOpen(!isNewInvoiceOpen);
          }}
        >
          <div className="d-flex flex-column gap-5">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="create-invoice" className="custom-invoices-lbl">
                Application
              </label>
              <div
                id="create-invoice"
                className="custom-invoices-input-txt custom-invoices-input"
                aria-disabled="true"
              >
                <span>
                  {applicationData?.getApplicationDetailsById?.data?.id}
                </span>
                <span className="custom-invoices-dot px-1">·</span>
                <span>
                  {
                    applicationData?.getApplicationDetailsById?.data
                      ?.siteAddress
                  }
                </span>
                <span className="custom-invoices-dot px-1">·</span>
                <span>
                  {
                    applicationData?.getApplicationDetailsById?.data?.appType
                      ?.description
                  }
                </span>
              </div>
            </div>
            <div className="d-flex flex-column gap-3">
              <label className="custom-invoices-lbl">Invoice Type</label>
              <div className="d-flex flex-column gap-2 px-3 custom-invoices-input-txt">
                <label className="d-flex gap-2 align-items-center">
                  <input
                    disabled={true}
                    type="radio"
                    name="invoiceType"
                    value="prepaid-invoice"
                    checked={selectedType === 'prepaid-invoice'}
                    onChange={(e) => setSelectedType(e.target.value)}
                  />
                  Prepaid Services Invoice
                </label>

                <label className="d-flex gap-2 align-items-center">
                  <input
                    disabled={true}
                    type="radio"
                    name="invoiceType"
                    value="postpaid-invoice"
                    checked={selectedType === 'postpaid-invoice'}
                    onChange={(e) => setSelectedType(e.target.value)}
                  />
                  Postpaid Services Invoice
                </label>
                <label className="d-flex gap-2 align-items-center">
                  <input
                    type="radio"
                    name="invoiceType"
                    value="blank-invoice"
                    checked={selectedType === 'blank-invoice'}
                    onChange={(e) => setSelectedType(e.target.value)}
                  />
                  Blank Invoice
                </label>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </div>
  );
};
