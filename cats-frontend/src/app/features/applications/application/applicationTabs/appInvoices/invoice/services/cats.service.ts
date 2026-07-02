import { getAxiosInstance } from '@cats/helpers/utility';
import { EmailRecipient } from '@cats/components/multi-recipient-input';

const CATS_API: string =
  import.meta.env.VITE_BACKEND_API ||
  ((window as any)._env_ && (window as any)._env_.VITE_BACKEND_API);

export interface SendInvoicePayload {
  invoiceId: number;
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  subject: string;
  body: string;
}

export const sendInvoice = async (
  emailPayload: SendInvoicePayload,
  file: File,
): Promise<any> => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    formData.append('invoiceId', emailPayload.invoiceId.toString());
    formData.append('subject', emailPayload.subject || '');
    formData.append('body', emailPayload.body || '');
    formData.append(
      'to',
      JSON.stringify(
        emailPayload.to.map((r) => ({
          email: r.email,
          personId: r.personId || null,
        })),
      ),
    );
    if (emailPayload.cc?.length) {
      formData.append(
        'cc',
        JSON.stringify(
          emailPayload.cc.map((r) => ({
            email: r.email,
            personId: r.personId || null,
          })),
        ),
      );
    }

    const response = await getAxiosInstance(CATS_API).post(
      `/cats/sendEmail`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error('Error in sending invoice:', error);
    throw error;
  }
};

export const createObject = async (
  fileUpload: { bucketId: string; invoiceId: string },
  filesPayload: any[],
): Promise<any> => {
  try {
    const formData = new FormData();

    // Append each file to the form data with the correct key 'files[]'
    if (filesPayload.length > 0) {
      for (const payload of filesPayload) {
        const { file } = payload;

        // Check if the 'file' is a valid File object
        if (file instanceof File) {
          formData.append('files', file); // Append with correct key name for multiple files
        }
      }
    }

    // Append other necessary fields
    formData.append('bucketId', fileUpload?.bucketId);
    formData.append('invoiceId', fileUpload?.invoiceId);

    // Send the request to the API
    const response = await getAxiosInstance(CATS_API).post(
      `/cats/uploadFiles`,
      formData,
    );

    return response.data;
  } catch (error) {
    console.error('Error in creating object:', error);
    throw error;
  }
};
