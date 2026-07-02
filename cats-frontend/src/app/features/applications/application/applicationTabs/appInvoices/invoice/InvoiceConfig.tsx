import {
  FormFieldType,
  IFormField,
} from '@cats/components/input-controls/IFormField';
import {
  DownloadType,
  InvoiceStatus,
} from '../../../../../../../generated/types';
import { UserMode } from '@cats/helpers/requests/userMode';
import { ColumnSize, TableColumn } from '@cats/components/table/TableColumn';
import { FaTimes } from 'react-icons/fa';
import {
  DropdownSearchInput,
  Link,
} from '@cats/components/input-controls/InputControls';
import { RequestStatus } from '@cats/helpers/requests/status';
import { InvoiceItemTypes } from '../enums/invoiceItemTypes';
import { GetInvoiceRecipientNamesQuery } from '../graphql/Invoice.generated';
import {
  MultiRecipientInput,
  EmailRecipient,
} from '@cats/components/multi-recipient-input';
import React from 'react';

interface RecipientConfig {
  setSearchParam: (searchParam: string) => void;
  options: GetInvoiceRecipientNamesQuery['getParticipantNames']['data'];
  filteredOptions: GetInvoiceRecipientNamesQuery['getParticipantNames']['data'];
  loading: boolean;
}

interface RecipientsFieldConfig {
  toRecipients: EmailRecipient[];
  ccRecipients: EmailRecipient[];
  onAddToRecipient: (recipient: EmailRecipient) => void;
  onRemoveToRecipient: (id: string) => void;
  onAddCcRecipient: (recipient: EmailRecipient) => void;
  onRemoveCcRecipient: (id: string) => void;
}

interface GetInvoiceConfigParams {
  viewMode: UserMode;
  isDisabled?: boolean;
  handleInputChange?: (fieldName: string, value: string) => void;
  invoiceDetails?: any;
  createMode?: boolean;
  recipient?: RecipientConfig;
  recipientsField?: RecipientsFieldConfig;
  getObject: any;
}

