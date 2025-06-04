import { useState, FormEvent, useEffect, ChangeEvent, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormGroup, Form, Col, Row, Alert } from 'react-bootstrap';
import { useCreateInvoiceMutation } from '../../createInvoice.generated';
import { InvoiceStatus } from '../../../../../../../../generated/types';
import { FaTimes } from 'react-icons/fa';
import { Button } from '@cats/components/button/Button';
import { FloppyDisk } from '@cats/components/common/icon';
import { useGetHeaderDetailsByApplicationIdQuery } from '@cats/features/applications/application/ApplicationDetails.generated';
import { useGetParticipantNamesLazyQuery } from '@cats/features/applications/application/applicationTabs/appParticipants/graphql/Participants.generated';

enum InvoiceLineItemType {
  SERVICE = 'service',
  EXPENSE = 'expense',
  TIMESHEET = 'timesheet',
}

interface CreateInvoiceFormProps {
  onSuccess?: () => void;
}

export const CreateInvoiceForm: FC<CreateInvoiceFormProps> = ({
  onSuccess,
}) => {
  const { id } = useParams<{ id: string }>();
  const applicationId = id ? parseInt(id) : 0;
  const navigate = useNavigate();

  // Fetch application details including application type
  const { data: applicationData, loading: applicationLoading } =
    useGetHeaderDetailsByApplicationIdQuery({
      variables: { applicationId },
      skip: !applicationId,
    });

  const appTypeDescription =
    applicationData?.getApplicationDetailsById.data?.appType?.description || '';

  // Participant names query for recipient dropdown
  const [recipientSearch, setRecipientSearch] = useState('');
  const [recipients, setRecipients] = useState<
    { key: string; value: string }[]
  >([]);
  const [getParticipantNames, { loading: loadingParticipants }] =
    useGetParticipantNamesLazyQuery({
      onCompleted: (data) => {
        if (data.getParticipantNames.data) {
          setRecipients(data.getParticipantNames.data);
        }
      },
      onError: (error) => {
        console.error('Error fetching recipients:', error);
      },
    });

  // Fetch recipients when search changes
  useEffect(() => {
    if (recipientSearch && recipientSearch.length >= 2) {
      getParticipantNames({ variables: { searchParam: recipientSearch } });
    }
  }, [recipientSearch, getParticipantNames]);

  const [formValues, setFormValues] = useState({
    subject: '',
    recipientId: '',
    issuedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 30 days from now
    status: InvoiceStatus.Draft,
    taxExempt: false,
    subtotalInCents: 0,
    gstInCents: 0,
    pstInCents: 0,
    totalInCents: 0,
    lineItems: [
      {
        description: '',
        quantity: 1,
        unitPriceInCents: 0, // Will display as empty in the UI
        totalInCents: 0,
        type: InvoiceLineItemType.SERVICE,
      },
    ],
  });

  const [error, setError] = useState<string | null>(null);
  const [createInvoice, { loading }] = useCreateInvoiceMutation({
    onCompleted: (data) => {
      if (data.createInvoice.success) {
        if (onSuccess) {
          onSuccess();
        }
        navigate(`/applications/${applicationId}?tab=invoices`);
      } else {
        setError(data.createInvoice.message || 'Failed to create invoice');
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // If tax exempt checkbox is changed, recalculate totals immediately
    if (name === 'taxExempt') {
      calculateTotals();
    }
  };

  const handleBlur = () => {
    // Recalculate totals when input loses focus
    calculateTotals();
  };

  const handleLineItemChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => {
      const updatedLineItems = [...prev.lineItems];

      if (name === 'unitPriceInCents') {
        // Handle empty value case
        const priceInCents =
          value === '' ? 0 : Math.round(parseFloat(value) * 100);
        const quantity = updatedLineItems[index].quantity;
        const totalInCents = priceInCents * quantity;

        updatedLineItems[index] = {
          ...updatedLineItems[index],
          unitPriceInCents: priceInCents,
          totalInCents: totalInCents,
        };
      } else if (name === 'quantity') {
        const quantity = value === '' ? 1 : parseInt(value);
        const totalInCents =
          updatedLineItems[index].unitPriceInCents * quantity;

        updatedLineItems[index] = {
          ...updatedLineItems[index],
          quantity: quantity,
          totalInCents: totalInCents,
        };
      } else {
        updatedLineItems[index] = {
          ...updatedLineItems[index],
          [name]: value,
        };
      }

      return {
        ...prev,
        lineItems: updatedLineItems,
      };
    });
  };

  const addLineItem = () => {
    setFormValues((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          description: '',
          quantity: 1,
          unitPriceInCents: 0, // Keep as 0 in data model, but display as empty
          totalInCents: 0,
          type: InvoiceLineItemType.SERVICE,
        },
      ],
    }));

    // Calculate totals after adding a line item
    setTimeout(calculateTotals, 0);
  };

  const removeLineItem = (index: number) => {
    if (formValues.lineItems.length === 1) return;

    setFormValues((prev) => {
      const updatedLineItems = [...prev.lineItems];
      updatedLineItems.splice(index, 1);

      return {
        ...prev,
        lineItems: updatedLineItems,
      };
    });

    // Calculate totals after removing a line item
    setTimeout(calculateTotals, 0);
  };

  const calculateTotals = () => {
    const subtotalInCents = formValues.lineItems.reduce(
      (sum, item) => sum + (item.totalInCents || 0),
      0,
    );

    const gstInCents = formValues.taxExempt
      ? 0
      : Math.round(subtotalInCents * 0.05);
    const pstInCents = formValues.taxExempt
      ? 0
      : Math.round(subtotalInCents * 0.07);
    const totalInCents = subtotalInCents + gstInCents + pstInCents;

    setFormValues((prev) => ({
      ...prev,
      subtotalInCents,
      gstInCents,
      pstInCents,
      totalInCents,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    calculateTotals();

    const invoiceData = {
      applicationId,
      recipientId: parseInt(formValues.recipientId),
      subject: formValues.subject,
      issuedDate: new Date(formValues.issuedDate),
      dueDate: new Date(formValues.dueDate),
      status: formValues.status,
      taxExempt: formValues.taxExempt,
      subtotalInCents: formValues.subtotalInCents,
      gstInCents: formValues.gstInCents,
      pstInCents: formValues.pstInCents,
      totalInCents: formValues.totalInCents,
      lineItems: formValues.lineItems,
    };

    createInvoice({
      variables: {
        invoiceData,
      },
    });
  };

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-3">
        <Button
          variant="secondary"
          className="me-3"
          onClick={() =>
            navigate(`/applications/${applicationId}?tab=invoices`)
          }
          title="Cancel"
        >
          <FaTimes /> Cancel
        </Button>
        <div className="flex-grow-1">
          <div>
            <span>{applicationId}</span>
            <span className="mx-2">&middot;</span>
            <span className="fw-bold">
              {applicationLoading ? 'Loading...' : appTypeDescription}
            </span>
          </div>
          <div style={{ fontSize: '1.1em' }}>New Invoice</div>
        </div>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          <FloppyDisk />
          {loading ? 'Saving...' : 'Save Invoice'}
        </Button>
      </div>
      <div>
        <h3 className="mb-4">Invoice Details</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formValues.subject}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Recipient</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    name="recipientSearch"
                    placeholder="Search recipients..."
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    value={recipientSearch}
                  />
                  {loadingParticipants && (
                    <div className="text-muted small mt-1">Loading...</div>
                  )}
                  {recipients.length > 0 && (
                    <div
                      className="position-absolute w-100 border rounded bg-light mt-1 z-1000"
                      style={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                      }}
                    >
                      {recipients.map((recipient) => (
                        <div
                          key={recipient.key}
                          className="p-2 border-bottom cursor-pointer hover-bg-light"
                          onClick={() => {
                            setFormValues({
                              ...formValues,
                              recipientId: recipient.key,
                            });
                            setRecipientSearch(recipient.value);
                          }}
                        >
                          {recipient.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formValues.recipientId && (
                  <input
                    type="hidden"
                    name="recipientId"
                    value={formValues.recipientId}
                    required
                  />
                )}
                {!formValues.recipientId && (
                  <div className="text-danger small">Recipient is required</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup className="mb-3">
                <Form.Label>Issued Date</Form.Label>
                <Form.Control
                  type="date"
                  name="issuedDate"
                  value={formValues.issuedDate}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={formValues.dueDate}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <FormGroup className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="taxExempt"
                  label="Tax Exempt"
                  checked={formValues.taxExempt}
                  onChange={handleChange}
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
                  <th scope="col" className="table-header-th custom-small">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="content-text">
                {formValues.lineItems.map((item, index) => (
                  <tr key={index}>
                    <td className="table-border-light">
                      <Form.Control
                        as="select"
                        name="type"
                        value={item.type}
                        onChange={(e) => handleLineItemChange(index, e)}
                        required
                        className="custom-select"
                      >
                        <option value={InvoiceLineItemType.SERVICE}>
                          Service
                        </option>
                        <option value={InvoiceLineItemType.EXPENSE}>
                          Expense
                        </option>
                        <option value={InvoiceLineItemType.TIMESHEET}>
                          Timesheet
                        </option>
                      </Form.Control>
                    </td>
                    <td className="table-border-light">
                      <Form.Control
                        type="text"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, e)}
                        required
                        className="custom-input"
                      />
                    </td>
                    <td className="table-border-light">
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(index, e)}
                        onBlur={handleBlur}
                        min="1"
                        required
                        className="custom-input"
                      />
                    </td>
                    <td className="table-border-light">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">$</span>
                        </div>
                        <Form.Control
                          type="number"
                          name="unitPriceInCents"
                          value={
                            item.unitPriceInCents > 0
                              ? (item.unitPriceInCents / 100).toFixed(2)
                              : ''
                          }
                          onChange={(e) => handleLineItemChange(index, e)}
                          onBlur={handleBlur}
                          step="0.01"
                          min="0"
                          required
                          placeholder="0.00"
                          className="custom-input"
                        />
                      </div>
                    </td>
                    <td className="table-border-light">
                      ${(item.totalInCents / 100).toFixed(2)}
                    </td>
                    <td className="table-border-light">
                      <Button
                        variant="tertiary"
                        size="small"
                        onClick={() => removeLineItem(index)}
                        disabled={formValues.lineItems.length === 1}
                        title="Remove item"
                      >
                        <FaTimes /> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-3">
            <Button variant="secondary" onClick={addLineItem}>
              + Add Line Item
            </Button>
          </div>

          <Row className="mt-4">
            <Col md={6}></Col>
            <Col md={6}>
              <div className="d-flex justify-content-between mb-2">
                <strong>Subtotal:</strong>
                <span>${(formValues.subtotalInCents / 100).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>GST:</strong>
                <span>${(formValues.gstInCents / 100).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>PST:</strong>
                <span>${(formValues.pstInCents / 100).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <strong>Total:</strong>
                <strong>${(formValues.totalInCents / 100).toFixed(2)}</strong>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default CreateInvoiceForm;
