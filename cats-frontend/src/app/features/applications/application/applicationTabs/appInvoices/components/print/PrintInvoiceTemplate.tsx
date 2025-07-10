import React, { FC } from 'react';
import { InvoiceStatus } from '../../../../../../../../generated/types';

interface InvoiceLineItemViewModel {
  id: number;
  type: string;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  totalInCents: number;
}

interface InvoiceViewModel {
  id: number;
  applicationId: number;
  recipientId: number;
  subject: string;
  issuedDate: string;
  dueDate: string;
  status: InvoiceStatus;
  taxExempt: boolean;
  pstExempt: boolean;
  subtotalInCents: number;
  gstInCents: number;
  pstInCents: number;
  totalInCents: number;
  notes?: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  lineItems: InvoiceLineItemViewModel[];
}

interface PrintInvoiceTemplateProps {
  invoice: InvoiceViewModel;
  recipientName: string;
  appTypeDescription: string;
}

export const PrintInvoiceTemplate: FC<PrintInvoiceTemplateProps> = ({
  invoice,
  recipientName,
  appTypeDescription,
}) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatLineItemType = (type: string) => {
    switch (type) {
      case 'service':
        return 'Service';
      case 'expense':
        return 'Expense';
      case 'timesheet':
        return 'Timesheet';
      default:
        return type;
    }
  };

  const formatStatus = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Draft:
        return 'Draft';
      case InvoiceStatus.Sent:
        return 'Sent';
      case InvoiceStatus.Received:
        return 'Received';
      case InvoiceStatus.Paid:
        return 'Paid';
      default:
        return status;
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
      }}
    >
      <style>
        {`
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
          }
          @page {
            margin: 1in;
            size: letter;
          }
        `}
      </style>

      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          borderBottom: '2px solid #003366',
          paddingBottom: '20px',
        }}
      >
        <h1
          style={{ color: '#003366', fontSize: '28px', margin: '0 0 10px 0' }}
        >
          Government of British Columbia
        </h1>
        <h2 style={{ color: '#666', fontSize: '20px', margin: '0' }}>
          Environmental Protection Division
        </h2>
      </div>

      {/* Invoice Title */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#003366', fontSize: '24px', margin: '0' }}>
          INVOICE
        </h2>
        <p style={{ fontSize: '18px', margin: '10px 0 0 0', color: '#666' }}>
          Invoice #{invoice.id}
        </p>
      </div>

      {/* Invoice Details */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
        }}
      >
        <div style={{ width: '48%' }}>
          <h3
            style={{
              color: '#003366',
              fontSize: '16px',
              marginBottom: '15px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '5px',
            }}
          >
            Bill To:
          </h3>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>
              {recipientName || `Recipient ID: ${invoice.recipientId}`}
            </strong>
          </p>
        </div>

        <div style={{ width: '48%' }}>
          <h3
            style={{
              color: '#003366',
              fontSize: '16px',
              marginBottom: '15px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '5px',
            }}
          >
            Invoice Details:
          </h3>
          <div style={{ fontSize: '14px' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Application ID:</strong> {invoice.applicationId}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Application Type:</strong> {appTypeDescription}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Issue Date:</strong> {formatDate(invoice.issuedDate)}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Status:</strong> {formatStatus(invoice.status)}
            </p>
          </div>
        </div>
      </div>

      {/* Subject */}
      <div style={{ marginBottom: '30px' }}>
        <h3
          style={{
            color: '#003366',
            fontSize: '16px',
            marginBottom: '10px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '5px',
          }}
        >
          Subject:
        </h3>
        <p style={{ fontSize: '14px', margin: '0' }}>{invoice.subject}</p>
      </div>

      {/* Line Items */}
      <div style={{ marginBottom: '30px' }}>
        <h3
          style={{
            color: '#003366',
            fontSize: '16px',
            marginBottom: '15px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '5px',
          }}
        >
          Invoice Items:
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th
                style={{
                  border: '1px solid #dee2e6',
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}
              >
                Type
              </th>
              <th
                style={{
                  border: '1px solid #dee2e6',
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}
              >
                Description
              </th>
              <th
                style={{
                  border: '1px solid #dee2e6',
                  padding: '12px 8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}
              >
                Qty
              </th>
              <th
                style={{
                  border: '1px solid #dee2e6',
                  padding: '12px 8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}
              >
                Unit Price
              </th>
              <th
                style={{
                  border: '1px solid #dee2e6',
                  padding: '12px 8px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, index) => (
              <tr key={item.id}>
                <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                  {formatLineItemType(item.type)}
                </td>
                <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                  {item.description}
                </td>
                <td
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '8px',
                    textAlign: 'right',
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '8px',
                    textAlign: 'right',
                  }}
                >
                  ${(item.unitPriceInCents / 100).toFixed(2)}
                </td>
                <td
                  style={{
                    border: '1px solid #dee2e6',
                    padding: '8px',
                    textAlign: 'right',
                  }}
                >
                  ${(item.totalInCents / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '30px',
        }}
      >
        <div style={{ width: '300px' }}>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                >
                  Subtotal:
                </td>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'right',
                    borderBottom: '1px solid #dee2e6',
                  }}
                >
                  ${(invoice.subtotalInCents / 100).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                >
                  GST (5%){invoice.taxExempt ? ' - Exempt' : ''}:
                </td>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'right',
                    borderBottom: '1px solid #dee2e6',
                  }}
                >
                  ${(invoice.gstInCents / 100).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                >
                  PST (7%)
                  {invoice.taxExempt || invoice.pstExempt ? ' - Exempt' : ''}:
                </td>
                <td
                  style={{
                    padding: '8px',
                    textAlign: 'right',
                    borderBottom: '1px solid #dee2e6',
                  }}
                >
                  ${(invoice.pstInCents / 100).toFixed(2)}
                </td>
              </tr>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <td
                  style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                >
                  Total:
                </td>
                <td
                  style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    border: '2px solid #003366',
                  }}
                >
                  ${(invoice.totalInCents / 100).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div style={{ marginBottom: '30px' }}>
          <h3
            style={{
              color: '#003366',
              fontSize: '16px',
              marginBottom: '10px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '5px',
            }}
          >
            Notes:
          </h3>
          <p
            style={{
              fontSize: '14px',
              margin: '0',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
            }}
          >
            {invoice.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: '50px',
          paddingTop: '20px',
          borderTop: '1px solid #ccc',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
        }}
      >
        <p style={{ margin: '5px 0' }}>Environmental Protection Division</p>
        <p style={{ margin: '5px 0' }}>Government of British Columbia</p>
        <p style={{ margin: '5px 0' }}>
          Generated on:{' '}
          {new Date().toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        {invoice.createdBy && (
          <p style={{ margin: '5px 0' }}>Created by: {invoice.createdBy}</p>
        )}
      </div>
    </div>
  );
};

export default PrintInvoiceTemplate;
