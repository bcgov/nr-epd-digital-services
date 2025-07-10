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
    } else {
      setRecipients([]); // Clear dropdown when search is too short. This prevents showing stale results.
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
    pstExempt: false,
    subtotalInCents: 0,
    gstInCents: 0,
    pstInCents: 0,
    totalInCents: 0,
    notes: '',
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

  // Track which line item unit price fields are currently being edited
  const [editingPriceFields, setEditingPriceFields] = useState<{
    [key: number]: string;
  }>({});

  const [error, setError] = useState<string | null>(null);
  const [createInvoice, { loading }] = useCreateInvoiceMutation({
    onCompleted: (data) => {
      if (data.createInvoice.success) {
        if (onSuccess) {
          onSuccess();
        }
        navigate(`/applications/${applicationId}?tab=invoices&refresh=true`);
      } else {
        setError(data.createInvoice.message || 'Failed to create invoice');
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // This useEffect is responsible for calculating and updating all tax-related values
  // whenever taxExempt, pstExempt, or lineItems change
  useEffect(() => {
    const subtotalInCents = formValues.lineItems.reduce(
      (sum, item) => sum + (item.totalInCents || 0),
      0,
    );

    // Calculate taxes based on tax exempt checkboxes
    const gstInCents = formValues.taxExempt
      ? 0
      : Math.round(subtotalInCents * 0.05);

    const pstInCents =
      formValues.taxExempt || formValues.pstExempt
        ? 0
        : Math.round(subtotalInCents * 0.07);

    const totalInCents = subtotalInCents + gstInCents + pstInCents;

    // Only update if values have changed
    if (
      formValues.subtotalInCents !== subtotalInCents ||
      formValues.gstInCents !== gstInCents ||
      formValues.pstInCents !== pstInCents ||
      formValues.totalInCents !== totalInCents
    ) {
      setFormValues((prev) => ({
        ...prev,
        subtotalInCents,
        gstInCents,
        pstInCents,
        totalInCents,
      }));
    }
  }, [formValues.taxExempt, formValues.pstExempt, formValues.lineItems]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;

    // Special case for taxExempt to ensure pstExempt is handled appropriately
    if (name === 'taxExempt' && isCheckbox) {
      // If tax exempt is toggled
      setFormValues((prev) => ({
        ...prev,
        taxExempt: checked,
        // If tax exempt is checked, disable PST exempt
        pstExempt: checked ? false : prev.pstExempt,
      }));
    } else {
      // For all other fields including pstExempt, simple update
      setFormValues((prev) => ({
        ...prev,
        [name]: isCheckbox ? checked : value,
      }));
    }
  };

  const handleLineItemChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => {
      const updatedLineItems = [...prev.lineItems];

      if (name === 'unitPriceInCents') {
        // Store the raw input value for editing - don't update the actual price yet
        setEditingPriceFields((prevEditing) => ({
          ...prevEditing,
          [index]: value,
        }));

        // Don't update the actual price while user is typing
        // This will be handled in handlePriceBlur
        return prev;
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

      // Update line items only - tax calculations happen in useEffect
      return {
        ...prev,
        lineItems: updatedLineItems,
      };
    });
  };

  const handlePriceBlur = (index: number) => {
    const rawValue = editingPriceFields[index];

    if (rawValue !== undefined) {
      // Parse the value and update the actual price
      if (rawValue !== '' && !isNaN(parseFloat(rawValue))) {
        const priceInCents = Math.round(parseFloat(rawValue) * 100);
        const quantity = formValues.lineItems[index].quantity;
        const totalInCents = priceInCents * quantity;

        setFormValues((prev) => {
          const updatedLineItems = [...prev.lineItems];
          updatedLineItems[index] = {
            ...updatedLineItems[index],
            unitPriceInCents: priceInCents,
            totalInCents: totalInCents,
          };
          return {
            ...prev,
            lineItems: updatedLineItems,
          };
        });
      } else if (rawValue === '') {
        // Handle empty value case
        setFormValues((prev) => {
          const updatedLineItems = [...prev.lineItems];
          updatedLineItems[index] = {
            ...updatedLineItems[index],
            unitPriceInCents: 0,
            totalInCents: 0,
          };
          return {
            ...prev,
            lineItems: updatedLineItems,
          };
        });
      }
    }

    // Clear the editing state when user finishes editing
    setEditingPriceFields((prevEditing) => {
      const newEditing = { ...prevEditing };
      delete newEditing[index];
      return newEditing;
    });
  };

  const handlePriceFocus = (index: number) => {
    // When focusing on the price field, set the raw value for editing
    const currentPriceInCents = formValues.lineItems[index].unitPriceInCents;
    const displayValue =
      currentPriceInCents > 0 ? (currentPriceInCents / 100).toString() : '';

    setEditingPriceFields((prevEditing) => ({
      ...prevEditing,
      [index]: displayValue,
    }));
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

    // Clean up editing state for removed item
    setEditingPriceFields((prevEditing) => {
      const newEditing = { ...prevEditing };
      delete newEditing[index];

      // Shift down the indices for items after the removed one
      const adjustedEditing: { [key: number]: string } = {};
      Object.keys(newEditing).forEach((key) => {
        const keyIndex = parseInt(key);
        if (keyIndex > index) {
          adjustedEditing[keyIndex - 1] = newEditing[keyIndex];
        } else {
          adjustedEditing[keyIndex] = newEditing[keyIndex];
        }
      });

      return adjustedEditing;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate recipient is selected
    if (!formValues.recipientId || isNaN(parseInt(formValues.recipientId))) {
      setError('Please select a valid recipient before saving');
      return;
    }

    // Convert recipientId to number explicitly
    const recipientId = Number(formValues.recipientId);

    const invoiceData = {
      applicationId,
      recipientId,
      subject: formValues.subject,
      issuedDate: new Date(formValues.issuedDate),
      dueDate: new Date(formValues.dueDate),
      status: formValues.status,
      taxExempt: formValues.taxExempt,
      pstExempt: formValues.pstExempt,
      subtotalInCents: formValues.subtotalInCents,
      gstInCents: formValues.gstInCents,
      pstInCents: formValues.pstInCents,
      totalInCents: formValues.totalInCents,
      notes: formValues.notes,
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
                            // Ensure recipientId is set as a valid string that can be parsed as int
                            const numericId = parseInt(recipient.key);
                            if (!isNaN(numericId)) {
                              setFormValues((prev) => ({
                                ...prev,
                                recipientId: recipient.key,
                              }));
                              // Update the search field with the selected name
                              setRecipientSearch(recipient.value);
                              // Clear recipients array to hide dropdown
                              setRecipients([]);
                            }
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
              <FormGroup className="mb-3 me-3">
                <Form.Check
                  type="checkbox"
                  name="taxExempt"
                  label="Tax Exempt"
                  checked={formValues.taxExempt}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="pstExempt"
                  label="PST Exempt"
                  checked={formValues.pstExempt}
                  disabled={formValues.taxExempt}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={formValues.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter any additional notes for this invoice"
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
                          type="text"
                          name="unitPriceInCents"
                          value={
                            editingPriceFields[index] !== undefined
                              ? editingPriceFields[index]
                              : item.unitPriceInCents > 0
                                ? (item.unitPriceInCents / 100).toFixed(2)
                                : ''
                          }
                          onChange={(e) => handleLineItemChange(index, e)}
                          onFocus={() => handlePriceFocus(index)}
                          onBlur={() => handlePriceBlur(index)}
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
