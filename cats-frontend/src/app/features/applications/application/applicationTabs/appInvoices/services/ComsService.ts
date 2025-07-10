import { gql } from '@apollo/client';
import { apolloClientInstance } from '../../../../../../../apollo';

export interface UploadFileResult {
  success: boolean;
  objectId?: string;
  error?: string;
}

// GraphQL mutation for uploading files
const UPLOAD_FILE_TO_INVOICE = gql`
  mutation UploadFileToInvoice($input: FileUploadInputDto!) {
    uploadFileToInvoice(input: $input) {
      success
      httpStatusCode
      message
      objectStorageId
      attachment {
        id
        invoiceId
        fileName
        fileSize
        mimeType
        objectStorageId
        createdAt
        createdBy
      }
    }
  }
`;

// GraphQL query for getting invoice attachments
const GET_INVOICE_ATTACHMENTS = gql`
  query GetInvoiceAttachments($invoiceId: Int!) {
    getInvoiceAttachments(invoiceId: $invoiceId) {
      success
      httpStatusCode
      message
      attachments {
        id
        invoiceId
        fileName
        fileSize
        mimeType
        objectStorageId
        createdAt
        createdBy
      }
    }
  }
`;

// GraphQL mutation for deleting attachments
const DELETE_INVOICE_ATTACHMENT = gql`
  mutation DeleteInvoiceAttachment($id: Int!) {
    deleteInvoiceAttachment(id: $id) {
      success
      httpStatusCode
      message
    }
  }
`;

/**
 * Upload a file to COMS via GraphQL backend
 *
 * @param file The file to upload
 * @param applicationId The application ID
 * @param invoiceId The invoice ID
 * @returns Promise with upload result
 */
export async function uploadFileToComs(
  file: File,
  applicationId: number,
  invoiceId: number,
): Promise<UploadFileResult> {
  try {
    // Convert file to base64
    const fileContent = await fileToBase64(file);

    const result = await apolloClientInstance.mutate({
      mutation: UPLOAD_FILE_TO_INVOICE,
      variables: {
        input: {
          applicationId,
          invoiceId,
          fileName: file.name,
          fileContent,
          mimeType: file.type || 'application/octet-stream',
        },
      },
    });

    const response = result.data?.uploadFileToInvoice;

    if (response?.success) {
      return {
        success: true,
        objectId: response.objectStorageId,
      };
    } else {
      return {
        success: false,
        error: response?.message || 'Upload failed',
      };
    }
  } catch (error) {
    console.error('Error uploading file to COMS:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error occurred during file upload',
    };
  }
}

/**
 * Convert file to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Get a list of files for an invoice via GraphQL
 *
 * @param applicationId The application ID (not used in GraphQL query but kept for compatibility)
 * @param invoiceId The invoice ID
 * @returns Promise with file list
 */
export async function getInvoiceFiles(
  applicationId: number,
  invoiceId: number,
) {
  try {
    const result = await apolloClientInstance.query({
      query: GET_INVOICE_ATTACHMENTS,
      variables: { invoiceId },
      fetchPolicy: 'network-only', // Always fetch fresh data
    });

    const response = result.data?.getInvoiceAttachments;
    return response?.attachments || [];
  } catch (error) {
    console.error('Error fetching invoice files:', error);
    return [];
  }
}

/**
 * Delete a file from COMS via GraphQL
 *
 * @param objectId The object ID to delete (this should be the attachment ID in our case)
 */
export async function deleteFile(objectId: string): Promise<boolean> {
  try {
    const result = await apolloClientInstance.mutate({
      mutation: DELETE_INVOICE_ATTACHMENT,
      variables: { id: parseInt(objectId) },
    });

    const response = result.data?.deleteInvoiceAttachment;
    return response?.success || false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export default {
  uploadFileToComs,
  getInvoiceFiles,
  deleteFile,
};
