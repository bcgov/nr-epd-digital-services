import React, { useEffect, useState } from 'react';
import ViewInvoiceForm from '../components/view/ViewInvoiceForm';
import NavigationBar from '@cats/components/navigation-bar/NavigationBar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserMode } from '@cats/helpers/requests/userMode';
import Actions from '@cats/components/action/Actions';
import { SaveButton } from '@cats/components/simple/CustomButtons';
import { InvoiceActions } from '../components/invoice-enums/invoiceActions';
import PageContainer from '@cats/components/simple/PageContainer';
import { useGetHeaderDetailsByApplicationIdQuery } from '@cats/features/applications/application/ApplicationDetails.generated';
import { FaTimes } from 'react-icons/fa';
import { Button } from '@cats/components/button/Button';
import { FilePdfIcon, PaperPlaneIcon, Plus, SpinnerIcon } from '@cats/components/common/icon';
import { DropdownDto, InvoiceDto, InvoiceInputDto, InvoiceLineItemInputDto, InvoiceStatus, ViewApplicationDetails } from '../../../../../../../generated/types';
import './Invoice.css';
import Widget from '@cats/components/widget/Widget';
import Form from '@cats/components/form/Form';
import { GetInvoiceConfig } from './InvoiceConfig';
import { RequestStatus } from '@cats/helpers/requests/status';
import { InvoiceItemTypes } from '../components/invoice-enums/invoiceItemTypes';
import { useGetParticipantNamesQuery } from '../../appParticipants/graphql/Participants.generated';
import { v4 } from 'uuid';
import { validateForm } from '@cats/helpers/utility';
import { IFormField } from '@cats/components/input-controls/IFormField';
import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import LoadingOverlay from '@cats/components/loader/LoadingOverlay';
import DOMPurify from 'dompurify';
import InvoicePreviewTemplate from './InvoicePreviewTemplate';
import { useCreateInvoiceMutation, useGetInvoiceByIdQuery, useUpdateInvoiceMutation } from '../graphql/Invoice.generated';


const initialInvoice: any = {
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
        quantity: '1',
        unitPriceInCents: '0', // Will display as empty in the UI
        totalInCents: '',
        type: InvoiceItemTypes.SERVICE,
      },
    ],
    recipient: {
      id: 0,
      fullName: '',
    }
  }
