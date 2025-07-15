import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FileUpload, { UploadedFile } from './FileUpload';
import { uploadFileToComs, deleteFile } from '../../services/ComsService';
import {
  useCreateInvoiceAttachmentMutation,
  useGetInvoiceAttachmentsQuery,
  useDeleteInvoiceAttachmentMutation,
} from '../../invoiceAttachments.generated';

interface InvoiceAttachmentProps {
  invoiceId?: number;
  applicationId: number;
  readOnly?: boolean;
}

const InvoiceAttachments: React.FC<InvoiceAttachmentProps> = ({
  invoiceId,
  applicationId,
  readOnly = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // GraphQL mutations and queries
  const [createAttachment] = useCreateInvoiceAttachmentMutation();
  const [deleteAttachment] = useDeleteInvoiceAttachmentMutation();
  const {
    data: attachmentsData,
    loading: loadingAttachments,
    refetch,
  } = useGetInvoiceAttachmentsQuery({
    variables: { invoiceId: invoiceId || 0 },
    skip: !invoiceId,
  });

  // Load existing attachments when invoice ID changes
  useEffect(() => {
    if (invoiceId && attachmentsData?.getInvoiceAttachments.attachments) {
      const existingFiles =
        attachmentsData.getInvoiceAttachments.attachments.map((attachment) => ({
          id: attachment.id.toString(),
          name: attachment.fileName,
          size: attachment.fileSize,
          type: attachment.mimeType,
          status: 'uploaded' as const,
          objectStorageId: attachment.objectStorageId,
        }));

      setUploadedFiles(existingFiles);
    }
  }, [invoiceId, attachmentsData]);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      if (!applicationId) {
        console.error('Cannot upload files: Missing application ID');
        return;
      }

      // Create temporary entries with "uploading" status
      const newUploadedFiles = files.map((file) => ({
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading' as const,
      }));

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
      setUploading(true);

      try {
        // Upload all files to COMS in parallel
        const uploadResults = await Promise.all(
          files.map((file, index) =>
            uploadFileToComs(file, applicationId, invoiceId || 0).then(
              (uploadResult) => ({
                file,
                tempId: newUploadedFiles[index].id,
                uploadResult,
              }),
            ),
          ),
        );

        // For each upload result, handle attachment creation or error
        await Promise.all(
          uploadResults.map(async ({ file, tempId, uploadResult }) => {
            if (uploadResult.success && uploadResult.objectId) {
              if (invoiceId) {
                try {
                  const result = await createAttachment({
                    variables: {
                      input: {
                        invoiceId,
                        fileName: file.name,
                        fileSize: file.size,
                        mimeType: file.type || 'application/octet-stream',
                        objectStorageId: uploadResult.objectId,
                      },
                    },
                  });

                  if (result.data?.createInvoiceAttachment.success) {
                    setUploadedFiles((prev) =>
                      prev.map((f) =>
                        f.id === tempId
                          ? {
                              ...f,
                              id: result.data!.createInvoiceAttachment.attachment!.id.toString(),
                              status: 'uploaded',
                              objectStorageId: uploadResult.objectId,
                            }
                          : f,
                      ),
                    );
                  } else {
                    throw new Error(
                      result.data?.createInvoiceAttachment.message ||
                        'Failed to create attachment record',
                    );
                  }
                } catch (error) {
                  console.error('Error creating attachment record:', error);
                  setUploadedFiles((prev) =>
                    prev.map((f) =>
                      f.id === tempId
                        ? {
                            ...f,
                            status: 'error',
                            error: 'Failed to create attachment record',
                          }
                        : f,
                    ),
                  );
                }
              } else {
                setUploadedFiles((prev) =>
                  prev.map((f) =>
                    f.id === tempId
                      ? {
                          ...f,
                          status: 'uploaded',
                          objectStorageId: uploadResult.objectId,
                        }
                      : f,
                  ),
                );
              }
            } else {
              setUploadedFiles((prev) =>
                prev.map((f) =>
                  f.id === tempId
                    ? {
                        ...f,
                        status: 'error',
                        error: uploadResult.error || 'Upload failed',
                      }
                    : f,
                ),
              );
            }
          }),
        );
      } finally {
        setUploading(false);
      }
    },
    [applicationId, invoiceId, createAttachment],
  );

  const handleRemoveFile = useCallback(
    async (fileId: string) => {
      // Find the file in our list
      const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
      if (!fileToRemove) return;

      try {
        // If this is a saved attachment (has numeric ID), delete it from the database
        if (invoiceId && !isNaN(Number(fileId))) {
          const result = await deleteAttachment({
            variables: { id: parseInt(fileId) },
          });

          if (result.data?.deleteInvoiceAttachment.success) {
            // Also delete from COMS if we have the object ID
            if (fileToRemove.objectStorageId) {
              await deleteFile(fileToRemove.objectStorageId);
            }

            // Remove from local state
            setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
          } else {
            console.error(
              'Failed to delete attachment:',
              result.data?.deleteInvoiceAttachment.message,
            );
          }
        } else {
          // For files that aren't saved yet (temp uploads or new invoice)
          if (fileToRemove.objectStorageId) {
            await deleteFile(fileToRemove.objectStorageId);
          }

          // Remove from local state
          setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
        }
      } catch (error) {
        console.error('Error removing file:', error);
      }
    },
    [uploadedFiles, invoiceId, deleteAttachment],
  );

  return (
    <div className="invoice-attachments">
      <h4>Attachments</h4>

      <FileUpload
        onFilesSelected={handleFilesSelected}
        uploadedFiles={uploadedFiles}
        onRemoveFile={handleRemoveFile}
        isLoading={uploading}
        maxFiles={5}
        maxSizeInMB={10}
        acceptedFileTypes={{
          'application/pdf': ['.pdf'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png'],
          'application/msword': ['.doc'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            ['.docx'],
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
            '.xlsx',
          ],
        }}
      />
    </div>
  );
};

export default InvoiceAttachments;
