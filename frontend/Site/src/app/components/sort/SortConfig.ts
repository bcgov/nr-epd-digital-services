import { FormFieldType, IFormField } from "../input-controls/IFormField";


export const notationSortBy: IFormField[][] =[
    [
        {
            type: FormFieldType.DropDown,
            label: 'Sort By',
            placeholder: 'Sort by',
            graphQLPropertyName: 'sortBy',
            options: [
                { key: 'newToOld', value: 'Newest to Oldest'},
                { key: 'oldTonew', value: 'Oldest to newest'},
            ],
            value: '',
            colSize: 'col-lg-12 col-md-12 col-sm-12',
        },
    ]
]