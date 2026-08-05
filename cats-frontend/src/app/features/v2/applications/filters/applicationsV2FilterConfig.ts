export type ApplicationsV2FilterOption = {
  value: string;
  label: string;
};

export type ApplicationsV2FilterField =
  | {
      kind: 'text';
      key:
        | 'id'
        | 'commonName'
        | 'csapReference'
        | 'siteId'
        | 'siteAddress';
      label: string;
      placeholder: string;
      pattern?: RegExp;
      patternMessage?: string;
    }
  | {
      kind: 'dateRange';
      key: 'dateReceived' | 'lastUpdated' | 'dateCompleted';
      fromKey:
        | 'dateReceivedFrom'
        | 'lastUpdatedFrom'
        | 'dateCompletedFrom';
      toKey: 'dateReceivedTo' | 'lastUpdatedTo' | 'dateCompletedTo';
      label: string;
    }
  | {
      kind: 'select';
      key: 'priority' | 'siteRiskClassification' | 'invoiceStatus';
      label: string;
      placeholder: string;
      options: ApplicationsV2FilterOption[];
    };

export const PRIORITY_OPTIONS: ApplicationsV2FilterOption[] = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

export const SITE_RISK_OPTIONS: ApplicationsV2FilterOption[] = [
  { value: 'highRisk', label: 'High Risk' },
  { value: 'nonHighRisk', label: 'Non-High Risk' },
  { value: 'riskManagedHighRisk', label: 'Risk-Managed High Risk' },
  { value: 'pending', label: 'Pending' },
];

export const INVOICE_STATUS_OPTIONS: ApplicationsV2FilterOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'received', label: 'Received' },
  { value: 'paid', label: 'Paid' },
];

/** Issue-4 fields only; backend-backed dropdowns arrive in Issue 5. */
export const APPLICATIONS_V2_FILTER_FIELDS: ApplicationsV2FilterField[] = [
  {
    kind: 'text',
    key: 'id',
    label: 'Application ID',
    placeholder: 'Separate IDs by a comma (",")',
    pattern: /^[0-9,\s]*$/,
    patternMessage: 'Application ID can only contain numbers and commas',
  },
  {
    kind: 'text',
    key: 'commonName',
    label: 'Common Name',
    placeholder: 'Type keywords',
  },
  {
    kind: 'text',
    key: 'csapReference',
    label: 'CSAP #',
    placeholder: 'Separate IDs by a comma (",")',
  },
  {
    kind: 'text',
    key: 'siteId',
    label: 'Site ID',
    placeholder: 'Separate IDs by a comma (",")',
    pattern: /^[0-9,\s]*$/,
    patternMessage: 'Site ID can only contain numbers and commas',
  },
  {
    kind: 'text',
    key: 'siteAddress',
    label: 'Site Address',
    placeholder: 'Type keywords',
  },
  {
    kind: 'dateRange',
    key: 'dateReceived',
    fromKey: 'dateReceivedFrom',
    toKey: 'dateReceivedTo',
    label: 'Date Received',
  },
  {
    kind: 'dateRange',
    key: 'lastUpdated',
    fromKey: 'lastUpdatedFrom',
    toKey: 'lastUpdatedTo',
    label: 'Last Updated',
  },
  {
    kind: 'dateRange',
    key: 'dateCompleted',
    fromKey: 'dateCompletedFrom',
    toKey: 'dateCompletedTo',
    label: 'Date Completed',
  },
  {
    kind: 'select',
    key: 'priority',
    label: 'Priority',
    placeholder: 'Select Priority',
    options: PRIORITY_OPTIONS,
  },
  {
    kind: 'select',
    key: 'siteRiskClassification',
    label: 'Site Risk Classification',
    placeholder: 'Select Type',
    options: SITE_RISK_OPTIONS,
  },
  {
    kind: 'select',
    key: 'invoiceStatus',
    label: 'Invoice Status',
    placeholder: 'Select Status',
    options: INVOICE_STATUS_OPTIONS,
  },
];
