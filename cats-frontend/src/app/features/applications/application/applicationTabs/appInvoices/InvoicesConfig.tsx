import { FormFieldType } from "@cats/components/input-controls/IFormField";
import { ColumnSize, TableColumn } from "@cats/components/table/TableColumn";
import { formatDateUTC } from "@cats/helpers/utility";
import { StatusType } from "./components/invoice-enums/statusType";
import InvoiceStatus from "./components/invoice-status/InvoiceStatus";
import { FileLinesIcon } from "@cats/components/common/icon";

export const GetInvoicesConfig = (applicationId: number) => {
    
    const invoiceTableConfig: TableColumn[] = [
        {
            id: 1,
            active: true,
            displayName: 'Invoice ID',
            graphQLPropertyName: 'id',
            displayType: { 
                type:   FormFieldType.Link, 
                label: 'Invoice ID',
                tableMode: true,
                graphQLPropertyName: 'id',
                value: '',
                href:`/applications/${applicationId}/invoice/`,
                componentName: 'Invoices',
                customInputTextCss: 'custom-invoices-txt',
            },
            columnSize: ColumnSize.Default,
        },
        {
            id: 2,
            active: true,
            displayName: 'Subject',
            graphQLPropertyName: 'subject',
            displayType: { 
                type:   FormFieldType.Text, 
                label: 'Subject',
                tableMode: true,
                graphQLPropertyName: 'subject',
                value: '',
                customInputTextCss: 'custom-invoices-txt',
            },
            columnSize: ColumnSize.Double,
        },
        {
            id: 3,
            active: true,
            displayName: 'Issued',
            graphQLPropertyName: 'issuedDate',
            displayType: { 
                type:   FormFieldType.Text, 
                label: 'Issued',
                tableMode: true,
                graphQLPropertyName: 'invoiceDate',
                value: '',
                customInputTextCss: 'custom-invoices-txt',
            },
            columnSize: ColumnSize.Default,
            renderCell: (value: any) => formatDateUTC(value),
        },
        {
            id: 4,
            active: true,
            displayName: 'Due',
            graphQLPropertyName: 'dueDate',
            displayType: { 
                type:   FormFieldType.Text, 
                label: 'Due',
                tableMode: true,
                graphQLPropertyName: 'dueDate',
                value: '',
                customInputTextCss: 'custom-invoices-txt',
            },
            columnSize: ColumnSize.Default,
            renderCell: (value: any) => formatDateUTC(value),
        },
        {
            id: 5,
            active: true,
            displayName: 'Status',
            graphQLPropertyName: 'invoiceStatus',
            displayType: { 
                type:   FormFieldType.Label, 
                label: 'Status',
                tableMode: true,
                graphQLPropertyName: 'invoiceStatus',
                value: '',
                customInputTextCss: 'custom-invoices-txt',
            },
            columnSize: ColumnSize.Default,
            dynamicColumn:true,
            renderCell: (value: StatusType) => <InvoiceStatus status={value} />
        },
        {
            id: 6,
            active: true,
            displayName: 'Amount',
            graphQLPropertyName: 'totalInCents',
            displayType: { 
                type:   FormFieldType.Text, 
                label: 'Amount',
                tableMode: true,
                graphQLPropertyName: 'totalInCents',
                value: '',
                customInputTextCss: 'custom-invoices-txt d-flex justify-content-end',
            },
            columnSize: ColumnSize.Default,
            dynamicColumn:true,
            renderCell: (value: any) => `$${(value / 100).toFixed(2)}`,
            customHeaderCss: 'text-end align-middle',
        },
        {
            id: 7,
            active: true,
            displayName: 'Actions',
            graphQLPropertyName: 'id',
            displayType: { 
                type:   FormFieldType.Link, 
                label: 'View',
                tableMode: true,
                graphQLPropertyName: 'id',
                value: '',
                href:`/applications/${applicationId}/invoice/`,
                componentName: 'Invoices',
                customLinkValue: 'View',
                customIcon: <FileLinesIcon />,
                customInputTextCss: 'custom-invoices-link',
                customContainerCss: 'custom-invoices-column-position',
            },
            columnSize: ColumnSize.Small,
            dynamicColumn: true,
            customHeaderCss: 'custom-invoices-tbl-header custom-invoices-column-position',
        }
    ];
    
    return {
        invoiceTableConfig
    };
}