
export enum FormFieldType {
    Text = 'text',
    DropDown = 'dropdown',
    Date =  'date',
    Group = 'group',
    Label = 'label',
    Link = 'link',
    Checkbox = 'checkbox',
}

export interface IFormField {
    type: FormFieldType.Text | FormFieldType.DropDown | FormFieldType.Date | FormFieldType.Group | FormFieldType.Label | FormFieldType.Link | FormFieldType.Checkbox;
    label: string;
    isLabel?: boolean;
    placeholder?: string;
    colSize?: string;
    customLabelCss?:string;
    customEditLabelCss?:string;
    customInputTextCss?:string;
    customEditInputTextCss?:string;
    graphQLPropertyName?: string,
    allowNumbersOnly?: boolean; 
    options?: {key :string, value: string, imageUrl?: any}[];
    value?: any;
    isChecked?: boolean;
    children?: IFormField[];
    suffix?: string;
    isImage?: boolean;
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        customMessage?: string;
    };
    tableMode?:boolean;
    href?:string
}
