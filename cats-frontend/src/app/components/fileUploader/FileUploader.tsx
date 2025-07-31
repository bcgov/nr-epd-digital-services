import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import clsx from 'clsx';
import { IFileUploader } from './IFileUploader';
import './FileUploader.css';
import { PaperclipIcon } from '../common/icon';

const FileUploader: React.FC<IFileUploader> = ({
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
  },
  multiple = false,
  showPreview = false,
  showPreviewLink = false,
  maxSizeMB = 10,
  classNames = {},
  icons = {},
  customText = {},
  onFileSelect,
  onValidationError,
  renderPreview,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleClick = () => inputRef.current?.click();

  const validateFile = (file: File): boolean => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      onValidationError?.(`File exceeds ${maxSizeMB}MB limit.`);
      return false;
    }
    return true;
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const validFiles: File[] = [];
    const urls: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file);
        urls.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length) {
      setFiles(multiple ? validFiles : [validFiles[0]]);
      setPreviewUrls(multiple ? urls : [urls[0]]);
      onFileSelect?.({
        files: multiple ? validFiles : [validFiles[0]],
        previewUrls: multiple ? urls : [urls[0]],
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = ''; // Reset input value so same file can be uploaded again
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const flatAccept = Object.values(acceptedFileTypes).flat().join(',');

  return (
    <div
      className={clsx(
        !classNames?.container && 'fu-container',
        classNames.container,
      )}
    >
      <div
        className={clsx(
          !classNames?.dropArea && 'fu-drop-area',
          !classNames?.dragOver && isDragOver && 'fu-drag-over',
          classNames.dropArea,
          isDragOver && classNames.dragOver,
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={flatAccept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple={multiple}
        />
        <div
          className={clsx(
            !classNames?.iconWrapper && 'fu-icon-wrapper',
            classNames.iconWrapper,
          )}
        >
          {icons.upload || <PaperclipIcon />}
          <div
            className={clsx(!classNames?.label && 'fu-label', classNames.label)}
          >
            {customText.dropMessage ||
              (files.length > 0
                ? files.map((f) => f.name).join(', ')
                : 'Drag file(s) here or click to select')}
          </div>
        </div>
      </div>

      {files.length > 0 && (showPreview || showPreviewLink) && (
        <div
          className={clsx(
            !classNames?.preview && 'fu-preview',
            classNames.preview,
          )}
        >
          <p
            className={clsx(
              !classNames?.previewTitle && 'fu-preview-title',
              classNames.previewTitle,
            )}
          >
            {customText.previewTitle || 'File Preview'}
          </p>

          {files.map((file, index) => {
            const previewUrl = previewUrls[index];
            const fileType = file.type;

            return (
              <div key={index}>
                {showPreview && (
                  <>
                    {renderPreview ? (
                      renderPreview(file, previewUrl)
                    ) : (
                      <>
                        {previewUrl && fileType.startsWith('image/') && (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className={clsx(
                              !classNames?.image && 'fu-image',
                              classNames.image,
                            )}
                          />
                        )}

                        {previewUrl && fileType === 'application/pdf' && (
                          <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            sandbox=""
                            className={clsx(
                              !classNames?.pdf && 'fu-pdf',
                              classNames.pdf,
                            )}
                          />
                        )}

                        {!fileType.startsWith('image/') &&
                          fileType !== 'application/pdf' && (
                            <div
                              className={clsx(
                                !classNames?.noPreview && 'fu-no-preview',
                                classNames.noPreview,
                              )}
                            >
                              {icons.file || ''} {fileType}
                            </div>
                          )}
                      </>
                    )}
                  </>
                )}

                {previewUrl && showPreviewLink && (
                  <div
                    className={clsx(
                      !classNames?.previewLinkWrapper &&
                        'fu-preview-link-wrapper',
                      classNames.previewLinkWrapper,
                    )}
                  >
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        !classNames?.previewLink && 'fu-preview-link',
                        classNames.previewLink,
                      )}
                    >
                      {file?.name || customText.viewFullText || 'View File'}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
