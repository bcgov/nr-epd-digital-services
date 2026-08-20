import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetFinancialSummaryQuery } from './graphql/FinancialSummary.generated';
import Widget from '@cats/components/widget/Widget';
import { TableColumn } from '@cats/components/table/TableColumn';
import { FormFieldType } from '@cats/components/input-controls/IFormField';
import { RequestStatus } from '@cats/helpers/requests/status';
import CollapsiblePanel from '@cats/components/simple/CollapsiblePanel';

const formatCurrency = (cents: number): string => {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const financialSummaryColumns: TableColumn[] = [
  {
    id: 1,
    active: true,
    displayName: 'Hours Worked',
    graphQLPropertyName: 'hoursWorked',
    displayType: {
      type: FormFieldType.Text,
      label: 'Hours Worked',
      tableMode: true,
      graphQLPropertyName: 'hoursWorked',
      value: '',
    },
  },
  {
    id: 2,
    active: true,
    displayName: 'Hours Invoiced',
    graphQLPropertyName: 'hoursInvoiced',
    displayType: {
      type: FormFieldType.Text,
      label: 'Hours Invoiced',
      tableMode: true,
      graphQLPropertyName: 'hoursInvoiced',
      value: '',
    },
  },
  {
    id: 3,
    active: true,
    displayName: 'Service Costs',
    graphQLPropertyName: 'serviceCosts',
    displayType: {
      type: FormFieldType.Text,
      label: 'Service Costs',
      tableMode: true,
      graphQLPropertyName: 'serviceCosts',
      value: '',
    },
  },
  {
    id: 4,
    active: true,
    displayName: 'Invoice Total',
    graphQLPropertyName: 'invoiceTotal',
    displayType: {
      type: FormFieldType.Text,
      label: 'Invoice Total',
      tableMode: true,
      graphQLPropertyName: 'invoiceTotal',
      value: '',
    },
  },
  {
    id: 5,
    active: true,
    displayName: 'Amount Paid',
    graphQLPropertyName: 'amountPaid',
    displayType: {
      type: FormFieldType.Text,
      label: 'Amount Paid',
      tableMode: true,
      graphQLPropertyName: 'amountPaid',
      value: '',
    },
  },
  {
    id: 6,
    active: true,
    displayName: 'Outstanding Balance',
    graphQLPropertyName: 'outstandingBalance',
    displayType: {
      type: FormFieldType.Text,
      label: 'Outstanding Balance',
      tableMode: true,
      graphQLPropertyName: 'outstandingBalance',
      value: '',
    },
  },
];

export const FinancialSummary: React.FC = () => {
  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);

  const { data, loading, error } = useGetFinancialSummaryQuery({
    fetchPolicy: 'no-cache',
    variables: { applicationId },
    skip: !applicationId || isNaN(applicationId),
  });

  const summary = data?.getFinancialSummary?.data;

  const tableData = summary
    ? [
        {
          hoursWorked: summary.totalHoursWorked.toFixed(2),
          hoursInvoiced: summary.totalHoursInvoiced,
          serviceCosts: formatCurrency(summary.totalCostOfServicesInCents),
          invoiceTotal: formatCurrency(summary.totalAmountInvoicedInCents),
          amountPaid: formatCurrency(summary.totalAmountPaidInCents),
          outstandingBalance: formatCurrency(summary.outstandingBalanceInCents),
        },
      ]
    : [];

  const requestStatus = loading
    ? RequestStatus.loading
    : error
      ? RequestStatus.failed
      : RequestStatus.success;

  const summaryContent = (
    <Widget
      title=""
      hideTitle={true}
      tableIsLoading={requestStatus}
      tableColumns={financialSummaryColumns}
      tableData={tableData}
      currentPage={1}
      hideTable={false}
    />
  );

  return (
    <CollapsiblePanel
      label="Financial Summary"
      content={summaryContent}
      defaultOpen={true}
      loading={loading && !summary}
    />
  );
};
