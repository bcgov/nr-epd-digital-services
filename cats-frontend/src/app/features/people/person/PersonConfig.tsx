import { PencilIcon } from "../../../components/common/icon";
import { FormFieldType, IFormField } from "../../../components/input-controls/IFormField";
import { ColumnSize, TableColumn } from "../../../components/table/TableColumn";
import { RequestStatus } from "../../../helpers/requests/status";

const personForm: { [key: string]: IFormField } = {
  active: {
    type:FormFieldType.Switch,
    label: 'Active',
    graphQLPropertyName:'isActive',
    value:'',
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
  },
  taxExempt: {
    type:FormFieldType.Switch,
    label: 'Tax Exempt',
    graphQLPropertyName:'isTaxExempt',
    value:'',
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
  },
  firstName: {
      type: FormFieldType.Text,
      label: 'First Name',
      graphQLPropertyName: 'firstName',
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
      graphQLPropertyName: 'middleName',
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
      graphQLPropertyName: 'lastName',
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
      graphQLPropertyName: 'phone',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt',
      allowNumbersOnly: true,
      validation: {
        pattern: /^\d{0,10}$/,
        customMessage: 'Phone number must be digits and cannot be more than 10 digits',
      },
  },
  cell: {
      type: FormFieldType.Text,
      label: 'Cell',
      graphQLPropertyName: 'mobile',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt',
      allowNumbersOnly: true,
      validation: {
        pattern: /^\d{0,10}$/,
        customMessage: 'Cell number must be digits and cannot be more than 10 digits',
      },
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
      customEditInputTextCss:'custom-people-edit-txt',
      allowNumbersOnly: true,
      validation: {
        pattern: /^\d{0,10}$/,
        customMessage: 'Fax number must be digits and cannot be more than 10 digits',
      },
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
      customEditInputTextCss:'custom-people-edit-txt',
      validation: {
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        customMessage: 'Valid email is required',
      },
  },
  idir: {
      type: FormFieldType.Text,
      label: 'IDIR',
      graphQLPropertyName: 'loginUserName',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  address1: {
    type: FormFieldType.Search,
    label: 'Address Line 1',
    graphQLPropertyName: 'address_1',
    customMenuMessage: <span>Please select the address line 1: </span>,
    value: '',
    options: null,
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
    customEditInputTextCss:'custom-people-edit-txt',
    searchCustomInputContainerCss: 'custom-search-input-container',
    searchCustomInputMenuCss: 'custom-search-input-menu',
    customInfoMessage: null,
    isSearchCustomInputIcon: false,
  },
  address2: {
    type: FormFieldType.Search,
    label: 'Address Line 2',
    graphQLPropertyName: 'address_2',
    value: '',
    customMenuMessage: <span>Please select the address line 2: </span>,
    options: null,
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
    customEditInputTextCss:'custom-people-edit-txt',
    searchCustomInputContainerCss: 'custom-search-input-container',
    searchCustomInputMenuCss: 'custom-search-input-menu',
    customInfoMessage: null,
    isSearchCustomInputIcon: false,
  },
  city: {
      type: FormFieldType.Text,
      label: 'City',
      graphQLPropertyName: 'city',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  province: {
    type: FormFieldType.Text,
    label: 'Province',
    graphQLPropertyName: 'prov',
    value: '',
    colSize: 'col-lg-4 col-md-6 col-sm-12',
    customLabelCss:'custom-people-lbl',
    customEditLabelCss:'custom-people-edit-lbl',
    customInputTextCss:'custom-people-txt',
    customEditInputTextCss:'custom-people-edit-txt'
  },
  country: {
    type: FormFieldType.Text,
    label: 'Country',
    graphQLPropertyName: 'country',
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
      graphQLPropertyName: 'postal',
      value: '',
      colSize: 'col-lg-4 col-md-6 col-sm-12',
      customLabelCss:'custom-people-lbl',
      customEditLabelCss:'custom-people-edit-lbl',
      customInputTextCss:'custom-people-txt',
      customEditInputTextCss:'custom-people-edit-txt'
  },
  noteDate:{
    type: FormFieldType.Date,
    label: 'Date',
    placeholder: 'EE, MMM dd, yyyy',
    dateFormat:'EE, MMM dd, yyyy',
    graphQLPropertyName: 'noteDate',
    value: '',
    colSize: 'col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12',
    customEditLabelCss: 'custom-note-modal-edit-label',
    customEditInputTextCss: 'custom-note-modal-edit-input .rs-input .rs-input-group-addon',
    isDisabled: true,
  },
  noteUser:{
    type: FormFieldType.Text,
    label: 'User',
    graphQLPropertyName: 'noteUser',
    value: '',
    colSize: 'col-lg-6 col-md-6 col-sm-12',
    customEditLabelCss: 'custom-note-modal-edit-label',
    customEditInputTextCss: 'custom-note-modal-edit-input',
    isDisabled: true,
  },
  noteDescription: {
    type: FormFieldType.TextArea,
    label:'Note',
    graphQLPropertyName: 'noteDescription',
    value: '',
    colSize: 'col-lg-12 col-md-12 col-sm-12',
    customEditLabelCss: 'custom-note-modal-edit-label',
    customEditInputTextCss: 'custom-note-modal-edit-input',
    textAreaRow: 3,
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

export const noteForm: IFormField[][] = [
    [
      personForm['noteDate'],
      personForm['noteUser'],
      personForm['noteDescription'],
    ]
];

export const noteColumns: TableColumn[] = [
    {
        id: 1,
        displayName: 'Date',
        active: true,
        graphQLPropertyName: 'noteDate',
        columnSize: ColumnSize.Small,
        displayType: {
          type: FormFieldType.Date,
          dateFormat:'EE, MMM dd, yyyy',
          graphQLPropertyName: 'noteDate',
          label: '',
          value: '',
          colSize: 'col-lg-6 col-md-6 col-sm-12',
          customInputTextCss: 'custom-people-edit-lbl',
          tableMode: true,
        },
    },
    {
      id: 2,
      displayName: 'User',
      active: true,
      graphQLPropertyName: 'noteUser',
      columnSize: ColumnSize.Small,
      displayType: {
        type: FormFieldType.Text,
        label: '',
        graphQLPropertyName: 'noteUser',
        value: '',
        colSize: 'col-lg-6 col-md-6 col-sm-12',
        customInputTextCss: 'custom-people-edit-lbl',
        tableMode: true,
      },
    },
    {
        id: 3,
        displayName: 'Description',
        active: true,
        graphQLPropertyName: 'noteDescription',
        columnSize: ColumnSize.Triple,
        displayType: {
          type: FormFieldType.Text,
          label: '',
          graphQLPropertyName: 'noteDescription',
          value: '',
          colSize: 'col-lg-12 col-md-12 col-sm-12',
          customInputTextCss: 'custom-people-edit-lbl',
          tableMode: true,
        },
    },
    {
      id: 4,
      displayName: 'Actions',
      active: true,
      graphQLPropertyName: 'edit',
      displayType: {
        type: FormFieldType.Link,
        label: 'Edit',
        graphQLPropertyName: 'edit',
        value: '',
        customLinkValue: 'Edit',
        customInputTextCss: 'custom-people-edit-lbl',
        tableMode: true,
        href: '#',
        customIcon: <PencilIcon />,
        // Give the previous screen name only in case when on click of link modal will pop up if you will move to 
        // another page give current page name to show previous screen name on back button.
        componentName:'Manage People' 
      },
      columnSize: ColumnSize.XtraSmall,
      dynamicColumn: true,
      customHeaderCss:'custom-note-tbl-header',
    },
];
  