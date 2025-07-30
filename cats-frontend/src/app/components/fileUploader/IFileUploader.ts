import React from 'react';

export interface IFileUploader {
  acceptedFileTypes?: Record<string, string[]>;
  multiple?: boolean;
  showPreview?: boolean;
  showPreviewLink?: boolean;
  maxSizeMB?: number;
  allowFolderDrop?: boolean;
  classNames?: {
    container?: string;
    dropArea?: string;
    label?: string;
    preview?: string;
    previewTitle?: string;
    image?: string;
    pdf?: string;
    noPreview?: string;
    previewLink?: string;
    previewLinkWrapper?: string;
    iconWrapper?: string;
    dragOver?: string;
  };
  icons?: {
    upload?: React.ReactNode;
    file?: React.ReactNode;
    folder?: React.ReactNode;
  };
  customText?: {
    dropMessage?: React.ReactNode;
    previewTitle?: React.ReactNode;
    viewFullText?: React.ReactNode;
  };
  onFileSelect?: (data: { files: File[]; previewUrls: string[] }) => void;
  onValidationError?: (message: string) => void;
  renderPreview?: (file: File, url: string) => React.ReactNode;
}
