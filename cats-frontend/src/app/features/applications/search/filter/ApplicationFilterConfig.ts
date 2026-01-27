import {
  FormFieldType,
  IFormField,
} from '../../../../components/input-controls/IFormField';

export const formRowsMap: { [key: string]: IFormField } = {
  id: {
    type: FormFieldType.Text,
    label: 'Application ID',
    placeholder: 'Separate IDs by a comma (",")',
    graphQLPropertyName: 'id',
    value: '',
    validation: {
      pattern: /^[0-9,\s]*$/,
      customMessage: 'Application ID can only contain numbers and commas',
    },
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  serviceType: {
    type: FormFieldType.DropDown,
    label: 'Service Type',
    placeholder: 'Select Type',
    graphQLPropertyName: 'serviceType',
    options: [
      {
        value:
          'Relating to site identification, site disclosure statements or site releases',
        key: 'relatingtositeID',
      },
      { value: 'Report reviews', key: 'ReportReviews' },
      {
        value: 'Approved professional statements',
        key: 'ApprovedProfessionalStatements',
      },
      {
        value: 'Certification Documents',
        key: 'CertificationDocuments',
      },
      {
        value: 'Protocols',
        key: 'Protocols',
      },
      {
        value: 'Environmental management area',
        key: 'EnvironmentalManagementArea',
      },
      {
        value: 'Other services and functions',
        key: 'OtherServicesAndFunctions',
      },
    ],
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  commonName: {
    type: FormFieldType.Text,
    label: 'Common Name',
    placeholder: 'Separate IDs by a comma (",")',
    graphQLPropertyName: 'commonName',
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  csapReference: {
    type: FormFieldType.Text,
    label: 'CSAP #',
    placeholder: 'Separate IDs by a comma (",")',
    graphQLPropertyName: 'csapReference',
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  siteId: {
    type: FormFieldType.Text,
    label: 'Site ID',
    placeholder: 'Separate IDs by a comma (",")',
    graphQLPropertyName: 'siteId',
    value: '',
    validation: {
      pattern: /^[0-9,\s]*$/,
      customMessage: 'Site ID can only contain numbers and commas',
    },
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  siteRiskClassification: {
    type: FormFieldType.DropDown,
    label: 'Site Risk Classification',
    placeholder: 'Select Type',
    graphQLPropertyName: 'siteRiskClassification',
    options: [
      {
        value: 'High Risk',
        key: 'highRisk',
      },
      { value: 'Non-High Risk', key: 'nonHighRisk' },
      {
        value: 'Risk-Managed High Risk',
        key: 'riskManagedHighRisk',
      },
      {
        value: 'Pending',
        key: 'pending',
      },
    ],
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  siteAddress: {
    type: FormFieldType.Text,
    label: 'Site Address',
    placeholder: 'Type keywords',
    graphQLPropertyName: 'siteAddress',
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  applicationType: {
    type: FormFieldType.DropDown,
    label: 'Application Type',
    placeholder: 'Select Type',
    graphQLPropertyName: 'applicationType',
    options: [
      { key: 'Type1', value: 'Type1' },
      { key: 'Type2', value: 'Type2' },
      { key: 'Type3', value: 'Type3' },
    ],
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  status: {
    type: FormFieldType.DropDown,
    label: 'Status',
    placeholder: 'Select Status',
    graphQLPropertyName: 'status',
    options: [
      { key: 'Active', value: 'Active' },
      { key: 'Inactive', value: 'Inactive' },
      { key: 'Pending', value: 'Pending' },
    ],
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  staffAssigned: {
    type: FormFieldType.DropDown,
    label: 'Staff Assigned',
    placeholder: 'Select Staff',
    graphQLPropertyName: 'staffAssigned',
    options: [
      { key: 'Staff1', value: 'Staff1' },
      { key: 'Staff2', value: 'Staff2' },
      { key: 'Staff3', value: 'Staff3' },
    ],
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  priority: {
    type: FormFieldType.DropDown,
    label: 'Priority',
    placeholder: 'Select Priority',
    graphQLPropertyName: 'priority',
    options: [
      { key: 'High', value: 'High' },
      { key: 'Medium', value: 'Medium' },
      { key: 'Low', value: 'Low' },
    ],
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  dateReceived: {
    type: FormFieldType.DateRange,
    label: 'Date Received',
    placeholder: 'MM/DD/YY - MM/DD/YY',
    graphQLPropertyName: 'dateReceived',
    value: [],
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  lastUpdated: {
    type: FormFieldType.DateRange,
    label: 'Last Updated',
    placeholder: 'MM/DD/YY - MM/DD/YY',
    graphQLPropertyName: 'lastUpdated',
    value: [],
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  dateCompleted: {
    type: FormFieldType.DateRange,
    label: 'Date Completed',
    placeholder: 'MM/DD/YY - MM/DD/YY',
    graphQLPropertyName: 'dateCompleted',
    value: [],
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
  invoiceStatus: {
    type: FormFieldType.DropDown,
    label: 'Invoice Status',
    placeholder: 'Select Status',
    graphQLPropertyName: 'invoiceStatus',
    options: [
      { key: 'draft', value: 'Draft' },
      { key: 'sent', value: 'Sent' },
      { key: 'received', value: 'Received' },
      { key: 'paid', value: 'Paid' },
    ],
    value: '',
    colSize: 'col-lg-3 col-md-6 col-sm-12',
  },
};

export const formRows: IFormField[][] = [
  [
    formRowsMap['id'],
    formRowsMap['serviceType'],
    formRowsMap['csapReference'],
    formRowsMap['staffAssigned'],
    formRowsMap['siteId'],
    formRowsMap['siteRiskClassification'],
    formRowsMap['siteAddress'],
    formRowsMap['commonName'],
    formRowsMap['priority'],
    formRowsMap['dateReceived'],
    formRowsMap['lastUpdated'],
    formRowsMap['dateCompleted'],
    formRowsMap['status'],
    formRowsMap['invoiceStatus'],
  ],
];

// Function to update staff options dynamically
export const updateStaffOptions = (
  staffOptions: Array<{ key: string; value: string }>,
) => {
  formRowsMap['staffAssigned'].options = staffOptions;
};

// Function to update status options dynamically
export const updateStatusOptions = (
  statusOptions: Array<{ key: string; value: string }>,
) => {
  formRowsMap['status'].options = statusOptions;
};
