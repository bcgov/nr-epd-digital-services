import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceAttachment } from '../../entities/invoiceAttachment.entity';
import { LoggerService } from '../../logger/logger.service';
import {
  ComsService,
  ComsUploadResult,
  ComsBucketResult,
} from '../coms/coms.service';
import {
  InvoiceAttachmentInputDto,
  FileUploadInputDto,
} from '../../dto/invoice/invoiceAttachment.dto';

@Injectable()
export class InvoiceAttachmentService {
  constructor(
    @InjectRepository(InvoiceAttachment)
    private readonly attachmentRepository: Repository<InvoiceAttachment>,
    private readonly comsService: ComsService,
    private readonly loggerService: LoggerService,
  ) {}

  /**
   * Get all attachments for an invoice
   */
  async getInvoiceAttachments(invoiceId: number): Promise<InvoiceAttachment[]> {
    this.loggerService.log(
      `InvoiceAttachmentService: getInvoiceAttachments: invoiceId: ${invoiceId}`,
    );

    try {
      const attachments = await this.attachmentRepository.find({
        where: { invoiceId },
        order: { whenCreated: 'DESC' },
      });

      this.loggerService.log(
        `InvoiceAttachmentService: getInvoiceAttachments: Found ${attachments.length} attachments`,
      );

      return attachments;
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentService: getInvoiceAttachments: Error: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch invoice attachments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload a file and create attachment record
   */
  async uploadFileAndCreateAttachment(
    uploadData: FileUploadInputDto,
    user: any,
  ): Promise<InvoiceAttachment> {
    this.loggerService.log(
      `InvoiceAttachmentService: uploadFileAndCreateAttachment: ${JSON.stringify(
        {
          fileName: uploadData.fileName,
          applicationId: uploadData.applicationId,
          invoiceId: uploadData.invoiceId,
        },
      )}`,
    );

    try {
      // Decode the base64 file content
      const fileBuffer = Buffer.from(uploadData.fileContent, 'base64');

      // Upload to COMS
      const uploadResult = await this.comsService.uploadFile(
        fileBuffer,
        uploadData.fileName,
        uploadData.mimeType,
        uploadData.applicationId,
        uploadData.invoiceId,
        user,
      );

      if (!uploadResult.success) {
        throw new HttpException(
          uploadResult.error || 'File upload failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // If invoice exists, create attachment record
      let attachment: InvoiceAttachment | null = null;
      if (uploadData.invoiceId && uploadResult.objectId) {
        const attachmentData: InvoiceAttachmentInputDto = {
          invoiceId: uploadData.invoiceId,
          fileName: uploadData.fileName,
          fileSize: fileBuffer.length,
          mimeType: uploadData.mimeType,
          objectStorageId: uploadResult.objectId,
        };

        attachment = await this.createAttachment(attachmentData, user);
      }

      this.loggerService.log(
        `InvoiceAttachmentService: uploadFileAndCreateAttachment: Success`,
      );

      // Return a temporary attachment object for files uploaded without invoice ID
      return (
        attachment ||
        ({
          id: 0, // Temporary ID
          invoiceId: uploadData.invoiceId || 0,
          fileName: uploadData.fileName,
          fileSize: fileBuffer.length,
          mimeType: uploadData.mimeType,
          objectId: uploadResult.objectId!,
          whoUpdated: user?.name || 'system',
          whenCreated: new Date(),
          whenUpdated: new Date(),
        } as InvoiceAttachment)
      );
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentService: uploadFileAndCreateAttachment: Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Create attachment record in database
   */
  async createAttachment(
    attachmentData: InvoiceAttachmentInputDto,
    user: any,
  ): Promise<InvoiceAttachment> {
    this.loggerService.log(
      `InvoiceAttachmentService: createAttachment: ${JSON.stringify(
        attachmentData,
      )}`,
    );

    try {
      const attachment = this.attachmentRepository.create({
        ...attachmentData,
        whoCreated: user?.name || 'system',
      });

      const savedAttachment = await this.attachmentRepository.save(attachment);

      this.loggerService.log(
        `InvoiceAttachmentService: createAttachment: Success. ID: ${savedAttachment.id}`,
      );

      return savedAttachment;
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentService: createAttachment: Error: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to create attachment record',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete attachment and remove from COMS
   */
  async deleteAttachment(id: number, user: any): Promise<boolean> {
    this.loggerService.log(
      `InvoiceAttachmentService: deleteAttachment: id: ${id}`,
    );

    try {
      // Find the attachment
      const attachment = await this.attachmentRepository.findOne({
        where: { id },
      });

      if (!attachment) {
        throw new HttpException('Attachment not found', HttpStatus.NOT_FOUND);
      }

      // Delete from COMS
      const comsDeleteSuccess = await this.comsService.deleteFile(
        attachment.objectId,
      );

      if (!comsDeleteSuccess) {
        this.loggerService.warn(
          `InvoiceAttachmentService: deleteAttachment: Failed to delete from COMS, continuing with database deletion`,
        );
      }

      // Delete from database
      await this.attachmentRepository.remove(attachment);

      this.loggerService.log(
        `InvoiceAttachmentService: deleteAttachment: Success`,
      );

      return true;
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentService: deleteAttachment: Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get or create bucket for an application following DocumentEndpoints.ts pattern
   */
  async getOrCreateBucketForApplication(
    applicationId: number,
  ): Promise<ComsBucketResult> {
    this.loggerService.log(
      `InvoiceAttachmentService: getOrCreateBucketForApplication: applicationId: ${applicationId}`,
    );

    try {
      return await this.comsService.createBucket(applicationId);
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentService: getOrCreateBucketForApplication: Error: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to get or create bucket for application',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get or create child bucket for an invoice following DocumentEndpoints.ts pattern
   */
  async getOrCreateChildBucket(
    parentBucketId: string,
    invoiceId: number,
  ): Promise<ComsBucketResult> {
    this.loggerService.log(
      `InvoiceAttachmentService: getOrCreateChildBucket: parentBucketId: ${parentBucketId}, invoiceId: ${invoiceId}`,
    );

    try {
      return await this.comsService.createChildBucket(
        parentBucketId,
        invoiceId,
      );
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentService: getOrCreateChildBucket: Error: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to get or create child bucket for invoice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload file to COMS following DocumentEndpoints.ts pattern
   */
  async uploadFileToComs(
    bucketId: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<ComsUploadResult> {
    this.loggerService.log(
      `InvoiceAttachmentService: uploadFileToComs: fileName: ${fileName}, bucketId: ${bucketId}`,
    );

    try {
      return await this.comsService.createObject(
        bucketId,
        fileBuffer,
        fileName,
        mimeType,
      );
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentService: uploadFileToComs: Error: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to upload file to COMS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
