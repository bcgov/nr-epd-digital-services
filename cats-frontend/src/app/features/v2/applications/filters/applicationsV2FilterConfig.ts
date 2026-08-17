export type ApplicationsV2FilterOption = {
  value: string;
  label: string;
};

export type ApplicationsV2LookupOptions = {
  serviceType: ApplicationsV2FilterOption[];
  applicationType: ApplicationsV2FilterOption[];
  status: ApplicationsV2FilterOption[];
  staffAssigned: ApplicationsV2FilterOption[];
};

export const EMPTY_LOOKUP_OPTIONS: ApplicationsV2LookupOptions = {
  serviceType: [],
  applicationType: [],
  status: [],
  staffAssigned: [],
};

export type ApplicationsV2FilterField =
  | {
      kind: 'text';
      key: 'id' | 'commonName' | 'csapReference' | 'siteId' | 'siteAddress';
      label: string;
      placeholder: string;
      pattern?: RegExp;
      patternMessage?: string;
    }
  | {
      kind: 'dateRange';
      key: 'dateReceived' | 'lastUpdated' | 'dateCompleted';
      fromKey: 'dateReceivedFrom' | 'lastUpdatedFrom' | 'dateCompletedFrom';
      toKey: 'dateReceivedTo' | 'lastUpdatedTo' | 'dateCompletedTo';
      label: string;
    }
  | {
      kind: 'select';
      key:
        | 'priority'
        | 'siteRiskClassification'
        | 'invoiceStatus'
        | 'serviceType'
        | 'applicationType'
        | 'status'
        | 'staffAssigned';
      label: string;
      placeholder: string;
      options: ApplicationsV2FilterOption[];
      lookup?: keyof ApplicationsV2LookupOptions;
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

/**
 * Field order matches legacy ApplicationFilterConfig formRows placement.
 * Lookup-backed selects start with empty options; resolve via
 * resolveApplicationsV2FilterFields so options stay in React state.
 */
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
    kind: 'select',
    key: 'serviceType',
    label: 'Service Type',
    placeholder: 'Select Type',
    options: [],
    lookup: 'serviceType',
  },
  {
    kind: 'select',
    key: 'applicationType',
    label: 'Application Type',
    placeholder: 'Select Type',
    options: [],
    lookup: 'applicationType',
  },
  {
    kind: 'text',
    key: 'csapReference',
    label: 'CSAP #',
    placeholder: 'Separate IDs by a comma (",")',
  },
  {
    kind: 'select',
    key: 'staffAssigned',
    label: 'Staff Assigned',
    placeholder: 'Select Staff',
    options: [],
    lookup: 'staffAssigned',
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
    kind: 'select',
    key: 'siteRiskClassification',
    label: 'Site Risk Classification',
    placeholder: 'Select Type',
    options: SITE_RISK_OPTIONS,
  },
  {
    kind: 'text',
    key: 'siteAddress',
    label: 'Site Address',
    placeholder: 'Type keywords',
  },
  {
    kind: 'text',
    key: 'commonName',
    label: 'Common Name',
    placeholder: 'Type keywords',
  },
  {
    kind: 'select',
    key: 'priority',
    label: 'Priority',
    placeholder: 'Select Priority',
    options: PRIORITY_OPTIONS,
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
    key: 'status',
    label: 'Status',
    placeholder: 'Select Status',
    options: [],
    lookup: 'status',
  },
  {
    kind: 'select',
    key: 'invoiceStatus',
    label: 'Invoice Status',
    placeholder: 'Select Status',
    options: INVOICE_STATUS_OPTIONS,
  },
];

export const resolveApplicationsV2FilterFields = (
  lookupOptions: ApplicationsV2LookupOptions = EMPTY_LOOKUP_OPTIONS,
): ApplicationsV2FilterField[] =>
  APPLICATIONS_V2_FILTER_FIELDS.map((field) => {
    if (field.kind !== 'select' || !field.lookup) {
      return field;
    }

    return {
      ...field,
      options: lookupOptions[field.lookup],
    };
  });