export const GetInvoiceConfig = ({
  viewMode,
  isDisabled = false,
  handleInputChange = () => {},
  getObject,
  invoiceDetails = {},
  createMode = false,
  recipient,
  recipientsField,
}: GetInvoiceConfigParams) => {
  const viewFileHandler = async (objectId: any) => {
    if (!!objectId?.trim()) {
      getObject({
        fetchPolicy: 'network-only',
        variables: { objectId, downloadType: DownloadType.Url },
      }).then((result: any) => {
        if (result?.data?.getObject?.data?.downloadUrl) {
          const response = result?.data?.getObject?.data?.downloadUrl;
          window.open(response, '_blank');
        }
      });
    }
  };
  const customInvoiceRecipient = (
    <DropdownSearchInput
      label={'Invoice Recipient'}
      customLabelCss={'custom-invoice-lbl'}
      customInputTextCss={'custom-invoice-txt'}
      customEditLabelCss={'custom-invoice-edit-lbl'}
      customEditInputTextCss={'custom-invoice-edit-txt'}
      customPlaceholderCss={'custom-invoice-placeholder'}
      placeholder={'Enter search term...'}
      options={recipient?.options || []}
      value={invoiceDetails?.personId || ''}
      onChange={(value) => handleInputChange('personId', value)}
      type={FormFieldType.DropDownWithSearch}
      handleSearch={recipient?.setSearchParam}
      filteredOptions={recipient?.filteredOptions || []}
      isEditing={viewMode === UserMode.EditMode}
      isLoading={
        !recipient?.loading ? RequestStatus.idle : RequestStatus.loading
      }
      validation={{
        required: true,
        customMessage: 'Please select invoice recipient.',
      }}
      isDisabled={viewMode === UserMode.EditMode && !createMode}
    />
  );
  const customInvoiceRecProfileLink = (
    <Link
      type={FormFieldType.Link}
      customInputTextCss={'custom-invoice-txt pe-1'}
      onChange={(value) => handleInputChange('personId', value)}
      value={invoiceDetails?.personId || ''}
      href="/person/"
      customLinkValue={'Edit Person Profile'}
      componentName="Invoice"
    />
  );

  const invoiceForm: { [key: string]: IFormField } = {
    applicationId: {
      type: FormFieldType.Text,
      label: 'Application ID',
      placeholder: 'Application ID',
      graphQLPropertyName: 'id',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
    },
    siteAddress: {
      type: FormFieldType.Text,
      label: 'Site Address',
      placeholder: 'Site Address',
      graphQLPropertyName: 'siteAddress',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
    },
    applicationType: {
      type: FormFieldType.Text,
      label: 'Application Type',
      placeholder: 'Application Type',
      graphQLPropertyName: 'applicationType',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
    },
    invoiceId: {
      type: FormFieldType.Text,
      label: 'Invoice ID',
      placeholder: 'Invoice ID',
      graphQLPropertyName: 'id',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
      isDisabled: true,
    },
    invoiceRecipient: {
      type: FormFieldType.Custom,
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      graphQLPropertyName: 'personId',
      validation: {
        required: true,
        customMessage: 'Please select invoice recipient.',
      },
      renderField: (
        <>
          {viewMode === UserMode.EditMode && customInvoiceRecipient}
          {viewMode === UserMode.Default && (
            <div className="mb-3">
              <label
                htmlFor="invoice-recipient"
                className="custom-invoice-lbl"
                aria-labelledby="invoice-recipient"
              >
                Invoice Recipient
              </label>
              <div
                id="invoice-recipient"
                className="d-flex gap-2 w-100 align-items-center custom-invoice-txt"
                aria-labelledby="invoice-recipient"
              >
                {invoiceDetails?.recipient?.value}{' '}
                <div className="fw-bold pe-1 m-0 d-flex">
                  [{customInvoiceRecProfileLink}]
                </div>
              </div>
            </div>
          )}
        </>
      ),
    },
    emailRecipients: {
      type: FormFieldType.Custom,
      colSize: 'col-lg-12 col-md-12 col-sm-12',
      graphQLPropertyName: 'emailRecipients',
      renderField: (
        <>
          {viewMode === UserMode.EditMode && recipientsField && (
            <div className="d-flex flex-column gap-3 mb-3">
              <MultiRecipientInput
                label="Email To"
                recipients={recipientsField.toRecipients}
                onAddRecipient={recipientsField.onAddToRecipient}
                onRemoveRecipient={recipientsField.onRemoveToRecipient}
                contactOptions={recipient?.options || []}
                filteredContactOptions={recipient?.filteredOptions || []}
                onSearchContacts={recipient?.setSearchParam}
                isLoading={recipient?.loading || false}
                placeholder="Search contacts or type an email address..."
                ariaLabel="Email To recipients"
              />
              <MultiRecipientInput
                label="Email CC"
                recipients={recipientsField.ccRecipients}
                onAddRecipient={recipientsField.onAddCcRecipient}
                onRemoveRecipient={recipientsField.onRemoveCcRecipient}
                contactOptions={[]}
                filteredContactOptions={recipient?.filteredOptions || []}
                onSearchContacts={recipient?.setSearchParam}
                isLoading={recipient?.loading || false}
                placeholder="Add CC recipients..."
                ariaLabel="Email CC recipients"
              />
            </div>
          )}
          {viewMode === UserMode.Default && recipientsField && (
            <div className="mb-3">
              <label className="custom-invoice-lbl">Email Recipients</label>
              <div className="d-flex flex-column gap-1 custom-invoice-txt">
                {recipientsField?.toRecipients?.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 align-items-center">
                    <strong className="me-1">To:</strong>
                    {recipientsField.toRecipients.map((r) => (
                      <span
                        key={r.id}
                        className="badge bg-light text-dark border me-1"
                      >
                        {r.displayName || r.email}
                      </span>
                    ))}
                  </div>
                )}
                {recipientsField?.ccRecipients?.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 align-items-center">
                    <strong className="me-1">CC:</strong>
                    {recipientsField.ccRecipients.map((r) => (
                      <span
                        key={r.id}
                        className="badge bg-light text-dark border me-1"
                      >
                        {r.displayName || r.email}
                      </span>
                    ))}
                  </div>
                )}
                {!recipientsField?.toRecipients?.length &&
                  !recipientsField?.ccRecipients?.length && (
                    <span className="text-muted">
                      No email recipients added
                    </span>
                  )}
              </div>
            </div>
          )}
        </>
      ),
    },
    issueDate: {
      type: FormFieldType.Date,
      label: 'Issue Date',
      placeholder: 'Issue Date',
      dateFormat: 'EE, MMM dd, yyyy',
      graphQLPropertyName: 'issuedDate',
      value: '',
      colSize: 'col-lg-3 col-md-3 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
      isDisabled: !createMode,
    },
    dueDate: {
      type: FormFieldType.Date,
      label: 'Due Date',
      placeholder: 'Due Date',
      dateFormat: 'EE, MMM dd, yyyy',
      graphQLPropertyName: 'dueDate',
      value: '',
      colSize: 'col-lg-3 col-md-3 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
      validation: {
        required: true,
        customMessage: 'Please select a due date.',
      },
    },
    taxExempt: {
      type: FormFieldType.Switch,
      label: 'Tax Exempt',
      graphQLPropertyName: 'taxExempt',
      value: '',
      colSize: `col-lg-2 col-md-2 col-sm-12 ${viewMode === UserMode.EditMode ? 'custom-switch-container' : ''}`,
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
    },
    pstExempt: {
      type: FormFieldType.Switch,
      label: 'PST Exempt',
      graphQLPropertyName: 'pstExempt',
      value: '',
      colSize: `col-lg-4 col-md-4 col-sm-12 ${viewMode === UserMode.EditMode ? 'custom-switch-container' : ''}`,
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      isDisabled: isDisabled,
    },
    invoiceStatus: {
      type: FormFieldType.DropDown,
      label: 'Invoice Status',
      placeholder: 'Invoice Status',
      graphQLPropertyName: 'invoiceStatus',
      options: [
        { key: InvoiceStatus.Draft, value: 'Draft' },
        { key: InvoiceStatus.Paid, value: 'Paid' },
        { key: InvoiceStatus.Sent, value: 'Sent' },
        { key: InvoiceStatus.Received, value: 'Received' },
      ],
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
    },
    createdBy: {
      type: FormFieldType.Text,
      label: 'Created By',
      placeholder: 'Created By',
      graphQLPropertyName: 'whoUpdated',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
      isDisabled: true,
    },
    notes: {
      type: FormFieldType.TextArea,
      textAreaRow: 3,
      label: `Notes ${viewMode === UserMode.EditMode ? '(Optional)' : ''}`,
      placeholder: 'Notes',
      graphQLPropertyName: 'invoiceNotes',
      value: '',
      colSize: 'col-lg-12 col-md-12 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
    },
    invoiceSubject: {
      type: FormFieldType.Text,
      label: 'Invoice Subject',
      placeholder: 'Invoice Subject',
      graphQLPropertyName: 'subject',
      value: '',
      colSize: `${createMode ? 'col-lg-6 col-md-6 col-sm-12' : 'col-lg-12 col-md-12 col-sm-12'}`,
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
      validation: {
        required: true,
        customMessage: 'Please enter invoice subject.',
      },
    },
    recordPaymentDate: {
      type: FormFieldType.Date,
      label: 'Payment Date',
      placeholder: 'Payment Date',
      dateFormat: 'EE MMM dd yyyy',
      graphQLPropertyName: 'recordPaymentDate',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
      isDisabled: true,
      validation: {
        required: true,
        customMessage: 'Please enter record payment date.',
      },
    },
    recordPaymentAmount: {
      type: FormFieldType.Text,
      label: 'Amount($)',
      placeholder: '$ Enter Amount',
      graphQLPropertyName: 'recordPaymentAmount',
      value: '',
      colSize: 'col-lg-6 col-md-6 col-sm-12',
      customLabelCss: 'custom-invoice-lbl',
      customEditLabelCss: 'custom-invoice-edit-lbl',
      customInputTextCss: 'custom-invoice-txt',
      customEditInputTextCss: 'custom-invoice-edit-txt',
      validation: {
        required: true,
        customMessage: 'Please enter record payment amount.',
      },
    },
  };

  const applicationDetailsForm: IFormField[][] = [
    [
      invoiceForm.applicationId,
      invoiceForm.siteAddress,
      invoiceForm.applicationType,
    ],
  ];

  const invoiceDetailsForm: IFormField[][] = [
    [
      ...(createMode ? [invoiceForm.invoiceSubject] : [invoiceForm.invoiceId]),
      invoiceForm.invoiceRecipient,
    ],
    [invoiceForm.emailRecipients],
    [
      invoiceForm.issueDate,
      invoiceForm.dueDate,
      invoiceForm.taxExempt,
      invoiceForm.pstExempt,
    ],
    createMode ? [] : [invoiceForm.invoiceSubject],
    createMode ? [] : [invoiceForm.invoiceStatus, invoiceForm.createdBy],
    [invoiceForm.notes],
  ];

  const invoiceRecordPaymentForm: IFormField[][] = [
    [invoiceForm.recordPaymentDate, invoiceForm.recordPaymentAmount],
  ];

  const actionsColumn: TableColumn = {
    id: 6,
    displayName: 'Actions',
    active: true,
    graphQLPropertyName: 'remove',
    displayType: {
      type: FormFieldType.Link,
      label: 'Remove',
      graphQLPropertyName: 'remove',
      value: '',
      customLinkValue: 'Remove',
      customInputTextCss: 'custom-invoice-items-txt',
      customEditInputTextCss: 'custom-invoice-items-txt',
      tableMode: true,
      href: '#',
      customIcon: <FaTimes />,
    },
    columnSize: ColumnSize.XtraSmall,
    dynamicColumn: true,
    customHeaderCss: 'custom-invoice-items-tbl-header',
  };

  const invoiceItemsTableConfigs: TableColumn[] = [
    {
      id: 1,
      displayName: 'Item Type',
      active: true,
      graphQLPropertyName: 'itemType',
      displayType: {
        type: FormFieldType.DropDown,
        label: 'Item Type',
        tableMode: true,
        graphQLPropertyName: 'itemType',
        placeholder: 'Select Item Type',
        options: [
          { key: InvoiceItemTypes.EXPENSE, value: 'Expense' },
          { key: InvoiceItemTypes.SERVICE, value: 'Service' },
          { key: InvoiceItemTypes.TIMESHEET, value: 'Timesheet' },
        ],
        value: '',
        customInputTextCss: 'custom-invoice-items-txt',
        customEditInputTextCss: 'custom-invoice-items-txt',
        validation: {
          required: true,
          customMessage: 'Please select a valid invoice item type.',
        },
      },
      dynamicColumn: true,
      columnSize: ColumnSize.Default,
    },
    {
      id: 2,
      displayName: 'Description',
      active: true,
      graphQLPropertyName: 'description',
      displayType: {
        type: FormFieldType.Text,
        label: 'Description',
        tableMode: true,
        graphQLPropertyName: 'description',
        value: '',
        customInputTextCss: 'custom-invoice-items-txt',
        customEditInputTextCss: 'custom-invoice-items-txt',
        validation: {
          required: true,
          customMessage: 'Please enter invoice item description.',
        },
      },
      dynamicColumn: true,
      columnSize: ColumnSize.Default,
    },
    {
      id: 3,
      displayName: 'Quantity',
      active: true,
      graphQLPropertyName: 'quantity',
      displayType: {
        type: FormFieldType.Text,
        label: 'Quantity',
        tableMode: true,
        graphQLPropertyName: 'quantity',
        value: '',
        customInputTextCss:
          'custom-invoice-items-txt d-flex justify-content-end',
        customEditInputTextCss: 'custom-invoice-items-txt text-end',
        validation: {
          required: true,
          customMessage: 'Please enter valid invoice item quantity.',
        },
      },
      dynamicColumn: true,
      columnSize: ColumnSize.Default,
      customHeaderCss: 'text-end align-middle',
    },
    {
      id: 4,
      displayName: 'Unit Price',
      active: true,
      graphQLPropertyName: 'unitPriceInCents',
      displayType: {
        type: FormFieldType.Text,
        label: 'Unit Price',
        tableMode: true,
        graphQLPropertyName: 'unitPriceInCents',
        value: '',
        customInputTextCss:
          'custom-invoice-items-txt d-flex justify-content-end',
        customEditInputTextCss: 'custom-invoice-items-txt text-end',
        validation: {
          required: true,
          customMessage: 'Please enter valid invoice item unit price.',
        },
      },
      dynamicColumn: true,
      columnSize: ColumnSize.Default,
      customHeaderCss: 'text-end align-middle',
    },
    {
      id: 5,
      displayName: 'Amount',
      active: true,
      graphQLPropertyName: 'totalInCents',
      displayType: {
        type: FormFieldType.Label,
        label: 'Amount',
        tableMode: true,
        graphQLPropertyName: 'totalInCents',
        value: '',
        customInputTextCss:
          'custom-invoice-items-txt d-flex justify-content-end',
        customEditInputTextCss: 'custom-invoice-items-txt text-end',
      },
      dynamicColumn: true,
      columnSize: ColumnSize.Default,
      customHeaderCss: 'text-end align-middle',
    },
  ];

  const invoiceAttachmentsTableConfigs: TableColumn[] = [
    {
      id: 1,
      displayName: 'File Name',
      active: true,
      graphQLPropertyName: 'fileName',
      displayType: {
        type: FormFieldType.Label,
        label: '',
        tableMode: true,
        graphQLPropertyName: 'fileName',
        value: '',
        customInputTextCss: 'custom-invoice-items-txt',
      },
      dynamicColumn: true,
      columnSize: ColumnSize.Default,
      renderCell: (value: any, rowData: any) => {
        if (rowData?.previewUrl) {
          return (
            <a
              href={rowData?.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value || 'View File'}{' '}
            </a>
          );
        }
        if (!!rowData?.objectId.trim() && !!rowData?.bucketId?.trim()) {
          return (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                viewFileHandler(rowData.objectId);
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value || 'View File'}{' '}
            </a>
          );
        }
      },
    },
  ];

  if (viewMode === UserMode.EditMode) {
    invoiceItemsTableConfigs.push(actionsColumn);
    invoiceAttachmentsTableConfigs.push(actionsColumn);
  }
  return {
    applicationDetailsForm,
    invoiceDetailsForm,
    invoiceItemsTableConfigs,
    invoiceAttachmentsTableConfigs,
    invoiceRecordPaymentForm,
  };
};
