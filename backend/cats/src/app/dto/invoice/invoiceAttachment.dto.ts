import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsString, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';

@ObjectType()
export class InvoiceAttachmentDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  invoiceId: number;

  @Field()
  fileName: string;

  @Field(() => Int)
  fileSize: number;

  @Field()
  mimeType: string;

  @Field()
  objectStorageId: string;

  @Field()
  createdAt: Date;

  @Field()
  createdBy: string;
}

@InputType()
export class InvoiceAttachmentInputDto {
  @Field(() => Int)
  @IsNumber()
  invoiceId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @Field(() => Int)
  @IsNumber()
  fileSize: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  mimeType: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  objectStorageId: string;
}

@InputType()
export class FileUploadInputDto {
  @Field(() => Int)
  @IsNumber()
  applicationId: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  invoiceId?: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fileContent: string; // Base64 encoded file content

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  mimeType: string;
}

@InputType()
export class FileUploadMultipartInputDto {
  @Field(() => Int)
  @IsNumber()
  applicationId: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  invoiceId?: number;
}
