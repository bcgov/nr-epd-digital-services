import { FormFieldType, IFormField } from "../../../components/input-controls/IFormField";
import { ColumnSize,  TableColumn } from "../../../components/table/TableColumn";
import avatar from '../../../images/avatar.png';

// When user type is Internal and can be any mode (Edit/SR)
export const notationFormRowsInternal: IFormField[][] = [
    [
        {
            type: FormFieldType.DropDown,
            label: 'Notation Type',
            placeholder: 'Notation Type',
            graphQLPropertyName: 'notationType',
            options: [
                { key: 'type1', value: 'CERTIFICATE OF COMPLIANCE ISSUED USING RISK BASED STANDARDS'},
                 { key: 'type2', value: 'WASTE MANAGEMENT APPROVAL ISSUED'},
                 { key: 'type2', value: 'RISK ASSESSMENT SUBMITTED'}
            ],
            value: '',
            colSize: 'col-lg-5 col-md-7 col-sm-11 col-10',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
        {
            type: FormFieldType.Date,
            label: 'Initiated Date',
            placeholder: 'MM/DD/YY - MM/DD/YY',
            graphQLPropertyName:'initialDate',
            value: [],
            colSize: 'col-lg-3 col-md-4 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
        {
            type: FormFieldType.Date,
            label: 'Completed Date',
            placeholder: 'MM/DD/YY - MM/DD/YYY',
            graphQLPropertyName:'completedDate',
            value: [],
            colSize: 'col-lg-3 col-md-12 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
    ],

    [
        {
            type: FormFieldType.DropDown,
            label: 'Notation Class',
            placeholder: 'Notation Class',
            graphQLPropertyName: 'notationClass',
            options: [
                { key: 'class1', value: 'ENVIRONMENTAL MANAGEMENT ACT: GENERAL'},
                // { key: 'class2', value: 'Class 2'}
            ],
            value: '',
            colSize: 'col-lg-5 col-md-6 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
        {
            type: FormFieldType.Date,
            label: 'Required Date',
            placeholder: 'MM/DD/YY - MM/DD/YY',
            graphQLPropertyName:'requiredDate',
            value: [],
            colSize: 'col-lg-3 col-md-6 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
        {
            type: FormFieldType.DropDown,
            label: 'Ministry Contact',
            placeholder: 'Ministry Contact',
            graphQLPropertyName: 'ministryContact',
            options: [
                { key: 'contact1', value: 'Alex', imageUrl: avatar},
                { key: 'contact2', value: 'John', imageUrl: avatar}
            ],
            value: '',
            isImage: true,
            colSize: 'col-lg-4 col-md-12 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
    ],

    [
        {
            type: FormFieldType.Text,
            label: 'Required Actions',
            placeholder: 'Required Actions',
            graphQLPropertyName:'commonName',
            value: '',
            colSize: 'col-lg-12 col-md-12 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
    ],

    [
        {
            type: FormFieldType.Text,
            label: 'Note',
            placeholder: 'Note',
            graphQLPropertyName:'note',
            value: '',
            colSize: 'col-lg-12 col-md-12 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
    ],
];

// When user type is External
export const notationFormRowExternal: IFormField[][] = [
    [
        {
            type: FormFieldType.DropDown,
            label: 'Notation Type',
            placeholder: 'Notation Type',
            graphQLPropertyName: 'notationType',
            options: [
                { key: 'type1', value: 'Type 1'},
                { key: 'type2', value: 'Type 2'}
            ],
            value: '',
            colSize: 'col-xxl-11 col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-11',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
       
    ],

    [
        {
            type: FormFieldType.DropDown,
            label: 'Notation Class',
            placeholder: 'Notation Class',
            graphQLPropertyName: 'notationClass',
            options: [
                { key: 'class1', value: 'Class 1'},
                { key: 'class2', value: 'Class 2'}
            ],
            value: '',
            colSize: 'col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
         {
            type: FormFieldType.Date,
            label: 'Initiated Date',
            placeholder: 'MM/DD/YY - MM/DD/YY',
            graphQLPropertyName:'initialDate',
            value: [],
            colSize: 'col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
        {
            type: FormFieldType.Date,
            label: 'Required Date',
            placeholder: 'MM/DD/YY - MM/DD/YY',
            graphQLPropertyName:'requiredDate',
            value: [],
            colSize: 'col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
        {
            type: FormFieldType.Date,
            label: 'Completed Date',
            placeholder: 'MM/DD/YY - MM/DD/YYY',
            graphQLPropertyName:'completedDate',
            value: [],
            colSize: 'col-xxl-2 col-xl-2 col-lg-4 col-md-4 col-sm-12 col-xs-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
       
    ],

    [
        {
            type: FormFieldType.Text,
            label: 'Required Actions',
            placeholder: 'Required Actions',
            graphQLPropertyName:'commonName',
            value: '',
            colSize: 'col-lg-12 col-md-12 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
    ],

    [
        {
            type: FormFieldType.Text,
            label: 'Note',
            placeholder: 'Note',
            graphQLPropertyName:'note',
            value: '',
            colSize: 'col-lg-12 col-md-12 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
    ],

    [
        {
            type: FormFieldType.DropDown,
            label: 'Ministry Contact',
            placeholder: 'Ministry Contact',
            graphQLPropertyName: 'ministryContact',
            options: [
                { key: 'contact1', value: 'Ministry Contact 1', imageUrl: avatar},
                { key: 'contact2', value: 'Ministry Contact 2', imageUrl: avatar}
            ],
            value: '',
            isImage: true,
            colSize: 'col-lg-4 col-md-6 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
    ],
];

export const notationFormRowsFirstChild: IFormField[][] = [
    [
        {
            type: FormFieldType.DropDown,
            label: 'Notation Type',
            placeholder: 'Notation Type',
            graphQLPropertyName: 'notationType',
            options: [
                { key: 'type1', value: 'Type 1'},
                { key: 'type2', value: 'Type 2'}
            ],
            value: '',
            colSize: 'col-xxl-5 col-xl-5 col-lg-8 col-md-6 col-sm-12',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
        {
            type: FormFieldType.Date,
            label: 'Initiated Date',
            placeholder: 'MM/DD/YY - MM/DD/YY',
            graphQLPropertyName:'initialDate',
            value: [],
            colSize: 'col-lg-3 col-md-6 col-sm-12 d-none d-xl-block d-xxl-block',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
        {
            type: FormFieldType.Date,
            label: 'Completed Date',
            placeholder: 'MM/DD/YY - MM/DD/YYY',
            graphQLPropertyName:'completedDate',
            value: [],
            colSize: 'col-lg-4 col-md-6 col-sm-12 d-none d-xl-block d-xxl-block d-lg-block d-md-block',
            customLabelCss:'custom-notation-lbl-text',
            customInputTextCss:'custom-notation-input-text',
            customEditLabelCss:'custom-notation-edit-label',
            customEditInputTextCss:'custom-notation-edit-input',
        },
    ],
];



export const notationColumnInternal: TableColumn[] = [
    {
      id: 1,
      displayName: "Role",
      active: true,
      graphQLPropertyName: "role",
      displayType:{
        type: FormFieldType.DropDown,
        label: "Text",        
        graphQLPropertyName: "role",
        value: "",
        options: [
            {key:'CSAP', value:'CSAP'},
            {key:'CSSATEAM', value:'CSSA TEAM'},
            {key:'SDM', value:'SDM'},
            {key:'SITEOWNER', value:'SITE OWNER'}
        ],
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
        placeholder:'Please select the role'
       
      },
      columnSize: ColumnSize.Default
    },
    {
      id: 2,
      displayName: "Participant Name",
      active: true,
      graphQLPropertyName: "participantName",
      displayType:{
        type: FormFieldType.Text,
        label: "Participant Name",
        placeholder: 'Please enter ',
        graphQLPropertyName: "participantName",
        value: "",
        
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
      columnSize: ColumnSize.Triple
    },
    {
      id: 3,
      displayName: "SR",
      active: true,
      graphQLPropertyName: "sr",
      displayType: {
        type: FormFieldType.Checkbox,
        label: "SR",
        placeholder: '',
        graphQLPropertyName: "sr",
        value: "",      
        tableMode: true,
      },
      columnSize: ColumnSize.Default
    },
];

export const notationColumnExternal: TableColumn[] = [
    {
      id: 1,
      displayName: "Role",
      active: true,
      graphQLPropertyName: "role",
      displayType:{
        type: FormFieldType.DropDown,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "id",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
      columnSize: ColumnSize.Default
    },
    {
      id: 2,
      displayName: "Participant Name",
      active: true,
      graphQLPropertyName: "participantName",
      displayType: {
        type: FormFieldType.Label,
        label: "Site ID",
        placeholder: 'Separate IDs by a comma (",")',
        graphQLPropertyName: "participantName",
        value: "",
        validation: {
          pattern: /^[0-9,\s]*$/,
          customMessage: "Site ID can only contain numbers and commas",
        },
        allowNumbersOnly: true,
        colSize: "col-lg-6 col-md-6 col-sm-12",
        customLabelCss: "custom-lbl-text",
        customInputTextCss: "custom-input-text",
        tableMode: true,
      },
      columnSize: ColumnSize.Triple
    },
];
  
