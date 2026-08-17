import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsArray,
} from 'class-validator';
import { ResponseDto } from './response/response.dto';

@ObjectType()
export class ApplicationSubmissionDto {
  @Field()
  id: string;

  @Field(() => Int, { nullable: true })
  applicationId?: number | null;

  @Field()
  chefsFormId: string;

  @Field()
  chefsSubmissionId: string;

  @Field({ nullable: true })
  chefsFormVersionNumber?: string | null;

  @Field({ nullable: true })
  chefsConfirmationId?: string | null;

  @Field(() => [String], { nullable: true })
  linkedConfirmationIds?: string[] | null;

  @Field({ nullable: true })
  formData?: string;

  @Field({ nullable: true })
  formSchema?: string;

  @Field({ nullable: true })
  receivedAt?: Date | null;

  @Field()
  createdBy: string;

  @Field()
  createdDateTime: Date;

  @Field()
  updatedBy: string;

  @Field()
  updatedDateTime: Date;
}

@InputType()
export class BaseApplicationSubmissionInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  applicationId?: number | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  chefsFormVersionNumber?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  chefsConfirmationId?: string | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  linkedConfirmationIds?: string[] | null;

  @Field({ nullable: true })
  @IsOptional()
  receivedAt?: Date | null;
}

@InputType()
export class CreateApplicationSubmissionInput extends BaseApplicationSubmissionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  chefsFormId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  chefsSubmissionId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  formData: string;
}

@InputType()
export class UpdateApplicationSubmissionInput extends BaseApplicationSubmissionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  formData?: string;
}

@ObjectType()
export class ApplicationSubmissionResponse extends ResponseDto {
  @Field(() => ApplicationSubmissionDto, { nullable: true })
  data?: ApplicationSubmissionDto;
}
