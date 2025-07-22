const InvoicePreviewTemplate = (invoice: any, application: any) => {
    const formatPrintDate = (dateString: string): string => {
      return new Date(dateString).toLocaleDateString('en-CA');
    };

    const formatCurrency = (cents: number): string => {
      return `$${(cents / 100).toFixed(2)}`;
    };

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${invoice?.id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              font-size: 12px; 
              line-height: 1.4; 
            }
            .invoice-header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px; 
            }
            .invoice-title { 
              font-size: 24px; 
              font-weight: bold; 
              color: #333; 
              margin-bottom: 10px; 
            }
            .invoice-info { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 20px; 
            }
            .invoice-details, .recipient-info { 
              width: 48%; 
            }
            .section-title { 
              font-size: 14px; 
              font-weight: bold; 
              color: #333; 
              margin-bottom: 10px; 
              border-bottom: 1px solid #ccc; 
              padding-bottom: 5px; 
            }
            .detail-row { 
              margin-bottom: 5px; 
            }
            .detail-label { 
              font-weight: bold; 
              display: inline-block; 
              width: 100px; 
            }
            .line-items { 
              margin: 20px 0; 
            }
            .line-items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px; 
            }
            .line-items-table th, .line-items-table td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            .line-items-table th { 
              background-color: #f5f5f5; 
              font-weight: bold; 
            }
            .line-items-table .text-right { 
              text-align: right; 
            }
            .totals { 
              width: 300px; 
              margin-left: auto; 
              border-collapse: collapse; 
            }
            .totals td { 
              padding: 5px 10px; 
              border: 1px solid #ddd; 
            }
            .totals .total-label { 
              font-weight: bold; 
              background-color: #f5f5f5; 
            }
            .totals .total-amount { 
              text-align: right; 
            }
            .totals .grand-total { 
              background-color: #e8f4f8; 
              font-weight: bold; 
            }
            .notes { 
              margin-top: 20px; 
              border-top: 1px solid #ccc; 
              padding-top: 10px; 
            }
            @media print {
              body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
              }
              .invoice-info { 
                display: block; 
              }
              .invoice-details, .recipient-info { 
                width: 100%; 
                margin-bottom: 15px; 
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="invoice-title">INVOICE</div>
            <div>Ministry of Environment and Climate Change Strategy</div>
            <div>Environmental Protection Division</div>
          </div>

          <div class="invoice-info">
            <div class="invoice-details">
              <div class="section-title">Invoice Details</div>
              <div class="detail-row">
                <span class="detail-label">Invoice #:</span>
                <span>${invoice?.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Application:</span>
                <span>${application?.appType?.description}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Issued Date:</span>
                <span>${formatPrintDate(invoice?.issuedDate)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Due Date:</span>
                <span>${formatPrintDate(invoice?.dueDate)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span>${invoice?.status}</span>
              </div>
            </div>

            <div class="recipient-info">
              <div class="section-title">Bill To</div>
              <div class="detail-row">
                <span class="detail-label">Recipient:</span>
                <span>${invoice?.recipient?.fullName || `ID: ${invoice?.recipientId}`}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Subject:</span>
                <span>${invoice?.subject}</span>
              </div>
            </div>
          </div>

          <div class="line-items">
            <div class="section-title">Line Items</div>
            <table class="line-items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Type</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice?.lineItems
                  .map(
                    (item: any) => `
                  <tr>
                    <td>${item?.description}</td>
                    <td>${item?.type}</td>
                    <td class="text-right">${item?.quantity}</td>
                    <td class="text-right">${formatCurrency(item?.unitPriceInCents)}</td>
                    <td class="text-right">${formatCurrency(item?.totalInCents)}</td>
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <table class="totals">
            <tr>
              <td class="total-label">Subtotal:</td>
              <td class="total-amount">${formatCurrency(invoice?.subtotalInCents)}</td>
            </tr>
            <tr>
              <td class="total-label">GST (5%):</td>
              <td class="total-amount">${invoice?.taxExempt ? 'Tax Exempt' : formatCurrency(invoice?.gstInCents)}</td>
            </tr>
            <tr>
              <td class="total-label">PST (7%):</td>
              <td class="total-amount">${invoice?.taxExempt || invoice?.pstExempt ? 'Tax Exempt' : formatCurrency(invoice?.pstInCents)}</td>
            </tr>
            <tr class="grand-total">
              <td class="total-label">Total:</td>
              <td class="total-amount">${formatCurrency(invoice?.totalInCents)}</td>
            </tr>
          </table>

          ${
            invoice?.notes
              ? `
            <div class="notes">
              <div class="section-title">Notes</div>
              <p>${invoice?.notes}</p>
            </div>
          `
              : ''
          }
        </body>
      </html>
    `;
  return invoiceHtml;
}

export default InvoicePreviewTemplate;