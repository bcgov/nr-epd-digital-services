import { formatDateUTC } from "@cats/helpers/utility";

export const InvoiceEmailTemplate = ( invoiceDetails: any, applicationDetails: any ) => {
    const invoiceMessage = `Hello,
    \nYour invoice summary is below.
    \nInvoice ID: ${invoiceDetails?.id}\nIssue Date: ${formatDateUTC(invoiceDetails?.issuedDate)}\nApplication ID: ${applicationDetails?.id}\nSite Address: ${applicationDetails?.siteAddress}\nApplication Type: ${applicationDetails?.appType?.description}
    \nAmount: $${(invoiceDetails?.totalInCents / 100).toFixed(2)}\nDue Date: ${formatDateUTC(invoiceDetails?.dueDate)}
    \nThank You,\nSite Remediation Services`;

    return invoiceMessage;
};
