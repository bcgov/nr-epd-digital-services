import { PencilIcon } from "../../../components/common/icon";
import { FormFieldType, IFormField } from "../../../components/input-controls/IFormField";
import { ColumnSize, TableColumn } from "../../../components/table/TableColumn";
import { RequestStatus } from "../../../helpers/requests/status";

const personForm: { [key: string]: IFormField } = {
  active: {
    type:FormFieldType.Switch,
    label: 'Active',
    graphQLPropertyName:'end_date',
    value:'',
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
  },
  taxExempt: {
    type:FormFieldType.Switch,
    label: 'Tax Exempt',
    graphQLPropertyName:'gst_exempt',
    value:'',
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
  },
  firstName: {
      type: FormFieldType.Text,
      label: 'First Name',
      graphQLPropertyName: 'first_name',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  middleName: {
      type: FormFieldType.Text,
      label: 'Middle Name',
      graphQLPropertyName: 'middle_name',
      value: '',
      customLabelCss:'custom-people-lbl',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  lastName: {
      type: FormFieldType.Text,
      label: 'Last Name',
      graphQLPropertyName: 'last_name',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  phone: {
      type: FormFieldType.Text,
      label: 'Phone',
      graphQLPropertyName: 'tel',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  cell: {
      type: FormFieldType.Text,
      label: 'Cell',
      graphQLPropertyName: 'cel',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  fax: {
      type: FormFieldType.Text,
      label: 'Fax',
      graphQLPropertyName: 'fax',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  email: {
      type: FormFieldType.Text,
      label: 'E-mail',
      graphQLPropertyName: 'email',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  idir: {
      type: FormFieldType.Text,
      label: 'IDIR',
      graphQLPropertyName: 'idir',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  address1: {
      type: FormFieldType.Text,
      label: 'Address Line 1',
      graphQLPropertyName: 'address1',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  address2: {
      type: FormFieldType.Text,
      label: 'Address Line 2',
      graphQLPropertyName: 'address2',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  city: {
      type: FormFieldType.DropDown,
      label: 'City',
      placeholder: 'Select City',
      graphQLPropertyName: 'city',
      options: [
        { key: 'City1', value: 'City1' },
        { key: 'City2', value: 'City2' },
        { key: 'City3', value: 'City3' },
      ],
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  province: {
    type: FormFieldType.DropDown,
    label: 'Province',
    placeholder: 'Select Province',
    graphQLPropertyName: 'province',
    options: [
      { key: 'Province1', value: 'Province1' },
      { key: 'Province2', value: 'Province2' },
      { key: 'Province3', value: 'Province3' },
    ],
    value: '',
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
    customEditInputTextCss:'custom-people-edit-txt'
  },
  country: {
    type: FormFieldType.DropDown,
    label: 'Country',
    placeholder: 'Select Country',
    graphQLPropertyName: 'country',
    options: [
      { key: 'Country1', value: 'Country1' },
      { key: 'Country2', value: 'Country2' },
      { key: 'Country3', value: 'Country3' },
    ],
    value: '',
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
    customEditInputTextCss:'custom-people-edit-txt'
  },
  postalCode: {
      type: FormFieldType.Text,
      label: 'Postal Code',
      graphQLPropertyName: 'postal_code',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
}

export const contactInformationForm: IFormField[][] = [
   [
      personForm['active'],
      personForm['taxExempt'],
   ],
   [ 
      personForm['firstName'],
      personForm['middleName'],
      personForm['lastName'],
      personForm['phone'],
      personForm['cell'],
      personForm['fax'],
      personForm['email'],
      personForm['idir'],
   ]
];

export const addressForm: IFormField[][] = [
    [
      personForm['address1'],
      personForm['address2'],
      personForm['city'],
      personForm['province'],
      personForm['country'],
      personForm['postalCode'],
    ]
];

export const noteColumns: TableColumn[] = [
    {
        id: 1,
        displayName: 'Date',
        active: true,
        graphQLPropertyName: 'note_date',
        columnSize: ColumnSize.Small,
        displayType: {
          type: FormFieldType.Date,
          dateFormat:'EE, MMM dd, yyyy',
          graphQLPropertyName: 'note_date',
          label: '',
        //   placeholder: 'MM/DD/YY',
          value: '',
          colSize: 'col-lg-6 col-md-6 col-sm-12',
        //   customLabelCss: 'custom-participant-lbl-text',
          customInputTextCss: 'custom-people-edit-lbl',
        //   customEditLabelCss: 'custom-participant-edit-label',
        //   customEditInputTextCss:
        //     'custom-participant-edit-input .rs.input .rs-input-group-addon',
        // customLabelCss:'custom-people-lbl',
        // customEditLabelCss:'custom-people-edit-lbl',
          tableMode: true,
        //   validation: {
        //     required: true,
        //     customMessage: 'Start Date is required.',
        //   },
        },
    },
    {
      id: 2,
      displayName: 'User',
      active: true,
      graphQLPropertyName: 'psn_id',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.DropDownWithSearch,
        label: '',
        isLabel: false,
        graphQLPropertyName: 'psn_id',
        placeholder: 'Please enter User Name.',
        isLoading: RequestStatus.idle,
        value: '',
        options: [
          {
            key: '12345',
            value:'abcd',
          },
          {
            key: '12346',
            value:'abce',
          },
          {
            key: '12347',
            value:'abcf',
          },
        ],
        filteredOptions: [],
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        // customLabelCss: 'custom-participant-lbl-text',
        customInputTextCss: 'custom-people-edit-lbl',
        // customEditLabelCss: 'custom-participant-edit-label',
        // customEditInputTextCss: 'custom-participant-edit-input',
        // customPlaceholderCss: 'custom-participant-search-placeholder',
        // customLabelCss:'custom-people-lbl',
        // customEditLabelCss:'custom-people-edit-lbl',
        customMenuMessage: <span>Please select user name:</span>,
        tableMode: true,
        handleSearch: () => {},
        // validation: {
        //   required: true,
        //   customMessage: 'Participant Name is required.',
        // },
      },
    },
    {
        id: 3,
        displayName: 'Description',
        active: true,
        graphQLPropertyName: 'note_text',
        columnSize: ColumnSize.Triple,
        displayType: {
          type: FormFieldType.Text,
          label: '',
          graphQLPropertyName: 'note_text',
          value: '',
          colSize: 'col-lg-12 col-md-12 col-sm-12',
        //   customLabelCss: 'custom-participant-lbl-text',
          customInputTextCss: 'custom-people-edit-lbl',
        //   customEditLabelCss: 'custom-participant-edit-label',
        //   customEditInputTextCss: 'custom-participant-edit-input',
          // customLabelCss:'custom-people-lbl',
          // customEditLabelCss:'custom-people-edit-lbl',
          tableMode: true,
        },
    },
    {
      id: 4,
      displayName: 'Actions',
      active: true,
      graphQLPropertyName: 'note_id',
      displayType: {
        type: FormFieldType.Link,
        label: 'Edit',
        graphQLPropertyName: 'note_id',
        value: '',
        customLinkValue: 'Edit',
        customInputTextCss: 'custom-people-edit-lbl',
        // customLabelCss:'custom-people-lbl',
        // customEditLabelCss:'custom-people-edit-lbl',
        tableMode: true,
        href: '#',
        customIcon: <PencilIcon />,
      },
      columnSize: ColumnSize.XtraSmall,
      dynamicColumn: true,
      customHeaderCss:'custom-note-tbl-header',
      linkRedirectionURL: '#',
    },
];
  