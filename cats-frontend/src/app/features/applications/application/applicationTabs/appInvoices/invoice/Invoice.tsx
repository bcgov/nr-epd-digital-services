import React, { useEffect, useState } from 'react';
import NavigationBar from '@cats/components/navigation-bar/NavigationBar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserMode } from '@cats/helpers/requests/userMode';
import Actions from '@cats/components/action/Actions';
import { SaveButton } from '@cats/components/simple/CustomButtons';
import PageContainer from '@cats/components/simple/PageContainer';
import { useGetHeaderDetailsByApplicationIdQuery } from '@cats/features/applications/application/ApplicationDetails.generated';
import { FaTimes } from 'react-icons/fa';
import { Button } from '@cats/components/button/Button';
import {
  FilePdfIcon,
  PaperPlaneIcon,
  Plus,
} from '@cats/components/common/icon';
import './Invoice.css';
import Widget from '@cats/components/widget/Widget';
import Form from '@cats/components/form/Form';
import { GetInvoiceConfig } from './InvoiceConfig';
import { RequestStatus } from '@cats/helpers/requests/status';
import { cleanGraphQLPayload, validateForm } from '@cats/helpers/utility';
import { IFormField } from '@cats/components/input-controls/IFormField';
import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import LoadingOverlay from '@cats/components/loader/LoadingOverlay';
import InvoicePreviewTemplate from './InvoicePreviewTemplate';
import {
  GetInvoiceByIdDocument,
  useCreateBucketMutation,
  useCreateInvoiceMutation,
  useDeleteBucketMutation,
  useDeleteInvoiceMutation,
  useDeleteObjectMutation,
  useGetInvoiceByIdQuery,
  useGetInvoiceRecipientNamesQuery,
  useGetObjectLazyQuery,
  useUpdateInvoiceMutation,
} from '../graphql/Invoice.generated';
import { pdf } from '@react-pdf/renderer';
import {
  DownloadType,
  DropdownDto,
  InvoiceStatus,
  UpdateInvoice,
  UpdateInvoiceItem,
  ViewApplicationDetails,
} from '../../../../../../../generated/types';
import { v4 } from 'uuid';
import Decimal from 'decimal.js';
import FileUploader from '@cats/components/fileUploader/FileUploader';
import { HttpStatusCode } from 'axios';
import { InvoiceItemTypes } from '../enums/invoiceItemTypes';
import { InvoiceActions } from '../enums/invoiceActions';
import { InvoiceEmailTemplate } from './InvoiceEmailTemplate';
import {
  createObject,
  sendInvoice,
  SendInvoicePayload,
} from './services/cats.service';
import {
  MultiRecipientInput,
  EmailRecipient,
} from '@cats/components/multi-recipient-input';

interface DeletedAttachment {
  bucketId: string;
  objectId: string;
}

