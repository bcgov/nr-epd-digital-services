import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { FaFileUpload, FaTrash } from 'react-icons/fa';
import './FileUpload.css';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedFileTypes?: Record<string, string[]>;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
  isLoading?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'error';
  error?: string;
  objectStorageId?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedFileTypes,
  uploadedFiles,
  onRemoveFile,
  isLoading = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      // Validate number of files
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files.`);
        return;
      }

      // Validate file size
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSizeInBytes,
      );
      if (oversizedFiles.length > 0) {
        setError(
          `Some files exceed the ${maxSizeInMB}MB limit: ${oversizedFiles.map((f) => f.name).join(', ')}`,
        );
        return;
      }

      onFilesSelected(acceptedFiles);
    },
    [maxFiles, maxSizeInMB, onFilesSelected, uploadedFiles.length],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: maxFiles - uploadedFiles.length,
  });

  useEffect(() => {
    // Clear errors when uploads change
    if (uploadedFiles.some((file) => file.status === 'error')) {
      setError('One or more files failed to upload.');
    }
  }, [uploadedFiles]);

  return (
    <div className="file-upload-container mb-4">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${
          uploadedFiles.length >= maxFiles ? 'disabled' : ''
        }`}
      >
        <input
          {...getInputProps()}
          disabled={uploadedFiles.length >= maxFiles}
        />
        <FaFileUpload className="upload-icon" />
        <p>
          {isDragActive
            ? 'Drop files here...'
            : uploadedFiles.length >= maxFiles
              ? `Maximum ${maxFiles} files reached`
              : `Drag and drop files here, or click to select files`}
        </p>
        <small className="text-muted">
          Maximum {maxFiles} files, up to {maxSizeInMB}MB each
        </small>
      </div>

      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}

      {isLoading && (
        <div className="text-center mt-3">
          <Spinner animation="border" role="status" size="sm" />
          <span className="ms-2">Uploading files...</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files mt-3">
          <h6>Attached Files:</h6>
          <ul className="list-group">
            {uploadedFiles.map((file) => (
              <li
                key={file.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <span className="file-name">{file.name}</span>
                  <small className="text-muted ms-2">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </small>
                  {file.status === 'error' && (
                    <small className="text-danger ms-2">
                      {file.error || 'Upload failed'}
                    </small>
                  )}
                  {file.status === 'uploading' && (
                    <Spinner animation="border" size="sm" className="ms-2" />
                  )}
                </div>
                <Button
                  variant="link"
                  className="text-danger p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveFile(file.id);
                  }}
                  aria-label="Remove file"
                >
                  <FaTrash />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