const Invoice: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const fromScreen = location.state?.from || ''; // Default to "Unknown Screen" if no state is passed
  const { id, applicationId } = useParams<{
    id?: string;
    applicationId: string;
  }>();

  const numericInvoiceId = id ? parseInt(id, 10) : 0;
  const numericAppId = applicationId ? parseInt(applicationId, 10) : 0;

  // Fetch application details for the header
  const { data: applicationData } = useGetHeaderDetailsByApplicationIdQuery(
    {
      fetchPolicy: 'cache-and-network',
      variables: { applicationId: numericAppId },
      skip: !numericAppId || isNaN(numericAppId),
    }
  );
  
  // Fetch invoice details
  const { data: invoiceData, refetch } = useGetInvoiceByIdQuery(
    {
      fetchPolicy: 'cache-and-network',
      variables: { id: numericInvoiceId },
      skip: !numericInvoiceId,
    }
  );

  const [updateInvoice] = useUpdateInvoiceMutation();
  const [createInvoice] = useCreateInvoiceMutation();

  // State to store invoice and application details
  const [invoiceDetails, setInvoiceDetails] = useState(invoiceData?.getInvoiceById?.invoice || initialInvoice);
  const [applicationDetails, setApplicationDetails] = useState<ViewApplicationDetails | null | undefined>(applicationData?.getApplicationDetailsById?.data as ViewApplicationDetails);
  
  const [isVisible, setIsVisible] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(RequestStatus.idle);
  const [viewMode, setViewMode] = useState(UserMode.Default);
  const [taxExempt, setTaxExempt] = useState(false);
  const [searchParam, setSearchParam] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [hasErrors, setHasErrors] = useState(false);

  const { data: recipients, loading } = useGetParticipantNamesQuery({
    fetchPolicy: 'network-only',
    variables: { searchParam },
    skip: !searchParam.trim(),
  });
 
  const handleScroll = () => {
    const shouldBeVisible = window.scrollY > 5;
    if (shouldBeVisible !== isVisible) {
      setIsVisible(shouldBeVisible);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  const transformInvoiceDetails = () => {
    if (invoiceData?.getInvoiceById?.invoice) {
        setInvoiceDetails((prev: any) => ({
          ...prev,
          ...invoiceData.getInvoiceById.invoice,
          recipientId: invoiceData?.getInvoiceById?.invoice?.recipientId.toString(),
          lineItems: invoiceData?.getInvoiceById?.invoice?.lineItems?.map((item: any) => (
            { 
              ...item, 
              quantity: item.quantity.toString(),
              unitPriceInCents: ((item.unitPriceInCents ?? 0) / 100).toFixed(2), 
              totalInCents: ((item.totalInCents ?? 0) / 100).toFixed(2)
            })),
          recipient: {
            ...invoiceData?.getInvoiceById?.invoice?.recipient,
            id: invoiceData?.getInvoiceById?.invoice?.recipient?.id.toString(),
          }
        }));
      }
  }

  useEffect(() => {
    if (applicationData?.getApplicationDetailsById?.data) {
      setApplicationDetails(applicationData.getApplicationDetailsById.data as ViewApplicationDetails);
    }
    if(!!id) {
      if (invoiceData?.getInvoiceById?.invoice) {
        transformInvoiceDetails();  
        setRequestStatus(RequestStatus.success);
      }
      else
      {
        setRequestStatus(RequestStatus.loading);
      } 
    }
    else {
      setViewMode(UserMode.EditMode);
    }
 
  }, [applicationData, invoiceData]);


  const handleItemClick = async (action: string) => {
    switch (action) {
      case InvoiceActions.EDIT_INVOICE:
        setViewMode(UserMode.EditMode);
        break;
        
      case InvoiceActions.SAVE_INVOICE:
        const errors = await validateInvoice();
        if (errors?.length > 0) {
          setErrors(errors);
          setHasErrors(true);
          setViewMode(UserMode.EditMode);
          return;
        }
        else {
          setErrors([]);
          setHasErrors(false);
         
          const updatedInvoiceDetails: InvoiceInputDto = {
            applicationId: invoiceDetails?.applicationId,
            recipientId: Number(invoiceDetails?.recipientId),
            dueDate: invoiceDetails?.dueDate,
            issuedDate: invoiceDetails?.issuedDate,
            subject: invoiceDetails?.subject,
            status: invoiceDetails?.status,
            taxExempt: invoiceDetails?.taxExempt,
            pstExempt: invoiceDetails?.pstExempt,
            subtotalInCents:invoiceDetails?.subtotalInCents,
            gstInCents: invoiceDetails?.gstInCents,
            pstInCents: invoiceDetails?.pstInCents,
            totalInCents: invoiceDetails?.totalInCents, 
            notes: invoiceDetails?.notes,
            lineItems: invoiceDetails?.lineItems?.map((item: any) => ({
            id: item.id,
            description: item.description,
            type: item.type, 
            quantity: Number(item.quantity),
            unitPriceInCents: Number(item.unitPriceInCents) * 100, 
            totalInCents: Number(item.totalInCents) * 100
          })) as InvoiceLineItemInputDto[]}

          if(!!id) {
            updateInvoice({ 
              variables: { 
                id: numericInvoiceId, 
                updateData: updatedInvoiceDetails 
              } 
            })
            .then((response) => {
              if(response?.data?.updateInvoice?.success) {
                setViewMode(UserMode.Default);  
                refetch(); 
              }
            })
          }
          else {
            await createInvoice({ 
              variables: { 
                invoiceData: {...updatedInvoiceDetails, applicationId: numericAppId} 
              } 
            })
            .then((response) => {
              if(response?.data?.createInvoice?.success) {
                setViewMode(UserMode.Default);   
                navigate(`/applications/${applicationId}?tab=invoices`);
              }
            })
          }
        }
        break;

      case InvoiceActions.CANCEL_INVOICE:
        if(!!id)
        {
          setViewMode(UserMode.Default);
          transformInvoiceDetails();
        }
        else
        {
          navigate(`/applications/${applicationId}?tab=invoices`);
        }
        break;

      case InvoiceActions.ADD_INVOICE_ITEM:
        if (invoiceDetails) {
          setInvoiceDetails((prev: any) => ({
            ...prev,
            lineItems: [
              ...prev.lineItems,
              {
                id: v4(),
                description: '',
                quantity: '1',
                unitPriceInCents: '0', // Keep as 0 in data model, but display as empty
                totalInCents: '',
                type: InvoiceItemTypes.SERVICE,
              },
            ],
          }));
        }
      break;

      case InvoiceActions.MARK_AS_SENT:
        break;
      case InvoiceActions.DUPLICATE_INVOICE:
        break;
      case InvoiceActions.DELETE_INVOICE:
        break;
      case InvoiceActions.RECORD_INVOICE_PAYMENT:
        break;
      case InvoiceActions.SEND_INVOICE:
        break;

      case InvoiceActions.PREVIEW_INVOICE_PDF:
        if (!invoiceDetails) return;

        // Create a new window for printing
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) return;
   
        const sanitizedContent = DOMPurify.sanitize(InvoicePreviewTemplate(invoiceDetails, applicationDetails));
        printWindow.document.write(sanitizedContent);
        printWindow.document.close();
    
        // Trigger print dialog
        printWindow.focus();
        printWindow.print();
        break;
      default:
        break;
    }
  }

  const calculateInvoice = (invoiceDetails: any) => {
    const safeParse = (val: any): number => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };
    // Recalculate line item totals
    const updatedLineItems = invoiceDetails.lineItems.map((item: any) => {
      const quantity = safeParse(item.quantity);
      const unitPrice = safeParse(item.unitPriceInCents);
      const total = quantity * unitPrice;

      return {
        ...item,
        quantity: item.quantity, // Preserve raw input
        unitPriceInCents: item.unitPriceInCents, // Preserve raw input
        totalInCents: total === 0 ? '' : total.toFixed(2), // Only format calculated total
      };
    });

    // Calculate the subtotal of all line items
    const subtotal = updatedLineItems.reduce((sum: number, item: any) => {
      return sum + safeParse(item.totalInCents);
    }, 0);

    // Calculate taxes based on exemptions
    const gst = invoiceDetails.taxExempt ? 0 : subtotal * 0.05;
    const pst = invoiceDetails.taxExempt || invoiceDetails.pstExempt ? 0 : subtotal * 0.07;
    const total = subtotal + gst + pst;

    // Return the updated invoice details with new totals
    return {
      ...invoiceDetails,
      lineItems: updatedLineItems,
      subtotalInCents: (subtotal * 100), // still string, to match your usage
      gstInCents: (gst * 100),
      pstInCents: (pst * 100),
      totalInCents: (total * 100),
    };
  }

  const handleInputChange = (
    graphQLPropertyName: any,
    value: string | number | boolean | [Date, Date] | DropdownDto
  ) => {
    setInvoiceDetails((prev: any) => {
      if (!prev) return prev;

      const next = { ...prev };

      // Handle recipientId with object value
      if (
        graphQLPropertyName === 'recipientId' &&
        typeof value === 'object' &&
        value !== null &&
        'key' in value
      ) {
        next.recipientId = value.key;
        next.recipient = {
          ...prev.recipient,
          id: value.key,
          fullName: value.value,
        };
        return next;
      }

      // Directly update the property
      next[graphQLPropertyName] = value;

      // Trigger recalculation invoice only for fields that affect totals
      const shouldReCalculateInvoice= ['taxExempt', 'pstExempt'].includes(graphQLPropertyName);

      if (graphQLPropertyName === 'taxExempt') {
        setTaxExempt(Boolean(value));
        next.pstExempt = Boolean(value); // Also update pstExempt automatically
      }

      return shouldReCalculateInvoice ? calculateInvoice(next) : next;
    });
  };

  const invoiceItemChangeHandler = (event: any) => {
    const { row, property, value } = event;
    let lineItems: any;
    if(event.property.includes('remove'))
    {
      lineItems = invoiceDetails?.lineItems?.filter((item: any) => item.id !== row.id);
    }
    else
    {
      lineItems = invoiceDetails?.lineItems?.map((item: any) => 
        item.id === row.id 
        ? 
          property === 'quantity' || property === 'unitPriceInCents' ? 
          {
            ...item, 
            [property]: value, 
          }
          :
          { 
            ...item, 
            [property]: value 
          } 
        : 
        item
      );
    }
    setInvoiceDetails((prev: any) => {
      if (!prev) return prev;
      return calculateInvoice({ ...prev, lineItems });
    });
  }

  const { 
    applicationDetailsForm, 
    invoiceDetailsForm, 
    invoiceItemsTableConfigs, 
    invoiceAttachmentsTableConfigs 
  } = GetInvoiceConfig(viewMode, taxExempt,
      handleInputChange,
      invoiceDetails,
      !id,
      {
        setSearchParam: setSearchParam, 
        options:invoiceDetails?.recipient
            ? [{
                key: invoiceDetails?.recipient?.id?.toString(),
                value: invoiceDetails?.recipient?.fullName
              }]
            : [],
        filteredOptions: recipients?.getParticipantNames?.data ?? [],
        loading: loading,
      }
  );
  
  const validateInvoice = async () => {
    try {
      const [invoiceDetailsError, invoiceItemsError] = await Promise.all([validateInvoiceDetails(), validateInvoiceItems()]);
      return [...invoiceDetailsError, ...invoiceItemsError];
    } 
    catch (error: any) 
    {
      return error.message;
    }
  }

  const validateInvoiceDetails = () => {
    try {
      return validateForm(
        invoiceDetailsForm,
        invoiceDetails,
        '',
      )
    } 
    catch (error: any) 
    {
      return error.message;
    }
  }

  const validateInvoiceItems = () => {
    try {
      const invoiceLineItems: IFormField[][] = [
        invoiceItemsTableConfigs.map((column) => column.displayType)
          .filter(
            (displayType): displayType is IFormField =>
              displayType !== undefined,
          ),
      ];

      const invoiceItemsError: any[] = [];
      invoiceDetails?.lineItems?.length <= 0 ?
        invoiceItemsError.push({errorMessage: 'At least one invoice item is required'}) :
        invoiceDetails?.lineItems?.map((item: any) =>{
            const validateInvoiceItem = validateForm(invoiceLineItems, item, '');
            invoiceItemsError.push(...validateInvoiceItem);
          }
        );
      return invoiceItemsError;
    } 
    catch (error: any) 
    {
      return error.message;
    }
  }

  const navigationBarChildern = (
    <>
      {viewMode === UserMode.Default && (
        <Actions
          label="Actions"
          items={[
            {
              label: InvoiceActions.EDIT_INVOICE,
              value: InvoiceActions.EDIT_INVOICE,
            },
            {
              label: InvoiceActions.MARK_AS_SENT,
              value: InvoiceActions.MARK_AS_SENT,
            },
            {
              label: InvoiceActions.DUPLICATE_INVOICE,
              value: InvoiceActions.DUPLICATE_INVOICE,
            },
            {
              label: InvoiceActions.DELETE_INVOICE,
              value: InvoiceActions.DELETE_INVOICE,
            },
          ]}
          onItemClick={handleItemClick}
        />
      )}
      <div className="gap-3 align-items-center d-none d-md-flex d-lg-flex d-xl-flex">
        {viewMode === UserMode.EditMode && (
          <>
            <SaveButton clickHandler={() => handleItemClick(InvoiceActions.SAVE_INVOICE)} label={InvoiceActions.SAVE_INVOICE} />
          </>
        )}
      </div>
      {viewMode === UserMode.EditMode && (
        <div className="d-flex d-md-none d-lg-none d-xl-none">
          <Actions
            label="Actions"
            items={[
              {
                label: InvoiceActions.SAVE_INVOICE,
                value: InvoiceActions.SAVE_INVOICE,
              },
              {
                label: InvoiceActions.CANCEL_INVOICE,
                value: InvoiceActions.CANCEL_INVOICE,
              },
            ]}
            onItemClick={handleItemClick}
          />
        </div>
      )}
    </>
  );

  const hasValidAppData = !!applicationData?.getApplicationDetailsById?.data;
  const hasValidInvoiceData = !!invoiceData?.getInvoiceById?.invoice;
  const { appType, id: appId,  } = applicationDetails || {};
  const { subject: invoiceSubject } = invoiceData?.getInvoiceById?.invoice || {};
  const navigationBarText =
    (appId || appType?.description) && (
      <div className="d-flex flex-column gap-1">
        {(appId || appType?.description) && (
          <div>
            <span className={'invoice_id_lbl invoice_lbl'}>
              {appId}
            </span>
            <span className={'custom_dot px-2'}>•</span>
            <span className={'invoice_type_lbl invoice_lbl'}>
              {appType?.description}
            </span>
          </div>
        )}
        {
          invoiceSubject && !!id ? (
            <div>
              <span className={'invoice_subject_lbl invoice_lbl'}>
                {invoiceSubject}
              </span>
            </div>
          )
          :
          <div>
              <span className={'invoice_subject_lbl invoice_lbl'}>
                {'New Invoice'}
              </span>
          </div>
        }
      </div>
    ) 
  
  if((!hasValidAppData || !hasValidInvoiceData) && !!id?.trim())
  {
    return <LoadingOverlay loading={!hasValidAppData || !hasValidInvoiceData} />
  }

  return (
    <div className='invoice_detail_conatiner'>
      <NavigationBar
        isVisible={isVisible}
        onClickBackButton={ viewMode === UserMode.EditMode ?
                            () => handleItemClick(InvoiceActions.CANCEL_INVOICE) 
                            : 
                            () => navigate(-1)
                          } 
        backButtonProps={{ variant: 'secondary' }}
        buttonIcon={ viewMode === UserMode.EditMode && <FaTimes /> }
        backButtonText={`${viewMode === UserMode.EditMode ? 'Cancel' : `Back to ${fromScreen}`}`}
        navigationBarText={navigationBarText}
        childern={navigationBarChildern}
      />
      <PageContainer customContainerClass={'invoice_page_container'} role="invoice">
        { !!id &&
          <div className='d-flex flex-wrap gap-3 align-items-center justify-content-between'>
            <div className='d-flex  gap-3'>
              <Button variant="primary" onClick={() => handleItemClick(InvoiceActions.SEND_INVOICE)}>
                {<PaperPlaneIcon />} 
                { InvoiceActions.SEND_INVOICE}
              </Button>
              <Button variant="secondary" onClick={() => handleItemClick(InvoiceActions.PREVIEW_INVOICE_PDF)}>
                { <FilePdfIcon />} 
                { InvoiceActions.PREVIEW_INVOICE_PDF}
              </Button>
            </div>
            <div className='d-flex gap-3 align-items-center'>
              <div className='invoice_balance '>
                <span>Balance: </span>
                {`$${((invoiceDetails?.totalInCents ?? 0) / 100).toFixed(2)}`}
              </div>
              <div>
                <Button variant="secondary" onClick={() => handleItemClick(InvoiceActions.RECORD_INVOICE_PAYMENT)}>
                  { InvoiceActions.RECORD_INVOICE_PAYMENT}
                </Button>
              </div>
            </div>
          </div>
        }
        { hasValidAppData && !!id && !!applicationId &&
          // Application Information
          <Widget hideTable={true} widgetLabelContainerCss='invoice_widget_lbl_container'  title='Application Information'>
            <Form editMode ={false} formRows={applicationDetailsForm} handleInputChange={() => {}} 
              formData={
                {
                  ...applicationDetails, 
                  applicationType: applicationDetails?.appType?.description
                } as ViewApplicationDetails
              } />
          </Widget>
        }
        { 
          <>
            {/* Invoice Details */}
            <Widget hideTable={true} widgetLabelContainerCss='invoice_widget_lbl_container'  title='Invoice Details'>
              <Form 
                editMode ={viewMode === UserMode.EditMode} 
                formData={invoiceDetails || {}} 
                formRows={invoiceDetailsForm} 
                handleInputChange={(graphQLPropertyName: string, value: any) => handleInputChange(graphQLPropertyName, value)} />
            </Widget>
          
            {/* Attachments */}
            <Widget
              editMode={viewMode === UserMode.EditMode}
              customWidgetCss='gap-4'
              title='Attached Files'
              tableIsLoading={requestStatus}
              tableColumns={invoiceAttachmentsTableConfigs}
              tableData={invoiceDetails?.lineItems || []}
              changeHandler={() => {}}
            />

            {/* Invoice Items */}
            <div className='d-flex flex-column gap-4'>
              <Widget
                editMode={viewMode === UserMode.EditMode}
                customWidgetCss='gap-4'
                title='Invoice Items'
                tableIsLoading={requestStatus}
                tableColumns={invoiceItemsTableConfigs}
                tableData={invoiceDetails?.lineItems || []}
                changeHandler={invoiceItemChangeHandler}
              >
                { viewMode === UserMode.EditMode &&
                  <Button variant="secondary" onClick={() => handleItemClick(InvoiceActions.ADD_INVOICE_ITEM)}>
                  <Plus /> {InvoiceActions.ADD_INVOICE_ITEM}
                  </Button>
                }
              </Widget>
              <div className="invoice-widget-total-container d-flex flex-column align-items-end gap-2 pb-4">
                <div className="d-flex gap-3">
                  <span>Subtotal:</span>
                  <span>${((invoiceDetails?.subtotalInCents ?? 0) / 100).toFixed(2).toString()}</span>
                </div>
                <div className="d-flex gap-3">
                  <span>Tax (GST):</span>
                  <span>${((invoiceDetails?.gstInCents ?? 0) / 100).toFixed(2).toString()}</span>
                </div>
                <div className="d-flex gap-3">
                  <span>Tax (PST):</span>
                  <span>${((invoiceDetails?.pstInCents ?? 0) / 100).toFixed(2).toString()}</span>
                </div>
              </div>
              <div className='d-flex flex-column align-items-end gap-2 '>
                <div className="d-flex gap-3">
                  <strong>Total:</strong>
                  <strong>${((invoiceDetails?.totalInCents ?? 0) / 100).toFixed(2).toString()}</strong>
                </div>
              </div>
            </div>

             {/* <Widget
              editMode={viewMode === UserMode.EditMode}
              customWidgetCss='gap-4'
              title='Invoice History'
              tableIsLoading={requestStatus}
              tableColumns={invoiceAttachmentsTableConfigs}
              tableData={invoiceDetails?.lineItems || []}
              changeHandler={() => {}}
            /> */}
          </>
        }

        <ViewInvoiceForm />
        {
          hasErrors &&
            <ModalDialog
              closeHandler={() => {setHasErrors(false);}}
              errorOption={hasErrors}
              headerLabel='Please fix the errors below:'
              customHeaderTextCss='error-modal-header-text'
            >
              {
                <React.Fragment>
                  <div>
                    <span className="custom-modal-data-text text-danger">
                      The following fields have errors:
                    </span>
                  </div>
                  <div
                    style={{
                      maxHeight: '200px', // Adjust based on your modal size
                      overflowY: 'auto',
                    }}
                  >
                    <ul className="custom-modal-data-text text-danger">
                      {errors?.map((error: any, index: number) => (
                        <li key={index}>
                          {error?.errorMessage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </React.Fragment>
              }
            </ModalDialog>
        }
      </PageContainer>
    </div>
  );
};

export default Invoice;