const initialInvoice: any = {
  subject: '',
  personId: '',
  issuedDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0], // 30 days from now
  invoiceStatus: InvoiceStatus.Draft,
  taxExempt: false,
  pstExempt: false,
  subtotalInCents: 0,
  gstInCents: 0,
  pstInCents: 0,
  totalInCents: 0,
  invoiceNotes: '',
  invoiceItems: [
    {
      id: v4(),
      description: '',
      quantity: '1',
      unitPriceInCents: '0', // Will display as empty in the UI
      totalInCents: '',
      itemType: InvoiceItemTypes.SERVICE,
    },
  ],
  invoiceAttachments: [],
  recipient: {
    key: '0',
    value: '',
    metaData: '',
  },
};

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
  const { data: applicationData } = useGetHeaderDetailsByApplicationIdQuery({
    fetchPolicy: 'cache-and-network',
    variables: { applicationId: numericAppId },
    skip: !numericAppId || isNaN(numericAppId),
  });

  // Fetch invoice details
  const { data: invoiceData } = useGetInvoiceByIdQuery({
    fetchPolicy: 'cache-and-network',
    variables: { invoiceId: numericInvoiceId },
    skip: !numericInvoiceId,
  });

  const [getObject] = useGetObjectLazyQuery();
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [createInvoice] = useCreateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [createBucket] = useCreateBucketMutation();
  const [deleteBucket] = useDeleteBucketMutation();
  const [deleteObject] = useDeleteObjectMutation();

  // State to store invoice and application details
  const [invoiceEmailDetails, setInvoiceEmailDetails] = useState<any>({
    emailSubject: '',
    emailBody: '',
  });

  // Recipients state for the invoice (To/CC fields on Invoice Details)
  const [toRecipients, setToRecipients] = useState<EmailRecipient[]>([]);
  const [ccRecipients, setCcRecipients] = useState<EmailRecipient[]>([]);

  const [invoiceDetails, setInvoiceDetails] = useState(initialInvoice);
  const [applicationDetails, setApplicationDetails] = useState<
    ViewApplicationDetails | null | undefined
  >(applicationData?.getApplicationDetailsById?.data as ViewApplicationDetails);

  const [isVisible, setIsVisible] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.idle,
  );
  const [viewMode, setViewMode] = useState(UserMode.Default);
  const [taxExempt, setTaxExempt] = useState(false);
  const [searchParam, setSearchParam] = useState<string>('');
  const [errors, setErrors] = useState<any[]>([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<
    DeletedAttachment[]
  >([]);
  const [bucketId, setBucketId] = useState<string | null>(null);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isSendInvoiceOpen, setIsSendInvoiceOpen] = useState(false);

  const { data: recipients, loading } = useGetInvoiceRecipientNamesQuery({
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
    if (invoiceData?.getInvoiceById?.data) {
      setInvoiceDetails((prev: any) => ({
        ...prev,
        ...invoiceData.getInvoiceById.data,
        invoiceItems: invoiceData?.getInvoiceById?.data?.invoiceItems?.map(
          (item: any) => ({
            ...item,
            quantity: item.quantity.toString(),
            unitPriceInCents: ((item.unitPriceInCents ?? 0) / 100).toFixed(2),
            totalInCents: ((item.totalInCents ?? 0) / 100).toFixed(2),
          }),
        ),
      }));
    }
  };

  useEffect(() => {
    if (applicationData?.getApplicationDetailsById?.data) {
      setApplicationDetails(
        applicationData.getApplicationDetailsById
          .data as ViewApplicationDetails,
      );
    }
    if (!!id) {
      if (invoiceData?.getInvoiceById?.data) {
        if (invoiceData?.getInvoiceById?.data?.invoiceAttachments?.length > 0) {
          const firstAttachment =
            invoiceData?.getInvoiceById?.data?.invoiceAttachments[0];
          setBucketId(firstAttachment?.bucketId);
        }
        transformInvoiceDetails();
        setRequestStatus(RequestStatus.success);
      } else {
        setRequestStatus(RequestStatus.loading);
      }

      if (
        invoiceData?.getInvoiceById?.data &&
        applicationData?.getApplicationDetailsById?.data
      ) {
        const emailBody = InvoiceEmailTemplate(
          invoiceData?.getInvoiceById?.data,
          applicationData?.getApplicationDetailsById?.data,
        );
        const invoiceRecord = invoiceData?.getInvoiceById?.data as any;

        // Populate To/CC recipients from saved invoice data
        if (invoiceRecord?.emailTo?.length && toRecipients.length === 0) {
          setToRecipients(
            invoiceRecord.emailTo.map((r: any) => ({
              id: r.personId?.toString() || r.email,
              email: r.email,
              displayName: r.displayName || r.email,
              personId: r.personId || undefined,
              isCustom: !r.personId,
            })),
          );
        } else if (toRecipients.length === 0) {
          // Fallback: use the invoice recipient if no emailTo saved yet
          const recipientData = invoiceRecord?.recipient;
          const recipientEmail = recipientData?.metaData || '';
          if (recipientEmail) {
            setToRecipients([
              {
                id: recipientData?.key || 'default-to',
                email: recipientEmail,
                displayName: recipientData?.value || recipientEmail,
                personId: recipientData?.key
                  ? parseInt(recipientData.key, 10)
                  : undefined,
                isCustom: false,
              },
            ]);
          }
        }

        if (invoiceRecord?.emailCc?.length && ccRecipients.length === 0) {
          setCcRecipients(
            invoiceRecord.emailCc.map((r: any) => ({
              id: r.personId?.toString() || r.email,
              email: r.email,
              displayName: r.displayName || r.email,
              personId: r.personId || undefined,
              isCustom: !r.personId,
            })),
          );
        }

        setInvoiceEmailDetails((prev: any) => ({
          ...prev,
          emailBody: emailBody.trim(),
        }));
      }
    } else {
      setViewMode(UserMode.EditMode);
    }
  }, [applicationData, invoiceData]);

  const toDecimal = (val: any): Decimal => {
    try {
      const parsed = typeof val === 'string' ? val.trim() : val;
      const decimal = new Decimal(parsed);
      return decimal.isNaN() ? new Decimal(0) : decimal;
    } catch {
      return new Decimal(0);
    }
  };

  const processInvoiceAttachments = async (invoice: any): Promise<any> => {
    try {
      if (!invoice) return invoice;

      // 1. Delete objects marked for deletion
      if (attachmentsToDelete?.length) {
        // Use for-await-of for sequential async deletes, can be parallel if needed
        for (const attachment of attachmentsToDelete) {
          if (attachment?.objectId?.trim()) {
            try {
              const response = await deleteObject({
                variables: { objectId: attachment.objectId },
              });

              if (response?.data?.deleteObject?.success) {
                setAttachmentsToDelete((prev) =>
                  prev.filter((a: any) => a.objectId !== attachment.objectId),
                );
              }
            } catch (deleteErr) {
              console.warn(
                `Failed to delete objectId ${attachment.objectId}:`,
                deleteErr,
              );
              // Decide if you want to continue or stop on error
            }
          }
        }
      }

      // 2. Create bucket if needed
      let currentBucketId = bucketId?.trim();

      if (!currentBucketId) {
        const bucketName = `application/${applicationId}/invoice/${invoice.id}`;
        const bucketKey = bucketName;

        try {
          const response = await createBucket({
            variables: { bucketName, bucketKey },
          });

          if (response?.data?.createBucket?.data?.bucketId) {
            currentBucketId = response?.data?.createBucket?.data?.bucketId;
            setBucketId(currentBucketId);
          }

          if (!response?.data?.createBucket?.data?.bucketId) {
            console.error('Bucket creation failed, no response data.');
            return;
          }
        } catch (bucketErr) {
          console.error('Bucket creation failed:', bucketErr);
          return;
        }
      }

      // 3. Filter attachments that need upload
      const filesToUpload = invoice.invoiceAttachments?.filter(
        (att: any) => att.file && !att.objectId && att.previewUrl,
      );

      if (!filesToUpload?.length) {
        // Nothing to upload, return original invoice unmodified
        return invoice;
      }

      // Filter out attachments that are NOT uploaded (no file or no previewUrl)
      const filesToKeep = invoice.invoiceAttachments.filter(
        (att: any) => !(att?.file && att?.previewUrl),
      );

      if (!currentBucketId?.trim()) {
        throw new Error('Bucket ID is required before uploading the object.');
      }

      // 4. Upload attachments
      try {
        const response = await createObject(
          { bucketId: currentBucketId ?? '', invoiceId: invoice.id },
          filesToUpload,
        );

        // Check if there are conflicts or errors
        const hasConflicts = response?.summary?.conflicts > 0;
        const hasErrors = response?.summary?.errors > 0;

        if (!response?.status && (hasConflicts || hasErrors)) {
          response.data.forEach((item: any) => {
            if (
              item.status === HttpStatusCode.Conflict ||
              item.fileAlreadyExists
            ) {
              setErrors((prev) => [
                ...prev,
                {
                  errorMessage: `File ${item.fileName} already exists in the bucket.`,
                },
              ]);
            } else {
              setErrors((prev) => [
                ...prev,
                { errorMessage: item.errorMessage || 'Unknown error' },
              ]);
            }
          });
          setHasErrors(true);
          return invoice;
        }

        // Map uploaded files to updated attachments array
        const updatedAttachments = response?.data?.map((item: any) => ({
          invoiceId: invoice.id,
          fileName: item.fileName,
          objectId: item.objectId,
          bucketId: currentBucketId,
        }));

        // Update invoice with new attachments
        return {
          ...invoice,
          invoiceAttachments: [...filesToKeep, ...updatedAttachments],
        };
      } catch (uploadErr: any) {
        setErrors((prev) => [
          ...prev,
          { errorMessage: 'Upload file(s) failed' },
        ]);
        setHasErrors(true);
        return invoice;
      }
    } catch (e) {
      console.error('Error processing invoice attachments:', e);
      // Return invoice as fallback or empty array, depends on your needs
      return invoice;
    }
  };

  const updateInvoiceDetails = (invoice: any) => {
    const cleanInvoice = cleanGraphQLPayload(invoice, [
      'recipient',
      'whoUpdated',
      '__typename',
    ]);
    const updatedInvoiceItems: UpdateInvoiceItem[] =
      cleanInvoice?.invoiceItems?.map((item: any) => {
        const quantity = toDecimal(item.quantity);
        const unitPrice = toDecimal(item.unitPriceInCents);
        const total = toDecimal(item.totalInCents);
        const isIdNumber = typeof item.id === 'number';
        return {
          ...(isIdNumber ? { id: item.id } : {}), // include only if it's a number
          itemType: item.itemType,
          description: item.description,
          quantity: quantity.toNumber(),
          unitPriceInCents: unitPrice.times(100).toDecimalPlaces(0).toNumber(),
          totalInCents: total.times(100).toDecimalPlaces(0).toNumber(),
        };
      });
    const invoiceToUpdate: UpdateInvoice = {
      ...cleanInvoice,
      emailTo: toRecipients.map((r) => ({
        email: r.email,
        personId: r.personId || null,
        displayName: r.displayName || r.email,
      })),
      emailCc: ccRecipients.map((r) => ({
        email: r.email,
        personId: r.personId || null,
        displayName: r.displayName || r.email,
      })),
      invoiceItems: updatedInvoiceItems,
    };

    return invoiceToUpdate;
  };

  const generateFile = async () => {
    try {
      const blob = await pdf(
        <InvoicePreviewTemplate
          invoice={invoiceDetails}
          application={applicationDetails}
        />,
      ).toBlob();

      return blob;
    } catch (error) {
      console.error('Error generating the PDF:', error);
      throw error;
    }
  };

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
        } else {
          setErrors([]);
          setHasErrors(false);
          try {
            if (!!id) {
              const updatedInvoice =
                await processInvoiceAttachments(invoiceDetails);
              if (hasErrors) return;
              const response = await updateInvoice({
                variables: {
                  invoice: updateInvoiceDetails(updatedInvoice),
                },
                refetchQueries: [
                  {
                    query: GetInvoiceByIdDocument,
                    variables: { invoiceId: numericInvoiceId },
                  },
                ],
                awaitRefetchQueries: true,
              });
              if (response?.data?.updateInvoice?.success) {
                setViewMode(UserMode.Default);
                setAttachmentsToDelete([]);
              }
            } else {
              const { invoiceAttachments, ...restInvoice } = invoiceDetails;
              const cleanInvoice = cleanGraphQLPayload(restInvoice, [
                'recipient',
                '__typename',
              ]);
              await createInvoice({
                variables: {
                  invoice: {
                    ...cleanInvoice,
                    applicationId: numericAppId,
                    emailTo: toRecipients.map((r) => ({
                      email: r.email,
                      personId: r.personId || null,
                      displayName: r.displayName || r.email,
                    })),
                    emailCc: ccRecipients.map((r) => ({
                      email: r.email,
                      personId: r.personId || null,
                      displayName: r.displayName || r.email,
                    })),
                    invoiceItems: invoiceDetails?.invoiceItems?.map(
                      (item: any) => {
                        const quantity = toDecimal(item.quantity);
                        const unitPrice = toDecimal(item.unitPriceInCents);
                        const total = toDecimal(item.totalInCents);
                        const { id, ...rest } = item;
                        return {
                          ...rest,
                          quantity: quantity.toNumber(),
                          unitPriceInCents: unitPrice
                            .times(100)
                            .toDecimalPlaces(0)
                            .toNumber(),
                          totalInCents: total
                            .times(100)
                            .toDecimalPlaces(0)
                            .toNumber(),
                        };
                      },
                    ),
                  },
                },
              }).then(async (response: any) => {
                if (
                  response?.data?.createInvoice?.success &&
                  !!response?.data?.createInvoice?.data?.id
                ) {
                  if (!!invoiceAttachments?.length) {
                    const result = await processInvoiceAttachments({
                      ...response?.data?.createInvoice?.data,
                      id: response?.data?.createInvoice?.data?.id,
                      invoiceAttachments,
                    });
                    if (hasErrors) return;
                    await updateInvoice({
                      variables: {
                        invoice: cleanGraphQLPayload(result, [
                          'recipient',
                          'whoUpdated',
                          '__typename',
                        ]),
                      },
                    });
                  }
                  setAttachmentsToDelete([]);
                  setViewMode(UserMode.Default);
                  navigate(`/applications/${applicationId}/invoices`);
                }
              });
            }
          } catch (err) {
            console.error('Failed to save invoice:', err);
          }
        }
        break;
      case InvoiceActions.CANCEL_INVOICE:
        if (!!id) {
          setViewMode(UserMode.Default);
          transformInvoiceDetails();
        } else {
          navigate(`/applications/${applicationId}/invoices`);
        }
        break;
      case InvoiceActions.ADD_INVOICE_ITEM:
        if (invoiceDetails) {
          setInvoiceDetails((prev: any) => ({
            ...prev,
            invoiceItems: [
              ...prev.invoiceItems,
              {
                id: v4(),
                description: '',
                quantity: '1',
                unitPriceInCents: '0', // Keep as 0 in data model, but display as empty
                totalInCents: '',
                itemType: InvoiceItemTypes.SERVICE,
              },
            ],
          }));
        }
        break;
      case InvoiceActions.MARK_AS_SENT:
        if (!!id) {
          try {
            if (
              !invoiceDetails ||
              invoiceDetails?.invoiceStatus === InvoiceStatus.Sent
            ) {
              return;
            } else {
              await updateInvoice({
                variables: {
                  invoice: {
                    ...updateInvoiceDetails(invoiceDetails),
                    invoiceStatus: InvoiceStatus.Sent,
                  },
                },
                refetchQueries: [
                  {
                    query: GetInvoiceByIdDocument,
                    variables: { invoiceId: numericInvoiceId },
                  },
                ],
                awaitRefetchQueries: true,
              });
            }
          } catch (err) {
            console.error('Failed to mark invoice as sent:', err);
          }
        }
        break;
      case InvoiceActions.DELETE_INVOICE:
        if (!!id) {
          const response = await deleteInvoice({
            variables: {
              invoiceId: numericInvoiceId,
            },
          });
          if (response?.data?.deleteInvoice?.success) {
            // Delete attachments from COMS
            if (!!invoiceDetails?.invoiceAttachments?.length) {
              if (!!bucketId?.trim()) {
                await deleteBucket({
                  variables: {
                    bucketId,
                  },
                });
              }
            }
            navigate(`/applications/${applicationId}/invoices`);
          }
        }
        break;
      case InvoiceActions.DUPLICATE_INVOICE:
        break;
      case InvoiceActions.RECORD_INVOICE_PAYMENT:
        setIsRecordPaymentOpen(!isRecordPaymentOpen);
        break;
      case InvoiceActions.SEND_INVOICE:
        if (!invoiceDetails) return;
        const recipientEmail = invoiceDetails?.recipient?.metaData || '';
        const allToRecipients: EmailRecipient[] = [...toRecipients];

        // Include the invoice recipient email in To if not already present
        if (
          recipientEmail &&
          !allToRecipients.some(
            (r) => r.email.toLowerCase() === recipientEmail.toLowerCase(),
          )
        ) {
          allToRecipients.unshift({
            id: invoiceDetails?.recipient?.key || 'invoice-recipient',
            email: recipientEmail,
            displayName: invoiceDetails?.recipient?.value || recipientEmail,
            personId: invoiceDetails?.recipient?.key
              ? parseInt(invoiceDetails.recipient.key, 10)
              : undefined,
            isCustom: false,
          });
        }

        if (allToRecipients.length === 0) return;
        const pdf = await generateFile();
        const file = new File([pdf], `Invoice-${invoiceDetails.id}.pdf`, {
          type: 'application/pdf',
        });
        const sendPayload: SendInvoicePayload = {
          invoiceId: invoiceDetails?.id,
          to: allToRecipients,
          cc: ccRecipients,
          subject: invoiceEmailDetails?.emailSubject,
          body: invoiceEmailDetails?.emailBody,
        };
        await sendInvoice(sendPayload, file)
          .then((res: any) => {
            if (res?.success) {
              setIsSendInvoiceOpen(false);
            }
          })
          .catch((err: any) => console.error(err));

        break;

      case InvoiceActions.PREVIEW_INVOICE_PDF:
        if (!invoiceDetails) return;
        const blob = await generateFile();
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');

        break;
      default:
        break;
    }
  };

  const calculateInvoice = (invoiceDetails: any) => {
    const updatedLineItems = invoiceDetails?.invoiceItems?.map((item: any) => {
      const quantity = toDecimal(item.quantity);
      const unitPrice = toDecimal(item.unitPriceInCents);
      const total = quantity.mul(unitPrice);

      return {
        ...item,
        quantity: item.quantity,
        unitPriceInCents: item.unitPriceInCents,
        totalInCents: total.isZero() ? '' : total.toFixed(2),
      };
    });

    const subtotal = updatedLineItems.reduce((sum: Decimal, item: any) => {
      return sum.plus(toDecimal(item.totalInCents));
    }, new Decimal(0));

    const gst = invoiceDetails.taxExempt ? new Decimal(0) : subtotal.mul(0.05);
    const pst =
      invoiceDetails.taxExempt || invoiceDetails.pstExempt
        ? new Decimal(0)
        : subtotal.mul(0.07);
    const total = subtotal.plus(gst).plus(pst);

    return {
      ...invoiceDetails,
      invoiceItems: updatedLineItems,
      subtotalInCents: subtotal.mul(100).toDecimalPlaces(0).toNumber(),
      gstInCents: gst.mul(100).toDecimalPlaces(0).toNumber(),
      pstInCents: pst.mul(100).toDecimalPlaces(0).toNumber(),
      totalInCents: total.mul(100).toDecimalPlaces(0).toNumber(),
    };
  };

  const handleInputChange = (
    graphQLPropertyName: any,
    value: string | number | boolean | [Date, Date] | DropdownDto,
  ) => {
    setInvoiceDetails((prev: any) => {
      if (!prev) return prev;

      const next = { ...prev };
      // Handle recipientId with object value
      if (
        graphQLPropertyName === 'personId' &&
        typeof value === 'object' &&
        value !== null &&
        'key' in value
      ) {
        next.personId = value.key;
        next.recipient = {
          ...prev.recipient,
          key: value.key,
          value: value.value,
        };
        return next;
      }

      // Directly update the property
      next[graphQLPropertyName] = value;

      // Trigger recalculation invoice only for fields that affect totals
      const shouldReCalculateInvoice = ['taxExempt', 'pstExempt'].includes(
        graphQLPropertyName,
      );

      if (graphQLPropertyName === 'taxExempt') {
        setTaxExempt(Boolean(value));
        next.pstExempt = Boolean(value); // Also update pstExempt automatically
      }

      return shouldReCalculateInvoice ? calculateInvoice(next) : next;
    });
  };

  const invoiceItemChangeHandler = (event: any) => {
    const { row, property, value } = event;
    let invoiceItems: any;
    if (property.includes('remove')) {
      invoiceItems = invoiceDetails?.invoiceItems?.filter(
        (item: any) => item.id !== row.id,
      );
    } else {
      invoiceItems = invoiceDetails?.invoiceItems?.map((item: any) =>
        item.id === row.id
          ? property === 'quantity' || property === 'unitPriceInCents'
            ? {
                ...item,
                [property]: value,
              }
            : {
                ...item,
                [property]: value,
              }
          : item,
      );
    }

    setInvoiceDetails((prev: any) => {
      if (!prev) return prev;
      return calculateInvoice({ ...prev, invoiceItems });
    });
  };

  const {
    applicationDetailsForm,
    invoiceDetailsForm,
    invoiceItemsTableConfigs,
    invoiceAttachmentsTableConfigs,
    invoiceRecordPaymentForm,
  } = GetInvoiceConfig({
    viewMode: viewMode,
    isDisabled: taxExempt,
    handleInputChange: handleInputChange,
    invoiceDetails: invoiceDetails,
    createMode: !id,
    getObject: getObject,
    recipient: {
      setSearchParam: setSearchParam,
      options: invoiceDetails?.recipient
        ? [
            {
              key: invoiceDetails?.recipient?.key,
              value: invoiceDetails?.recipient?.value,
            },
          ]
        : [],
      filteredOptions: recipients?.getParticipantNames?.data ?? [],
      loading: loading,
    },
    recipientsField: {
      toRecipients,
      ccRecipients,
      onAddToRecipient: (recipient: EmailRecipient) => {
        setToRecipients((prev) => [...prev, recipient]);
      },
      onRemoveToRecipient: (id: string) => {
        setToRecipients((prev) => prev.filter((r) => r.id !== id));
      },
      onAddCcRecipient: (recipient: EmailRecipient) => {
        setCcRecipients((prev) => [...prev, recipient]);
      },
      onRemoveCcRecipient: (id: string) => {
        setCcRecipients((prev) => prev.filter((r) => r.id !== id));
      },
    },
  });

  const validateInvoice = async () => {
    try {
      const [invoiceDetailsError, invoiceItemsError] = await Promise.all([
        validateInvoiceDetails(),
        validateInvoiceItems(),
      ]);
      return [...invoiceDetailsError, ...invoiceItemsError];
    } catch (error: any) {
      return error.message;
    }
  };

  const validateInvoiceDetails = () => {
    try {
      return validateForm(invoiceDetailsForm, invoiceDetails, '');
    } catch (error: any) {
      return error.message;
    }
  };

  const validateInvoiceItems = () => {
    try {
      const invoiceLineItems: IFormField[][] = [
        invoiceItemsTableConfigs
          .map((column) => column.displayType)
          .filter(
            (displayType): displayType is IFormField =>
              displayType !== undefined,
          ),
      ];

      const invoiceItemsError: any[] = [];
      invoiceDetails?.invoiceItems?.length <= 0
        ? invoiceItemsError.push({
            errorMessage: 'At least one invoice item is required',
          })
        : invoiceDetails?.invoiceItems?.map((item: any, index: number) => {
            let quantity = toDecimal(item.quantity);
            let unitPriceInCents = toDecimal(item.unitPriceInCents);
            if (quantity <= toDecimal(0)) {
              invoiceItemsError.push({
                errorMessage: `Invoice item: [${index + 1}] Quantity must be greater than 0`,
              });
            }
            if (unitPriceInCents <= toDecimal(0)) {
              invoiceItemsError.push({
                errorMessage: `Invoice item: [${index + 1}] Unit price must be greater than 0`,
              });
            }

            const validateInvoiceItem = validateForm(
              invoiceLineItems,
              item,
              `Invoice item: [${index + 1}]`,
            );
            invoiceItemsError.push(...validateInvoiceItem);
          });
      return invoiceItemsError;
    } catch (error: any) {
      return error.message;
    }
  };

  const validateInvoiceEmailDetails = () => {
    try {
      setErrors([]);
      setHasErrors(false);
      const validationErrors: any[] = [];

      // Validate invoice recipient has an email address
      const recipientEmail = invoiceDetails?.recipient?.metaData || '';
      if (!recipientEmail.trim()) {
        validationErrors.push({
          errorMessage:
            'The Invoice Recipient does not have an email address. Please update their profile or add recipients to the "Email To" field.',
        });
      }

      // Validate at least one To recipient or invoice recipient has email
      if (!toRecipients?.length && !recipientEmail.trim()) {
        validationErrors.push({
          errorMessage: 'At least one "To" recipient is required.',
        });
      }

      // Validate subject
      if (!invoiceEmailDetails?.emailSubject?.trim()) {
        validationErrors.push({
          errorMessage: 'Please enter an e-mail subject.',
        });
      }

      // Check for duplicates across To and CC
      const allEmails = [
        ...toRecipients.map((r: EmailRecipient) => r.email.toLowerCase()),
        ...ccRecipients.map((r: EmailRecipient) => r.email.toLowerCase()),
      ];
      const seen = new Set<string>();
      for (const email of allEmails) {
        if (seen.has(email)) {
          validationErrors.push({
            errorMessage: `Duplicate email address across To and CC: ${email}`,
          });
          break;
        }
        seen.add(email);
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setHasErrors(true);
        return false;
      }
      return true;
    } catch (error: any) {
      return error.message;
    }
  };

  const handleFileUpload = (file: File, previewUrl: string) => {
    setInvoiceDetails((prev: any) =>
      prev
        ? {
            ...prev,
            invoiceAttachments: [
              ...prev.invoiceAttachments,
              {
                id: v4(),
                invoiceId: numericInvoiceId,
                fileName: file.name,
                file: file,
                previewUrl,
              },
            ],
          }
        : prev,
    );
  };

  const handleFileSelect = (files: File[], previewUrls: string[]) => {
    if (!files?.length || !previewUrls.length) return;

    files.forEach((file, index) => {
      const previewUrl = previewUrls[index];
      handleFileUpload(file, previewUrl);
    });
  };

  const attachmentsChangeHandler = (event: any) => {
    const { property, row } = event;
    if (property.includes('remove')) {
      setInvoiceDetails((prev: any) => {
        if (!prev) return prev;

        const isUploaded = row.bucketId && row.objectId;

        // Track for deletion only if it was uploaded
        if (isUploaded) {
          setAttachmentsToDelete((prevDeleted: any[]) => [
            ...prevDeleted,
            { bucketId: row.bucketId, objectId: row.objectId },
          ]);
        }

        // Remove from UI
        const updated = prev.invoiceAttachments.filter(
          (item: any) => item.id !== row.id,
        );

        return {
          ...prev,
          invoiceAttachments: updated,
        };
      });
    }
  };

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
            <SaveButton
              clickHandler={() => handleItemClick(InvoiceActions.SAVE_INVOICE)}
              label={InvoiceActions.SAVE_INVOICE}
              isDisabled={hasErrors}
            />
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
  const hasValidInvoiceData = !!invoiceData?.getInvoiceById?.data;
  const { appType, id: appId } = applicationDetails || {};
  const { subject: invoiceSubject } = invoiceData?.getInvoiceById?.data || {};

  const navigationBarText = (appId || appType?.description) && (
    <div className="d-flex flex-column gap-1">
      {(appId || appType?.description) && (
        <div>
          <span className={'invoice_id_lbl invoice_lbl'}>{appId}</span>
          <span className={'custom_dot px-2'}>•</span>
          <span className={'invoice_type_lbl invoice_lbl'}>
            {appType?.description}
          </span>
        </div>
      )}
      {invoiceSubject && !!id ? (
        <div>
          <span className={'invoice_subject_lbl invoice_lbl'}>
            {invoiceSubject}
          </span>
        </div>
      ) : (
        <div>
          <span className={'invoice_subject_lbl invoice_lbl'}>
            {'New Invoice'}
          </span>
        </div>
      )}
    </div>
  );

  if (!hasValidAppData && !hasValidInvoiceData && !!id?.trim()) {
    return (
      <LoadingOverlay loading={!hasValidAppData || !hasValidInvoiceData} />
    );
  }

  return (
    <div className="invoice_detail_conatiner">
      <NavigationBar
        isVisible={isVisible}
        onClickBackButton={
          viewMode === UserMode.EditMode
            ? () => handleItemClick(InvoiceActions.CANCEL_INVOICE)
            : () => navigate(-1)
        }
        backButtonProps={{ variant: 'secondary' }}
        buttonIcon={viewMode === UserMode.EditMode && <FaTimes />}
        backButtonText={`${viewMode === UserMode.EditMode ? 'Cancel' : `Back to ${fromScreen}`}`}
        navigationBarText={navigationBarText}
        childern={navigationBarChildern}
      />
      <PageContainer
        customContainerClass={'invoice_page_container'}
        role="invoice"
      >
        {!!id && (
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
            <div className="d-flex  gap-3">
              <Button
                variant="primary"
                onClick={() => setIsSendInvoiceOpen(!isSendInvoiceOpen)}
              >
                {<PaperPlaneIcon />}
                {InvoiceActions.SEND_INVOICE}
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  handleItemClick(InvoiceActions.PREVIEW_INVOICE_PDF)
                }
              >
                {<FilePdfIcon />}
                {InvoiceActions.PREVIEW_INVOICE_PDF}
              </Button>
            </div>
            <div className="d-flex gap-3 align-items-center">
              <div className="invoice_balance ">
                <span>Balance: </span>
                {`$${((invoiceDetails?.totalInCents ?? 0) / 100).toFixed(2)}`}
              </div>
              {/* <div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleItemClick(InvoiceActions.RECORD_INVOICE_PAYMENT)
                  }
                >
                  {InvoiceActions.RECORD_INVOICE_PAYMENT}
                </Button>
              </div> */}
            </div>
          </div>
        )}
        {hasValidAppData && !!id && !!applicationId && (
          // Application Information
          <Widget
            hideTable={true}
            widgetLabelContainerCss="invoice_widget_lbl_container"
            title="Application Information"
          >
            <Form
              editMode={false}
              formRows={applicationDetailsForm}
              handleInputChange={() => {}}
              formData={
                {
                  ...applicationDetails,
                  applicationType: applicationDetails?.appType?.description,
                } as ViewApplicationDetails
              }
            />
          </Widget>
        )}
        {
          <>
            {/* Invoice Details */}
            <Widget
              hideTable={true}
              widgetLabelContainerCss="invoice_widget_lbl_container"
              title="Invoice Details"
            >
              <Form
                editMode={viewMode === UserMode.EditMode}
                formData={invoiceDetails || {}}
                formRows={invoiceDetailsForm}
                handleInputChange={(graphQLPropertyName: string, value: any) =>
                  handleInputChange(graphQLPropertyName, value)
                }
              />
            </Widget>
            {viewMode === UserMode.EditMode && (
              <div className="d-flex flex-column gap-1">
                <label className="custom-invoice-edit-lbl">
                  Attach File(S)
                </label>
                <FileUploader
                  multiple={true}
                  maxSizeMB={10}
                  onValidationError={(msg) => {
                    setErrors((prev) => [
                      ...prev,
                      {
                        errorMessage: msg,
                      },
                    ]);
                    setHasErrors(true);
                  }}
                  classNames={{
                    dropArea: 'custom-fu-drop-area',
                    iconWrapper:
                      'd-flex align-items-center justify-content-center gap-2 custom-fu-icon-wrapper',
                    label: 'custom-invoice-txt p-0 m-0',
                  }}
                  customText={{
                    dropMessage:
                      'Drag file here or click to select from browser',
                  }}
                  onFileSelect={({ files, previewUrls }) =>
                    handleFileSelect(files, previewUrls)
                  }
                />
              </div>
            )}
            {/* Attachments */}
            <Widget
              editMode={viewMode === UserMode.EditMode}
              customWidgetCss="gap-4"
              title="Attached Files"
              tableIsLoading={requestStatus}
              tableColumns={invoiceAttachmentsTableConfigs}
              tableData={invoiceDetails?.invoiceAttachments || []}
              changeHandler={attachmentsChangeHandler}
            />

            {/* Invoice Items */}
            <div className="d-flex flex-column gap-4">
              <Widget
                editMode={viewMode === UserMode.EditMode}
                customWidgetCss="gap-4"
                title="Invoice Items"
                tableIsLoading={requestStatus}
                tableColumns={invoiceItemsTableConfigs}
                tableData={invoiceDetails?.invoiceItems || []}
                changeHandler={invoiceItemChangeHandler}
              >
                {viewMode === UserMode.EditMode && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleItemClick(InvoiceActions.ADD_INVOICE_ITEM)
                    }
                  >
                    <Plus /> {InvoiceActions.ADD_INVOICE_ITEM}
                  </Button>
                )}
              </Widget>
              <div className="invoice-widget-total-container d-flex flex-column align-items-end gap-2 pb-4">
                <div className="d-flex gap-3">
                  <span>Subtotal:</span>
                  <span>
                    $
                    {((invoiceDetails?.subtotalInCents ?? 0) / 100)
                      .toFixed(2)
                      .toString()}
                  </span>
                </div>
                <div className="d-flex gap-3">
                  <span>Tax (GST):</span>
                  <span>
                    $
                    {((invoiceDetails?.gstInCents ?? 0) / 100)
                      .toFixed(2)
                      .toString()}
                  </span>
                </div>
                <div className="d-flex gap-3">
                  <span>Tax (PST):</span>
                  <span>
                    $
                    {((invoiceDetails?.pstInCents ?? 0) / 100)
                      .toFixed(2)
                      .toString()}
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end gap-2 ">
                <div className="d-flex gap-3">
                  <strong>Total:</strong>
                  <strong>
                    $
                    {((invoiceDetails?.totalInCents ?? 0) / 100)
                      .toFixed(2)
                      .toString()}
                  </strong>
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
        {/* {isRecordPaymentOpen && (
          <ModalDialog
            closeHandler={() => setIsRecordPaymentOpen(!isRecordPaymentOpen)}
            headerLabel="Record Payment"
            customHeaderTextCss="custom-invoice-heading"
            saveBtnLabel="Confirm"
            showTickIcon={true}
            saveButtonDisabled={true}
          >
            <Form
              editMode={true}
              formRows={invoiceRecordPaymentForm}
              formData={{
                recordPaymentDate: new Date(),
                recordPaymentAmount: 0,
              }}
              handleInputChange={() => {}}
            />
          </ModalDialog>
        )} */}
        {isSendInvoiceOpen && (
          <ModalDialog
            headerLabel="Send Invoice"
            customContentCss="custom-invoice-modal-content"
            customHeaderTextCss="custom-invoice-heading"
            discardOption={true}
            saveBtnLabel="Send Invoice"
            dicardBtnLabel="View Invoice"
            cancelBtnLabel="Cancel"
            customSaveIcon={<PaperPlaneIcon />}
            discardHandler={() =>
              handleItemClick(InvoiceActions.PREVIEW_INVOICE_PDF)
            }
            validator={validateInvoiceEmailDetails}
            closeHandler={(response) => {
              if (response) {
                handleItemClick(InvoiceActions.SEND_INVOICE);
              }
              setIsSendInvoiceOpen(false);
            }}
          >
            <div className="d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-1">
                <label className="custom-invoice-lbl">Recipients</label>
                <div className="d-flex flex-column gap-1 p-2 border rounded bg-light">
                  <div className="d-flex flex-wrap gap-1 align-items-center">
                    <strong className="me-1" style={{ fontSize: '0.85rem' }}>
                      To:
                    </strong>
                    {invoiceDetails?.recipient?.metaData && (
                      <span
                        className="badge bg-primary-subtle text-dark border"
                        style={{ fontSize: '0.8rem' }}
                      >
                        {invoiceDetails?.recipient?.value &&
                        invoiceDetails.recipient.value !==
                          invoiceDetails.recipient.metaData
                          ? `${invoiceDetails.recipient.value} <${invoiceDetails.recipient.metaData}>`
                          : invoiceDetails.recipient.metaData}
                      </span>
                    )}
                    {toRecipients
                      .filter(
                        (r) => r.email !== invoiceDetails?.recipient?.metaData,
                      )
                      .map((r) => (
                        <span
                          key={r.id}
                          className="badge bg-primary-subtle text-dark border"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {r.displayName && r.displayName !== r.email
                            ? `${r.displayName} <${r.email}>`
                            : r.email}
                        </span>
                      ))}
                    {!invoiceDetails?.recipient?.metaData &&
                      toRecipients.length === 0 && (
                        <span
                          className="text-danger"
                          style={{ fontSize: '0.8rem' }}
                        >
                          No recipients selected.
                        </span>
                      )}
                  </div>
                  {ccRecipients.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 align-items-center">
                      <strong className="me-1" style={{ fontSize: '0.85rem' }}>
                        CC:
                      </strong>
                      {ccRecipients.map((r) => (
                        <span
                          key={r.id}
                          className="badge bg-light text-dark border"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {r.displayName && r.displayName !== r.email
                            ? `${r.displayName} <${r.email}>`
                            : r.email}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="custom-invoice-lbl" htmlFor="email-subject">
                  E-mail Subject
                </label>
                <input
                  id="email-subject"
                  type="text"
                  className="form-control custom-invoice-edit-txt"
                  placeholder="Please enter e-mail subject..."
                  value={invoiceEmailDetails?.emailSubject || ''}
                  onChange={(e) =>
                    setInvoiceEmailDetails((prev: any) => ({
                      ...prev,
                      emailSubject: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="d-flex flex-column gap-1">
                <label className="custom-invoice-lbl" htmlFor="email-body">
                  E-mail Body
                </label>
                <textarea
                  id="email-body"
                  className="form-control custom-invoice-edit-txt"
                  rows={10}
                  placeholder="Please enter e-mail body..."
                  value={invoiceEmailDetails?.emailBody || ''}
                  onChange={(e) =>
                    setInvoiceEmailDetails((prev: any) => ({
                      ...prev,
                      emailBody: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </ModalDialog>
        )}
        {hasErrors && (
          <ModalDialog
            cancelBtnLabel="Close"
            closeHandler={() => {
              setHasErrors(false);
            }}
            errorOption={hasErrors}
            headerLabel="Please fix the errors below:"
            customHeaderTextCss="error-modal-header-text"
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
                      <li key={index}>{error?.errorMessage}</li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            }
          </ModalDialog>
        )}
      </PageContainer>
    </div>
  );
};

export default Invoice;
