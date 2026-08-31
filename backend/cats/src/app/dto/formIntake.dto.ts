import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsObject, IsOptional, IsUUID } from 'class-validator';
import { ResponseDto } from './response/response.dto';

export class ChefsWebhookPayloadDto {
  @IsOptional()
  @IsUUID()
  formId?: string;

  @IsOptional()
  @IsUUID()
  submissionId?: string;

  @IsOptional()
  @IsBoolean()
  draft?: boolean;

  @IsOptional()
  @IsObject()
  meta?: {
    formId?: string;
    submissionId?: string;
    draft?: boolean;
    [key: string]: any;
  };
}

@ObjectType()
export class ManualIntakeFormDto {
  @Field()
  appTypeAbbrev: string;

  @Field()
  displayName: string;
}

@ObjectType()
export class ManualIntakeFormsResponse extends ResponseDto {
  @Field(() => [ManualIntakeFormDto], { nullable: true })
  data?: ManualIntakeFormDto[];
}

@ObjectType()
export class ManualIntakeResultDto {
  @Field()
  submissionId: string;

  @Field(() => Int, { nullable: true })
  applicationId?: number | null;
}

@ObjectType()
export class ManualIntakeResponse extends ResponseDto {
  @Field(() => ManualIntakeResultDto, { nullable: true })
  data?: ManualIntakeResultDto;
}
