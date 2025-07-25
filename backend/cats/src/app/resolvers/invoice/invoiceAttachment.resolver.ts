import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { InvoiceAttachmentService } from '../../services/invoice/invoiceAttachment.service';
import { LoggerService } from '../../logger/logger.service';
import { GenericValidationPipe } from '../../utilities/validations/genericValidationPipe';
import {
  InvoiceAttachmentResponse,
  InvoiceAttachmentsResponse,
  FileUploadResponse,
} from '../../dto/response/invoice/invoiceAttachmentResponse.dto';
import {
  InvoiceAttachmentInputDto,
  FileUploadInputDto,
  FileUploadMultipartInputDto,
} from '../../dto/invoice/invoiceAttachment.dto';
import { ResponseDto } from '../../dto/response/response.dto';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Resolver()
export class InvoiceAttachmentResolver {
  constructor(
    private readonly attachmentService: InvoiceAttachmentService,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => InvoiceAttachmentsResponse)
  async getInvoiceAttachments(
    @Args('invoiceId', { type: () => Int }) invoiceId: number,
  ): Promise<InvoiceAttachmentsResponse> {
    this.loggerService.log(
      `InvoiceAttachmentResolver: getInvoiceAttachments: invoiceId: ${invoiceId}`,
    );

    const response = new InvoiceAttachmentsResponse();

    try {
      const attachments = await this.attachmentService.getInvoiceAttachments(
        invoiceId,
      );

      response.attachments = attachments.map((attachment) => ({
        id: attachment.id,
        invoiceId: attachment.invoiceId,
        fileName: attachment.fileName,
        fileSize: attachment.fileSize,
        mimeType: attachment.mimeType,
        objectStorageId: attachment.objectId,
        createdAt: attachment.whenCreated,
        createdBy: attachment.whoCreated,
      }));

      response.success = true;
      response.httpStatusCode = 200;
      response.message = 'Attachments retrieved successfully';
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentResolver: getInvoiceAttachments: Error: ${error.message}`,
        error.stack,
      );
      response.success = false;
      response.httpStatusCode = 500;
      response.message = 'Failed to retrieve attachments';
    }

    return response;
  }

  @Mutation(() => FileUploadResponse)
  async uploadFileToInvoice(
    @Args('input') input: FileUploadInputDto,
    @AuthenticatedUser() user: any,
  ): Promise<FileUploadResponse> {
    this.loggerService.log(
      `InvoiceAttachmentResolver: uploadFileToInvoice: ${JSON.stringify({
        fileName: input.fileName,
        applicationId: input.applicationId,
        invoiceId: input.invoiceId,
      })}`,
    );

    const response = new FileUploadResponse();

    try {
      const attachment =
        await this.attachmentService.uploadFileAndCreateAttachment(input, user);

      response.objectStorageId = attachment.objectId;
      response.attachment = {
        id: attachment.id,
        invoiceId: attachment.invoiceId,
        fileName: attachment.fileName,
        fileSize: attachment.fileSize,
        mimeType: attachment.mimeType,
        objectStorageId: attachment.objectId,
        createdAt: attachment.whenCreated,
        createdBy: attachment.whoCreated,
      };

      response.success = true;
      response.httpStatusCode = 201;
      response.message = 'File uploaded successfully';
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentResolver: uploadFileToInvoice: Error: ${error.message}`,
        error.stack,
      );
      response.success = false;
      response.httpStatusCode = 500;
      response.message = error.message || 'Failed to upload file';
    }

