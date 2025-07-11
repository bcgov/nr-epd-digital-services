import { ObjectType, Field } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { InvoiceAttachmentDto } from '../../invoice/invoiceAttachment.dto';

@ObjectType()
export class InvoiceAttachmentResponse extends ResponseDto {
  @Field(() => InvoiceAttachmentDto, { nullable: true })
  attachment?: InvoiceAttachmentDto;
}

@ObjectType()
export class InvoiceAttachmentsResponse extends ResponseDto {
  @Field(() => [InvoiceAttachmentDto], { nullable: true })
  attachments?: InvoiceAttachmentDto[];
}

@ObjectType()
export class FileUploadResponse extends ResponseDto {
  @Field({ nullable: true })
  objectStorageId?: string;

  @Field(() => InvoiceAttachmentDto, { nullable: true })
  attachment?: InvoiceAttachmentDto;
}
