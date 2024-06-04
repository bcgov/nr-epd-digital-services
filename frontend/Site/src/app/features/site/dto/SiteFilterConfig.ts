import { FormFieldType, IFormField } from "../../../components/input-controls/IFormField";


export const formRows: IFormField[][] = [
    [
        {
            type: FormFieldType.Text,
            label: 'Site ID',
            placeholder: 'Separate IDs by a comma (",")',
            graphQLPropertyName: 'id',
            value: '',
            validation: {
                pattern: /^[0-9,\s]*$/,
                customMessage: 'Site ID can only contain numbers and commas',
            },
            allowNumbersOnly: true,
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.DropDown,
            label: 'Site Remediation Status',
            placeholder: 'Select Code',
            graphQLPropertyName: 'srStatus',
            options: [
                { key: 'Y', value: 'Yes'},
                { key: 'N', value: 'No'}
            ],
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.Text,
            label: 'Common Name',
            placeholder: 'Type keywords',
            graphQLPropertyName:'commonName',
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
            
        },
        {
            type: FormFieldType.DropDown,
            label: 'Site Risk Code',
            placeholder: 'Select Code',
            graphQLPropertyName:'siteRiskCode',
            options: [
                { key : 'HR', value : 'High-Risk'},
                { key : 'NHR', value : 'Non High-Risk'},
                { key : 'UNC', value : 'Unclassified'}
            ],
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.Text,
            label: 'Site Address',
            placeholder: 'Type keywords',
            graphQLPropertyName:'addrLine_1',
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.DropDown,
            label: 'City',
            placeholder: 'Select City',
            graphQLPropertyName:'city',
            options: [
                {key:'City1', value:'City1'},
                {key:'City2', value:'City2'},
                {key:'City3', value:'City3'}
            ],
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.DropDown,
            label: 'Created By',
            placeholder: 'Select Staff',
            graphQLPropertyName:'whoCreated',
            options: [
                {key:'Staff1', value:'Staff1'},
                {key:'Staff2', value:'Staff2'},
                {key:'Staff3', value:'Staff3'}
            ],
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.DropDown,
            label: 'Lat/Long Reliability',
            placeholder: 'Select Reliability',
            graphQLPropertyName:'latlongReliabilityFlag',
            options: [ 
                {key: 'VERIFIED', value:'VERIFIED'},
                {key: 'UNCONFIRMED', value:'UNCONFIRMED'},
            ],
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.Text,
            label: 'Latitude (Decimal)',
            placeholder: 'Type latitude as decimal',
            graphQLPropertyName:'latdeg',
            value: '',
            validation: {
                pattern: /^[0-9.\s]*$/,
                customMessage: 'Latitude (Decimal) can only contain numbers and decimal points',
            },
            allowNumbersOnly: true,
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.Group,
            label: 'Latitude (D, M, S)',
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
            children: [
                {
                    type: FormFieldType.Text,
                    label: 'Deg',
                    placeholder: 'Deg',
                    graphQLPropertyName:'latDegrees',
                    value: '',
                    validation: {
                        pattern: /^[0-9.\s]*$/,
                        customMessage: 'Latitude Degrees can only contain numbers and decimal points',
                    },
                    allowNumbersOnly : true,
                },
                {
                    type: FormFieldType.Text,
                    label: 'Min',
                    placeholder: 'Min',
                    graphQLPropertyName:'latMinutes',
                    value: '',
                    validation: {
                        pattern: /^[0-9.\s]*$/,
                        customMessage: 'Latitude Minutes can only contain numbers and decimal points',
                    },
                    allowNumbersOnly : true,
                },
                {
                    type: FormFieldType.Text,
                    label: 'Sec',
                    placeholder: 'Sec',
                    graphQLPropertyName:'latSeconds',
                    value: '',
                    validation: {
                        pattern: /^[0-9.\s]*$/,
                        customMessage: 'Latitude Seconds can only contain numbers and decimal points',
                    },
                    allowNumbersOnly : true,
                },
            ],
        },
        {
            type: FormFieldType.Text,
            label: 'Longitude (Decimal)',
            placeholder: 'Type longitude as decimal',
            graphQLPropertyName:'longdeg',
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
            validation: {
                pattern: /^[0-9.\s]*$/,
                customMessage: 'Longitude (Decimal) can only contain numbers and decimal points',
            },
            allowNumbersOnly : true,
        },
        {
            type: FormFieldType.Group,
            label: 'Longitude (D, M, S)',
            value: '',
            colSize: 'col-lg-4 col-md-6 col-sm-12',
            children: [
                {
                    type: FormFieldType.Text,
                    label: 'Deg',
                    placeholder: 'Deg',
                    graphQLPropertyName:'longDegrees',
                    value: '',
                    validation: {
                        pattern: /^[0-9.\s]*$/,
                        customMessage: 'Longitude Degrees can only contain numbers and decimal points',
                    },
                    allowNumbersOnly : true,
                },
                {
                    type: FormFieldType.Text,
                    label: 'Min',
                    placeholder: 'Min',
                    graphQLPropertyName:'longMinutes',
                    value: '',
                    validation: {
                        pattern: /^[0-9.\s]*$/,
                        customMessage: 'Longitude Minutes can only contain numbers and decimal points',
                    },
                    allowNumbersOnly : true,
                },
                {
                    type: FormFieldType.Text,
                    label: 'Sec',
                    placeholder: 'Sec',
                    graphQLPropertyName:'longSeconds',
                    value: '',
                    validation: {
                        pattern: /^[0-9.\s]*$/,
                        customMessage: 'Longitude Seconds can only contain numbers and decimal points',
                    },
                    allowNumbersOnly : true,
                },
            ],
        },
        {
            type: FormFieldType.Date,
            label: 'Date Created',
            placeholder: 'MM/DD/YY - MM/DD/YY',
            graphQLPropertyName:'whenCreated',
            value: [],
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
        {
            type: FormFieldType.Date,
            label: 'Last Updated',
            placeholder: 'MM/DD/YY - MM/DD/YYY',
            graphQLPropertyName:'whenUpdated',
            value: [],
            colSize: 'col-lg-4 col-md-6 col-sm-12',
        },
    ],
];