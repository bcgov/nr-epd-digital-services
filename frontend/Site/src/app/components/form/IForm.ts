
export enum FormFieldType {
    Text = 'text',
    DropDown = 'dropdown',
    Date =  'date',
    Group = 'group',
}

export interface IFormField {
    type: FormFieldType.Text | FormFieldType.DropDown | FormFieldType.Date | FormFieldType.Group;
    label: string;
    placeholder?: string;
    graphQLPropertyName?: string,
    allowNumbersOnly?: boolean; 
    options?: {key :string, value: string}[];
    value: any;
    children?: IFormField[];
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        customMessage?: string;
    };
}
