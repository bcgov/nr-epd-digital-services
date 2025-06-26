import { useState, useEffect, FC, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormGroup, Form, Col, Row, Alert } from 'react-bootstrap';
import { Button } from '@cats/components/button/Button';
import { FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import { useGetHeaderDetailsByApplicationIdQuery } from '@cats/features/applications/application/ApplicationDetails.generated';
import { useGetInvoiceByIdQuery } from '../../getInvoiceById.generated';
import { useGetPersonByIdQuery } from './getPersonById.generated';
import { useUpdateInvoiceMutation } from '../../updateInvoice.generated';
import { InvoiceStatus } from '../../../../../../../../generated/types';

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

interface ViewInvoiceFormProps {}

export const ViewInvoiceForm: FC<ViewInvoiceFormProps> = (props) => {
  const { id, applicationId } = useParams<{
    id: string;
    applicationId: string;
  }>();

  const navigate = useNavigate();
  const numericInvoiceId = id ? parseInt(id, 10) : 0;
  // Initialize application ID from URL parameter but fallback to 0
  const initialAppId = applicationId ? parseInt(applicationId, 10) : 0;
  // We'll use this state to track the valid application ID
  const [numericApplicationId, setNumericApplicationId] =
    useState(initialAppId);

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
      skip: !numericApplicationId || isNaN(numericApplicationId),
    });

  const appTypeDescription =
    applicationData?.getApplicationDetailsById.data?.appType?.description || '';

  const [invoice, setInvoice] = useState<InvoiceViewModel | null>(null);
  const [editableInvoice, setEditableInvoice] =
    useState<InvoiceViewModel | null>(null);
  const [recipientName, setRecipientName] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const [updateInvoice, { loading: updateLoading }] =
    useUpdateInvoiceMutation();

  useEffect(() => {
    if (!editableInvoice) return;

    // Calculate subtotal from all line items
    const subtotal = editableInvoice.lineItems.reduce(
      (sum, item) => sum + (item.totalInCents || 0),
      0,
    );

    // Calculate taxes based on tax exempt status
    const gst = editableInvoice.taxExempt ? 0 : Math.round(subtotal * 0.05); // 5% GST
    const pst =
      editableInvoice.taxExempt || editableInvoice.pstExempt
        ? 0
        : Math.round(subtotal * 0.07); // 7% PST

    const total = subtotal + gst + pst;

    // Only update if values have changed
    if (
      editableInvoice.subtotalInCents !== subtotal ||
      editableInvoice.gstInCents !== gst ||
      editableInvoice.pstInCents !== pst ||
      editableInvoice.totalInCents !== total
    ) {
      console.log('Tax recalculation in useEffect:', {
        taxExempt: editableInvoice.taxExempt,
        pstExempt: editableInvoice.pstExempt,
        subtotal: subtotal,
        gst: gst,
        pst: pst,
        total: total,
      });

      setEditableInvoice((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subtotalInCents: subtotal,
          gstInCents: gst,
          pstInCents: pst,
          totalInCents: total,
        };
      });
    }
  }, [
    editableInvoice?.taxExempt,
    editableInvoice?.pstExempt,
    editableInvoice?.lineItems,
  ]);

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
        pstExempt: invoiceResponse.pstExempt || false, // Default to false for backward compatibility
        subtotalInCents: invoiceResponse.subtotalInCents,
        gstInCents: invoiceResponse.gstInCents,
        pstInCents: invoiceResponse.pstInCents,
        totalInCents: invoiceResponse.totalInCents,
        notes: invoiceResponse.notes || null,
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

      // Ensure we have a valid application ID
      if (mappedInvoice.applicationId && !isNaN(mappedInvoice.applicationId)) {
        setNumericApplicationId(mappedInvoice.applicationId);
      }

      setInvoice(mappedInvoice);
      setEditableInvoice(mappedInvoice);
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

  // Handle form field changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;

    setEditableInvoice((prev) => {
      if (!prev) return null;

      let updatedInvoice;

      // Handle special case for taxExempt
      if (name === 'taxExempt' && type === 'checkbox') {
        // If taxExempt is checked, also disable pstExempt
        updatedInvoice = {
          ...prev,
          taxExempt: checked,
          // Disable PST exempt when tax exempt is checked
          pstExempt: checked ? false : prev.pstExempt,
        };
      } else {
        updatedInvoice = {
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        };
      }

      return updatedInvoice;
    });
  };

  // Handle line item changes
  const handleLineItemChange = (
    id: number,
    field: keyof InvoiceLineItemViewModel,
    value: any,
  ) => {
    setEditableInvoice((prev) => {
      if (!prev) return null;

      const updatedLineItems = prev.lineItems.map((item) => {
        if (item.id === id) {
          let updatedItem = { ...item, [field]: value };

          // Recalculate total if quantity or unit price changes
          if (field === 'quantity' || field === 'unitPriceInCents') {
            updatedItem.totalInCents =
              updatedItem.quantity * updatedItem.unitPriceInCents;
          }

          return updatedItem;
        }
        return item;
      });

      return {
        ...prev,
        lineItems: updatedLineItems,
      };
    });
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Discard changes
      setEditableInvoice(invoice);
      setUpdateError(null);
    }
    setIsEditMode(!isEditMode);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!editableInvoice) return errors;

    if (!editableInvoice.subject?.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!editableInvoice.dueDate) {
      errors.dueDate = 'Due date is required';
    }

    // Check if any line items have invalid data
    editableInvoice.lineItems.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors[`lineItem-${index}-description`] =
          `Description is required for item ${index + 1}`;
      }

      if (item.quantity <= 0) {
        errors[`lineItem-${index}-quantity`] =
          `Quantity must be greater than 0 for item ${index + 1}`;
      }

      if (item.unitPriceInCents < 0) {
        errors[`lineItem-${index}-unitPrice`] =
          `Unit price cannot be negative for item ${index + 1}`;
      }
    });

    return errors;
  };

  const handleSave = async () => {
    if (!editableInvoice) return;

    // Validate form before submission
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      // Create a more descriptive error message that lists all validation errors
      const errorMessages = Object.values(errors).join(', ');
      setUpdateError(
        `Please fix the following validation errors: ${errorMessages}`,
      );
      return;
    }

    try {
      setUpdateError(null);
      setValidationErrors({});

      // Prepare data for update
      const updateData = {
        applicationId: editableInvoice.applicationId,
        recipientId: editableInvoice.recipientId,
        subject: editableInvoice.subject,
        issuedDate: editableInvoice.issuedDate,
        dueDate: editableInvoice.dueDate,
        taxExempt: editableInvoice.taxExempt,
        pstExempt: editableInvoice.pstExempt,
        status: editableInvoice.status,
        subtotalInCents: editableInvoice.subtotalInCents,
        gstInCents: editableInvoice.gstInCents,
        pstInCents: editableInvoice.pstInCents,
        totalInCents: editableInvoice.totalInCents,
        notes: editableInvoice.notes,
        lineItems: editableInvoice.lineItems.map((item) => ({
          id: item.id,
          type: item.type,
          description: item.description,
          quantity: item.quantity,
          unitPriceInCents: item.unitPriceInCents,
          totalInCents: item.totalInCents,
        })),
      };

      const result = await updateInvoice({
        variables: {
          id: numericInvoiceId,
          updateData: updateData,
        },
      });

      if (result.data?.updateInvoice?.success) {
        setInvoice(editableInvoice);
        setIsEditMode(false);
        // Reset any errors
        setValidationErrors({});
        setUpdateError(null);

        const appId = numericApplicationId || editableInvoice.applicationId;
        navigate(`/applications/${appId}?tab=invoices&refresh=true`);
      } else {
        setUpdateError(
          result.data?.updateInvoice?.message || 'Failed to update invoice',
        );
      }
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    }
  };

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-3">
        <Button
          variant="secondary"
          className="me-3"
          onClick={() => {
            // Make sure we have a valid application ID to navigate to
            const appId =
              numericApplicationId && !isNaN(numericApplicationId)
                ? numericApplicationId
                : invoice?.applicationId && !isNaN(invoice.applicationId)
                  ? invoice.applicationId
                  : '';
            navigate(`/applications/${appId}?tab=invoices`);
          }}
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
          <div style={{ fontSize: '1.1em' }}>
            {isEditMode ? 'Edit' : 'View'} Invoice #{invoice.id}
          </div>
        </div>
        <div>
          {isEditMode ? (
            <>
              <Button
                variant="primary"
                className="me-2"
                onClick={handleSave}
                disabled={updateLoading}
              >
                <FaSave /> {updateLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleEditToggle}
                disabled={updateLoading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleEditToggle}>
              <FaEdit /> Edit
            </Button>
          )}
        </div>
      </div>

      {updateError && (
        <Alert variant="danger" className="mb-3">
          {updateError}
        </Alert>
      )}

      <div>
        <h3 className="mb-4">Invoice Details</h3>

        <Form>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={
                    isEditMode ? editableInvoice?.subject : invoice.subject
                  }
                  onChange={handleInputChange}
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-light' : ''}
                  isInvalid={!!validationErrors.subject}
                />
                {validationErrors.subject && (
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.subject}
                  </Form.Control.Feedback>
                )}
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
                  name="dueDate"
                  value={formatDate(
                    isEditMode
                      ? editableInvoice?.dueDate || ''
                      : invoice.dueDate,
                  )}
                  onChange={handleInputChange}
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-light' : ''}
                  isInvalid={!!validationErrors.dueDate}
                />
                {validationErrors.dueDate && (
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.dueDate}
                  </Form.Control.Feedback>
                )}
              </FormGroup>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <FormGroup className="mb-3 me-3">
                <Form.Check
                  type="checkbox"
                  name="taxExempt"
                  label="Tax Exempt"
                  checked={
                    isEditMode ? editableInvoice?.taxExempt : invoice.taxExempt
                  }
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="pstExempt"
                  label="PST Exempt"
                  checked={
                    isEditMode ? editableInvoice?.pstExempt : invoice.pstExempt
                  }
                  onChange={handleInputChange}
                  disabled={
                    !isEditMode || (editableInvoice?.taxExempt ?? false)
                  }
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <FormGroup>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={isEditMode ? editableInvoice?.status : invoice.status}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className={!isEditMode ? 'bg-light' : ''}
                >
                  <option value={InvoiceStatus.Draft}>Draft</option>
                  <option value={InvoiceStatus.Sent}>Sent</option>
                  <option value={InvoiceStatus.Received}>Received</option>
                  <option value={InvoiceStatus.Paid}>Paid</option>
                </Form.Select>
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

          <Row className="mb-3">
            <Col md={12}>
              <FormGroup>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={
                    isEditMode
                      ? editableInvoice?.notes || ''
                      : invoice.notes || ''
                  }
                  onChange={handleInputChange}
                  readOnly={!isEditMode}
                  className={!isEditMode ? 'bg-light' : ''}
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
                </tr>
              </thead>
              <tbody className="content-text">
                {(isEditMode
                  ? editableInvoice?.lineItems
                  : invoice.lineItems
                )?.map((item, index: number) => (
                  <tr key={item.id}>
                    <td className="table-border-light">
                      {isEditMode ? (
                        <Form.Select
                          value={item.type}
                          onChange={(e) =>
                            handleLineItemChange(
                              item.id,
                              'type',
                              e.target.value,
                            )
                          }
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
                        </Form.Select>
                      ) : item.type === InvoiceLineItemType.SERVICE ? (
                        'Service'
                      ) : item.type === InvoiceLineItemType.EXPENSE ? (
                        'Expense'
                      ) : (
                        'Timesheet'
                      )}
                    </td>
                    <td className="table-border-light">
                      {isEditMode ? (
                        <>
                          <Form.Control
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                'description',
                                e.target.value,
                              )
                            }
                            isInvalid={
                              !!validationErrors[
                                `lineItem-${index}-description`
                              ]
                            }
                          />
                          {validationErrors[
                            `lineItem-${index}-description`
                          ] && (
                            <div className="text-danger small">
                              {
                                validationErrors[
                                  `lineItem-${index}-description`
                                ]
                              }
                            </div>
                          )}
                        </>
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="table-border-light">
                      {isEditMode ? (
                        <>
                          <Form.Control
                            type="number"
                            min="0"
                            step="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                'quantity',
                                Number(e.target.value),
                              )
                            }
                            isInvalid={
                              !!validationErrors[`lineItem-${index}-quantity`]
                            }
                          />
                          {validationErrors[`lineItem-${index}-quantity`] && (
                            <div className="text-danger small">
                              {validationErrors[`lineItem-${index}-quantity`]}
                            </div>
                          )}
                        </>
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="table-border-light">
                      {isEditMode ? (
                        <>
                          <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            value={(item.unitPriceInCents / 100).toFixed(2)}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                'unitPriceInCents',
                                Math.round(Number(e.target.value) * 100),
                              )
                            }
                            isInvalid={
                              !!validationErrors[`lineItem-${index}-unitPrice`]
                            }
                          />
                          {validationErrors[`lineItem-${index}-unitPrice`] && (
                            <div className="text-danger small">
                              {validationErrors[`lineItem-${index}-unitPrice`]}
                            </div>
                          )}
                        </>
                      ) : (
                        `$${(item.unitPriceInCents / 100).toFixed(2)}`
                      )}
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
                <span>
                  $
                  {(
                    (isEditMode && editableInvoice
                      ? editableInvoice.subtotalInCents
                      : invoice.subtotalInCents) / 100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>GST:</strong>
                <span>
                  $
                  {(
                    (isEditMode && editableInvoice
                      ? editableInvoice.gstInCents
                      : invoice.gstInCents) / 100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <strong>PST:</strong>
                <span>
                  $
                  {(
                    (isEditMode && editableInvoice
                      ? editableInvoice.pstInCents
                      : invoice.pstInCents) / 100
                  ).toFixed(2)}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <strong>Total:</strong>
                <strong>
                  $
                  {(
                    (isEditMode && editableInvoice
                      ? editableInvoice.totalInCents
                      : invoice.totalInCents) / 100
                  ).toFixed(2)}
                </strong>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default ViewInvoiceForm;