    return response;
  }

  @Mutation(() => InvoiceAttachmentResponse)
  @UsePipes(new GenericValidationPipe())
  async createInvoiceAttachment(
    @Args('input') input: InvoiceAttachmentInputDto,
    @AuthenticatedUser() user: any,
  ): Promise<InvoiceAttachmentResponse> {
    this.loggerService.log(
      `InvoiceAttachmentResolver: createInvoiceAttachment: ${JSON.stringify(
        input,
      )}`,
    );

    const response = new InvoiceAttachmentResponse();

    try {
      const attachment = await this.attachmentService.createAttachment(
        input,
        user,
      );

      response.attachment = {
        id: attachment.id,
        invoiceId: attachment.invoiceId,
        fileName: attachment.fileName,
        fileSize: attachment.fileSize,
        mimeType: attachment.mimeType,
        objectStorageId: attachment.objectId,
        createdAt: attachment.whenCreated,
        createdBy: attachment.whoCreated,
      };

      response.success = true;
      response.httpStatusCode = 201;
      response.message = 'Attachment created successfully';
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentResolver: createInvoiceAttachment: Error: ${error.message}`,
        error.stack,
      );
      response.success = false;
      response.httpStatusCode = 500;
      response.message = error.message || 'Failed to create attachment';
    }

    return response;
  }

  @Mutation(() => ResponseDto)
  async deleteInvoiceAttachment(
    @Args('id', { type: () => Int }) id: number,
    @AuthenticatedUser() user: any,
  ): Promise<ResponseDto> {
    this.loggerService.log(
      `InvoiceAttachmentResolver: deleteInvoiceAttachment: id: ${id}`,
    );

    const response = new ResponseDto();

    try {
      await this.attachmentService.deleteAttachment(id, user);

      response.success = true;
      response.httpStatusCode = 200;
      response.message = 'Attachment deleted successfully';
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentResolver: deleteInvoiceAttachment: Error: ${error.message}`,
        error.stack,
      );
      response.success = false;
      response.httpStatusCode = error.status || 500;
      response.message = error.message || 'Failed to delete attachment';
    }

    return response;
  }

  @Mutation(() => FileUploadResponse)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new GenericValidationPipe())
  async uploadFileToInvoiceMultipart(
    @UploadedFile() file: MulterFile,
    @Args('input') input: FileUploadMultipartInputDto,
    @AuthenticatedUser() user: any,
  ): Promise<FileUploadResponse> {
    const response = new FileUploadResponse();

    try {
      if (!file) {
        throw new Error('No file provided');
      }

      this.loggerService.log(
        `InvoiceAttachmentResolver: uploadFileToInvoiceMultipart: ${JSON.stringify(
          {
            fileName: file.originalname,
            applicationId: input.applicationId,
            invoiceId: input.invoiceId,
            fileSize: file.size,
          },
        )}`,
      );

      // Create FileUploadInputDto from multipart data
      const uploadData: FileUploadInputDto = {
        applicationId: input.applicationId,
        invoiceId: input.invoiceId,
        fileName: file.originalname,
        fileContent: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      };

      const attachment =
        await this.attachmentService.uploadFileAndCreateAttachment(
          uploadData,
          user,
        );

      response.objectStorageId = attachment.objectId;
      response.attachment = {
        id: attachment.id,
        invoiceId: attachment.invoiceId,
        fileName: attachment.fileName,
        fileSize: attachment.fileSize,
        mimeType: attachment.mimeType,
        objectStorageId: attachment.objectId,
        createdAt: attachment.whenCreated,
        createdBy: attachment.whoCreated,
      };

      response.success = true;
      response.httpStatusCode = 201;
      response.message = 'File uploaded successfully';
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentResolver: uploadFileToInvoiceMultipart: Error: ${error.message}`,
        error.stack,
      );
      response.success = false;
      response.httpStatusCode = 500;
      response.message = error.message || 'Failed to upload file';
    }

    return response;
  }

  @Mutation(() => FileUploadResponse)
  @UsePipes(new GenericValidationPipe())
  async uploadFileToComsForInvoice(
    @Args('input') input: FileUploadInputDto,
    @AuthenticatedUser() user: any,
  ): Promise<FileUploadResponse> {
    this.loggerService.log(
      `InvoiceAttachmentResolver: uploadFileToComsForInvoice: ${JSON.stringify({
        fileName: input.fileName,
        applicationId: input.applicationId,
        invoiceId: input.invoiceId,
      })}`,
    );

    const response = new FileUploadResponse();

    try {
      // Decode the base64 file content
      const fileBuffer = Buffer.from(input.fileContent, 'base64');

      // Get or create bucket for the application
      let bucketResult =
        await this.attachmentService.getOrCreateBucketForApplication(
          input.applicationId,
        );

      if (!bucketResult.success) {
        throw new Error(bucketResult.error || 'Failed to create/get bucket');
      }

      let targetBucketId = bucketResult.bucketId!;

      // If we have an invoice ID, create a child bucket
      if (input.invoiceId) {
        const childBucketResult =
          await this.attachmentService.getOrCreateChildBucket(
            targetBucketId,
            input.invoiceId,
          );
        if (childBucketResult.success) {
          targetBucketId = childBucketResult.bucketId!;
        }
      }

      // Upload file directly to COMS
      const uploadResult = await this.attachmentService.uploadFileToComs(
        targetBucketId,
        fileBuffer,
        input.fileName,
        input.mimeType,
      );

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'File upload failed');
      }

      // If invoice exists, create attachment record
      let attachment = null;
      if (input.invoiceId && uploadResult.objectId) {
        const attachmentData: InvoiceAttachmentInputDto = {
          invoiceId: input.invoiceId,
          fileName: input.fileName,
          fileSize: fileBuffer.length,
          mimeType: input.mimeType,
          objectStorageId: uploadResult.objectId,
        };

        attachment = await this.attachmentService.createAttachment(
          attachmentData,
          user,
        );
      }

      response.objectStorageId = uploadResult.objectId;
      if (attachment) {
        response.attachment = {
          id: attachment.id,
          invoiceId: attachment.invoiceId,
          fileName: attachment.fileName,
          fileSize: attachment.fileSize,
          mimeType: attachment.mimeType,
          objectStorageId: attachment.objectStorageId,
          createdAt: attachment.createdAt,
          createdBy: attachment.createdBy,
        };
      }

      response.success = true;
      response.httpStatusCode = 201;
      response.message = 'File uploaded successfully to COMS';
    } catch (error) {
      this.loggerService.error(
        `InvoiceAttachmentResolver: uploadFileToComsForInvoice: Error: ${error.message}`,
        error.stack,
      );
      response.success = false;
      response.httpStatusCode = 500;
      response.message = error.message || 'Failed to upload file to COMS';
    }

    return response;
  }
}
