import { useState, useEffect, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormGroup, Form, Col, Row, Alert } from 'react-bootstrap';
import { Button } from '@cats/components/button/Button';
import { FaTimes } from 'react-icons/fa';
import { useGetHeaderDetailsByApplicationIdQuery } from '@cats/features/applications/application/ApplicationDetails.generated';
import { useGetInvoiceByIdQuery } from '../../getInvoiceById.generated';
import { useGetPersonByIdQuery } from './getPersonById.generated';

enum InvoiceLineItemType {
  SERVICE = 'service',
  EXPENSE = 'expense',
  TIMESHEET = 'timesheet',
}

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
  status: string;
  taxExempt: boolean;
  subtotalInCents: number;
  gstInCents: number;
  pstInCents: number;
  totalInCents: number;
  createdBy: string | null;
  updatedBy: string | null;
  lineItems: InvoiceLineItemViewModel[];
}

interface ViewInvoiceFormProps {}

export const ViewInvoiceForm: FC<ViewInvoiceFormProps> = (props) => {
  const { id, applicationId } = useParams<{
    id: string;
    applicationId: string;
  }>();

  const navigate = useNavigate();
  const numericInvoiceId = id ? parseInt(id, 10) : 0;
  const numericApplicationId = applicationId ? parseInt(applicationId, 10) : 0;

  // Fetch invoice details
  const {
    data: invoiceData,
    loading: invoiceLoading,
    error: invoiceError,
  } = useGetInvoiceByIdQuery({
    variables: { id: numericInvoiceId },
    skip: !numericInvoiceId,
  });

  // Fetch application details for the header
  const { data: applicationData, loading: applicationLoading } =
    useGetHeaderDetailsByApplicationIdQuery({
      variables: { applicationId: numericApplicationId },
      skip: !numericApplicationId,
    });

  const appTypeDescription =
    applicationData?.getApplicationDetailsById.data?.appType?.description || '';

  const [invoice, setInvoice] = useState<InvoiceViewModel | null>(null);
  const [recipientName, setRecipientName] = useState<string>('');

  useEffect(() => {
    if (invoiceData?.getInvoiceById?.invoice) {
      // Map the GraphQL response to our view model
      const invoiceResponse = invoiceData.getInvoiceById.invoice;
      const mappedInvoice: InvoiceViewModel = {
        id: invoiceResponse.id,
        applicationId: invoiceResponse.applicationId,
        recipientId: invoiceResponse.recipientId,
        subject: invoiceResponse.subject,
        issuedDate: invoiceResponse.issuedDate,
        dueDate: invoiceResponse.dueDate,
        status: invoiceResponse.status,
        taxExempt: invoiceResponse.taxExempt,
        subtotalInCents: invoiceResponse.subtotalInCents,
        gstInCents: invoiceResponse.gstInCents,
        pstInCents: invoiceResponse.pstInCents,
        totalInCents: invoiceResponse.totalInCents,
        createdBy: invoiceResponse.createdBy || null,
        updatedBy: invoiceResponse.updatedBy || null,
        lineItems: (invoiceResponse.lineItems || []).map((item) => ({
          id: item.id,
          type: item.type,
          description: item.description,
          quantity: item.quantity,
          unitPriceInCents: item.unitPriceInCents,
          totalInCents: item.totalInCents,
        })),
      };
      setInvoice(mappedInvoice);
    }
  }, [invoiceData]);

  // Fetch recipient details once we have the invoice data
  const { data: personData, loading: personLoading } = useGetPersonByIdQuery({
    variables: { id: invoice?.recipientId || 0 },
    skip: !invoice?.recipientId,
  });

  // Update recipient name when person data is loaded
  useEffect(() => {
    if (
      personData?.findPersonById?.data &&
      personData.findPersonById.data.length > 0
    ) {
      const person = personData.findPersonById.data[0];
      const firstName = person.firstName || '';
      const middleName = person.middleName ? ` ${person.middleName}` : '';
      const lastName = person.lastName ? ` ${person.lastName}` : '';
      setRecipientName(`${firstName}${middleName}${lastName}`);
    }
  }, [personData]);

  if (invoiceLoading || applicationLoading || personLoading) {
    return <div>Loading invoice details...</div>;
  }

  if (invoiceError || !invoice) {
    return (
      <Alert variant="danger">
        {invoiceError?.message || 'Failed to load invoice details'}
      </Alert>
    );
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-3">
        <Button
          variant="secondary"
          className="me-3"
          onClick={() =>
            navigate(`/applications/${numericApplicationId}?tab=invoices`)
          }
          title="Back"
        >
          <FaTimes /> Back
        </Button>
        <div className="flex-grow-1">
          <div>
            <span>{numericApplicationId}</span>
            <span className="mx-2">&middot;</span>
            <span className="fw-bold">
              {applicationLoading ? 'Loading...' : appTypeDescription}
            </span>
          </div>
          <div style={{ fontSize: '1.1em' }}>View Invoice #{invoice.id}</div>
        </div>
      </div>

      <div>
        <h3 className="mb-4">Invoice Details</h3>

        <Form>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  value={invoice.subject}
                  readOnly
                  className="bg-light"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Recipient</Form.Label>
                <Form.Control
                  type="text"
                  value={recipientName || `ID: ${invoice.recipientId}`}
                  readOnly
                  className="bg-light"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup className="mb-3">
                <Form.Label>Issued Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDate(invoice.issuedDate)}
                  readOnly
                  className="bg-light"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDate(invoice.dueDate)}
                  readOnly
                  className="bg-light"
                />
              </FormGroup>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <FormGroup className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Tax Exempt"
                  checked={invoice.taxExempt}
                  readOnly
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <FormGroup>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={invoice.status}
                  readOnly
                  className="bg-light"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Form.Label>Created By</Form.Label>
                <Form.Control
                  type="text"
                  value={invoice.createdBy || 'N/A'}
                  readOnly
                  className="bg-light"
                />
              </FormGroup>
            </Col>
          </Row>

          <h5 className="mt-4">Invoice Items</h5>
          <div className="tableWidth table-border-radius">
            <table className="table table-border-light">
              <thead aria-label="Invoice Line Items Header">
                <tr className="table-header">
                  <th scope="col" className="table-header-th">
                    Item Type
                  </th>
                  <th scope="col" className="table-header-th double">
                    Description
                  </th>
                  <th scope="col" className="table-header-th custom-small">
                    Quantity
                  </th>
                  <th scope="col" className="table-header-th custom-small">
                    Unit Price
                  </th>
                  <th scope="col" className="table-header-th custom-small">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="content-text">
                {invoice.lineItems?.map((item, index: number) => (
                  <tr key={item.id}>
                    <td className="table-border-light">
                      {item.type === InvoiceLineItemType.SERVICE
                        ? 'Service'
                        : item.type === InvoiceLineItemType.EXPENSE
                          ? 'Expense'
                          : 'Timesheet'}
                    </td>
                    <td className="table-border-light">{item.description}</td>
                    <td className="table-border-light">{item.quantity}</td>
                    <td className="table-border-light">
                      ${(item.unitPriceInCents / 100).toFixed(2)}
                    </td>
                    <td className="table-border-light">
                      ${(item.totalInCents / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Row className="mt-4">
            <Col md={6}></Col>
            <Col md={6}>
              <div className="d-flex justify-content-between mb-2">
                <strong>Subtotal:</strong>
                <span>${(invoice.subtotalInCents / 100).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>GST:</strong>
                <span>${(invoice.gstInCents / 100).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>PST:</strong>
                <span>${(invoice.pstInCents / 100).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <strong>Total:</strong>
                <strong>${(invoice.totalInCents / 100).toFixed(2)}</strong>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default ViewInvoiceForm;
