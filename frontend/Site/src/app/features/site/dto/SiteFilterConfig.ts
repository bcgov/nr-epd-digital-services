interface DropdownKeyValuePair {
    key :string,
    value: string
}

export interface FormField {
    type: 'text' | 'dropdown' | 'date' | 'group';
    label: string;
    placeholder?: string;
    graphQLPropertyName?: string,
    allowNumbersOnly?: boolean; 
    options?: {key :string, value: string}[];
    value: any;
    children?: FormField[];
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        customMessage?: string;
    };
}


export const formRows: FormField[][] = [
    [
        {
            type: 'text',
            label: 'Site ID',
            placeholder: 'Separate IDs by a comma (",")',
            graphQLPropertyName: 'id',
            value: '',
            validation: {
                pattern: /^[0-9,\s]*$/,
                customMessage: 'Site ID can only contain numbers and commas',
            },
            allowNumbersOnly: true,
        },
        {
            type: 'dropdown',
            label: 'Site Remediation Status',
            placeholder: 'Select Code',
            graphQLPropertyName: 'srStatus',
            options: [
                { key: 'Y', value: 'Yes'},
                { key: 'N', value: 'No'}
            ],
            value: '',
        },
        {
            type: 'text',
            label: 'Common Name',
            placeholder: 'Type keywords',
            graphQLPropertyName:'commonName',
            value: '',
            
        },
        {
            type: 'dropdown',
            label: 'Site Risk Code',
            placeholder: 'Select Code',
            graphQLPropertyName:'siteRiskCode',
            options: [
                { key : 'HR', value : 'High-Risk'},
                { key : 'NHR', value : 'Non High-Risk'},
                { key : 'UNC', value : 'Unclassified'}
            ],
            value: '',
        },
        {
            type: 'text',
            label: 'Site Address',
            placeholder: 'Type keywords',
            graphQLPropertyName:'addrLine_1',
            value: '',
        },
        {
            type: 'dropdown',
            label: 'City',
            placeholder: 'Select City',
            graphQLPropertyName:'city',
            options: [
                {key:'City1', value:'City1'},
                {key:'City2', value:'City2'},
                {key:'City3', value:'City3'}
            ],
            value: '',
        },
        {
            type: 'dropdown',
            label: 'Created By',
            placeholder: 'Select Staff',
            graphQLPropertyName:'whoCreated',
            options: [
                {key:'Staff1', value:'Staff1'},
                {key:'Staff2', value:'Staff2'},
                {key:'Staff3', value:'Staff3'}
            ],
            value: '',
        },
        {
            type: 'dropdown',
            label: 'Lat/Long Reliability',
            placeholder: 'Select Reliability',
            graphQLPropertyName:'latlongReliabilityFlag',
            options: [ 
                {key: 'VERIFIED', value:'VERIFIED'},
                {key: 'UNCONFIRMED', value:'UNCONFIRMED'},
            ],
            value: '',
        },
        {
            type: 'text',
            label: 'Latitude (Decimal)',
            placeholder: 'Type latitude as decimal',
            graphQLPropertyName:'latdeg',
            value: '',
            validation: {
                pattern: /^[0-9.\s]*$/,
                customMessage: 'Latitude (Decimal) can only contain numbers and decimal points',
            },
            allowNumbersOnly: true,
        },
        {
            type: 'group',
            label: 'Latitude (D, M, S)',
            value: '',
            // graphQLPropertyName:'latitude',
            children: [
                {
                    type: 'text',
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
                    type: 'text',
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
                    type: 'text',
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
            type: 'text',
            label: 'Longitude (Decimal)',
            placeholder: 'Type longitude as decimal',
            graphQLPropertyName:'longdeg',
            value: '',
            validation: {
                pattern: /^[0-9.\s]*$/,
                customMessage: 'Longitude (Decimal) can only contain numbers and decimal points',
            },
            allowNumbersOnly : true,
        },
        {
            type: 'group',
            label: 'Longitude (D, M, S)',
            value: '',
            // graphQLPropertyName:'longitude',
            children: [
                {
                    type: 'text',
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
                    type: 'text',
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
                    type: 'text',
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
            type: 'date',
            label: 'Date Created',
            placeholder: 'MM/DD/YY - MM/DD/YY',
            graphQLPropertyName:'whenCreated',
            value: [],
        },
        {
            type: 'date',
            label: 'Last Updated',
            placeholder: 'MM/DD/YY - MM/DD/YYY',
            graphQLPropertyName:'whenUpdated',
            value: [],
        },
    ],
];